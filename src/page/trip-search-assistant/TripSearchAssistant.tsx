import React, {Component, ReactElement} from 'react';
import './TripSearchAssistant.css';
import withRouter from "../../helper/WithRouter";
import ChatThread from "../../model/ChatThread";
import Chat from "../../component/chat/Chat";
import {Box, Container, IconButton, InputAdornment} from "@mui/material";
import SearchAssistantStep from "../../model/SearchAssistantStep";
import ChatMessage from "../../model/ChatMessage";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Destination from "../../model/Destination";
import {CalendarMonth, Group, Hotel, LocalAirport, LocationCity, LocationOn} from "@mui/icons-material";
import SearchInput from "../../component/search-input/SearchInput";
import SearchApiService from "../../service/SearchApiService";
import DestinationType from "../../model/DestinationType";
import Nameable from "../../model/Nameable";
import {Navigate} from "react-router-dom";
import "react-datepicker/dist/react-datepicker.css";
import Progress from "../../component/progress/Progress";
import {withTranslation} from "react-i18next";
import AnswerYesNoType from "../../model/AnswerYesNoType";
import ReactGA from "react-ga4";
import ChatResponse from "../../model/ChatResponse";
import ChatMessageRole from "../../model/ChatMessageRole";
import ChatOutcomeStatus from "../../model/ChatOutcomeStatus";
import {SUPPORTED_LOCALES} from "../../App";
import DatePicker from "react-datepicker";
import DateHelper from "../../helper/DateHelper";
import TripCompanions from "../../model/TripCompanions";
import CompanionsSelect from "../../component/companions-select/CompanionsSelect";
import Carousel from "react-material-ui-carousel";
import SearchResult from "../../component/search-result/SearchResult";
import RecommendationsBox from "../../component/recommandations-box/RecommendationsBox";

class TripSearchAssistant extends Component<any, any> {

  private searchApiService = new SearchApiService();
  private readonly companionsWrapperRef: React.RefObject<any> | undefined ;

  constructor(props: any) {
    super(props);
    this.state = this.getInitialState();
    this.companionsWrapperRef = React.createRef();
    if (this.state.thread.messages[0].role === ChatMessageRole.user) {
      this.setState({ loadingQuestion: true });

      this.searchApiService.processChat(this.state.thread.messages)
        .then(response => this.processOpenChatResponse(response))
        .finally(() => this.setState({ loadingQuestion: false }));
    }
  }

  componentDidMount() {
    ReactGA.send({ hitType: "pageview", page: "/", title: "Search Assistant" });
    document.addEventListener("mousedown", this.handleClickOutside.bind(this));
    if (this.props.location?.state?.thread) {
      this.setState({thread: this.props.location?.state?.thread, currentStep: SearchAssistantStep.open_chat});
    }

  }

  componentWillUnmount() {
    document.removeEventListener("mousedown", this.handleClickOutside.bind(this));
  }

  handleClickOutside(event: { target: any }) {
    if (this.state.companionsSelectOpen && this.companionsWrapperRef && this.companionsWrapperRef.current !== null && !this.companionsWrapperRef.current.contains(event.target)) {
      this.setState({companionsSelectOpen: false});
    }
  }

  render() {
    const component = this.getStepComponent(this.state.currentStep);
    return (
      <div>
        <Progress value={this.getProgressValue(this.state.currentStep)}/>
        <Container className={"content-wrapper"}>
          <Chat
            loading={this.state.loadingQuestion}
            thread={this.state.thread}
            inputComponent={component}
            sendClickListener={() => this.handleSubmitAnswer()}
            restartClickListener={() => this.handleRestart()}
            skipClickListener={() => this.handleSkip()}
            skipButtonVisible={false}
            searchClickListener={() => this.handleSearch()}
            searchButtonVisible={(this.state.thread.messages.length > 3 || this.state.currentStatus === ChatOutcomeStatus.exceeded) }
            recommendations={this.state.recommendations}>
          </Chat>
        </Container>
      </div>
    );
  }

  private getProgressValue(step: SearchAssistantStep) {
    switch (step) {
      case SearchAssistantStep.destination_known_select:
        return 20;
      case SearchAssistantStep.destination_select:
        return 40;
      case SearchAssistantStep.open_chat:
        return 70;
      default:
        return 100;
    }
  }

  private getInitialState() {
    const chatThread = new ChatThread();
    const queryParams = new URLSearchParams(window.location.search);
    const initialMessage = queryParams.get("initial_message");
    let message;
    if (initialMessage) {
      message = new ChatMessage(ChatMessageRole.user, initialMessage);
    } else {
      message = new ChatMessage(ChatMessageRole.assistant, this.props.t('assistant.chat.question.destination_known_select'));
    }

    chatThread.messages.push(message);
    const currentStep = initialMessage ? SearchAssistantStep.open_chat : SearchAssistantStep.destination_known_select

    return {
      companionsSelectOpen: false,
      currentCompanions: new TripCompanions(),
      currentDates: null,
      currentInputValue: '',
      currentStatus: null,
      currentStep: currentStep,
      loadingQuestion: false,
      recommendations: [],
      thread: chatThread,
      searching: false
    };
  }

  private handleRestart() {
    this.setState(this.getInitialState());
  }

  private handleSkip() {
    this.setState({ currentInputValue: undefined });
    this.addAnswer('(Step skipped)');
    this.setState({ currentStep: SearchAssistantStep.complete});
  }

  private handleSearch() {
    this.handleOpenChatSubmit(this.props.t('assistant.chat.answer.suggest_search'));
  }

  private handleSubmitAnswer() {
    if (!this.state.currentInputValue || this.state.currentInputValue === '') {
      return;
    }
    const step = this.state.currentStep;
    switch (step) {
      case SearchAssistantStep.open_chat:
        this.handleOpenChatSubmit(this.state.currentInputValue);
        break;
      case SearchAssistantStep.destination_known_select:
        this.handleDestinationOrTypeSubmit(this.state.currentInputValue);
        break;
      case SearchAssistantStep.destination_select:
        this.handleDestinationSelect(this.state.currentInputValue);
        break;
      default:
    }

    this.setState({ currentInputValue: '' });
  }

  private handleInputKeyPress(e: React.KeyboardEvent<HTMLDivElement>) {
    if (e.key === 'Enter') {
      this.handleSubmitAnswer();
    }
  }

  private getStepComponent(step: SearchAssistantStep) {
    const {t} = this.props;

    if (this.state.loadingQuestion) {
      return <TextField key="search-assistant-empty-field" className={"search-assistant-step-component"} disabled={true}></TextField>
    }

    switch (step) {
      case SearchAssistantStep.open_chat:
        const inputOptions = this.getOpenChatInputOptions();
        const optionsDisplay = inputOptions.length > 0 ? 'flex' : 'none';
        return <Autocomplete
          freeSolo={this.state.currentStatus !== ChatOutcomeStatus.exceeded}
          componentsProps={{popper: {style: {display: optionsDisplay}, placement: "top-start"}}}
          disableClearable={true}
          id="search-assistant-open-chat-input"
          key="search-assistant-open-chat-input"
          className={"search-assistant-step-component"}
          autoHighlight={true}
          onChange={(e, v) => this.setState({ currentInputValue: v as string})}
          options={inputOptions}
          value={this.state.currentInputValue}
          renderInput={(params) => <TextField {...params}
                                              autoFocus={false}
                                              key={"search-assistant-chat-input-field"}
                                              onChange={e => this.setState({ currentInputValue: e.target.value as string})}
                                              onKeyDownCapture={e => this.handleInputKeyPress(e)}
                                              InputProps={{
                                                ...params.InputProps,
                                                endAdornment:
                                                  <InputAdornment position="end">
                                                    <div style={{display: "flex", flexDirection: "row", position: "relative"}}>
                                                      {this.getDatesPickerComponent()}
                                                      {this.getCompanionsSelectComponent()}
                                                    </div>
                                                  </InputAdornment>
                                              }}
          />}
        />
      case SearchAssistantStep.destination_known_select:
        return <Autocomplete
          freeSolo
          componentsProps={{popper: {placement: "top-start"}}}
          id="search-assistant-destination-or-type-select"
          key="search-assistant-destination-or-type-select"
          className={"search-assistant-step-component"}
          onChange={(e, v) => this.setState({ currentInputValue: v as string})}
          options={[AnswerYesNoType.yes, AnswerYesNoType.no]}
          getOptionLabel={o => [AnswerYesNoType.yes.toUpperCase(), AnswerYesNoType.no.toUpperCase()].includes(o) ? t('type.answerYesNoType.' + o) : o}
          autoHighlight={true}
          open={true}
          renderInput={(params) => <TextField {...params}
                                              autoFocus
                                              onChange={e => this.setState({ currentInputValue: e.target.value as string})}
                                              key={"search-assistant-destination-or-type-select-field"}
                                              onKeyDownCapture={e => this.handleInputKeyPress(e)}/>}
        />
      case SearchAssistantStep.destination_select:
        return <SearchInput
          label={undefined}
          className={"search-assistant-step-component"}
          searchFunction={query => this.searchApiService.searchDestination(query)}
          onValueChange={dest => this.setState({currentInputValue: dest as Nameable})}
          currentValue={this.state.destination}
          keyDownHandler={e => this.handleInputKeyPress(e)}
          initialOptions={this.state.destination ? [this.state.destination] : []}
          optionComponentGenerator={(props, option) => this.generateDestinationOption(props, option as Destination)}/>;
      case SearchAssistantStep.complete:
        return <Navigate to="/trip-search-results" state={{thread: this.state.thread}} replace={false} />
      default:
        return undefined;
    }
  }

  private handleDestinationSelect(dest: Nameable) {
    this.handleOpenChatSubmit(dest.name);
  }

  private handleDestinationOrTypeSubmit(value: string) {
    if (AnswerYesNoType.yes === value) {
      this.handleAnswerSubmit(SearchAssistantStep.destination_select, this.props.t('type.answerYesNoType.YES'));
    } else if (AnswerYesNoType.no === value) {
      this.handleOpenChatSubmit(this.props.t('type.answerYesNoType.NO'));
    } else {
      this.handleOpenChatSubmit(this.state.currentInputValue);
    }
  }

  private generateDestinationOption(props: any, option: Destination): ReactElement {
    return (<Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
      { this.getDestinationTypeIcon(option.type) }
      {option.name}
    </Box>);
  }

  private getDestinationTypeIcon(destinationType: DestinationType) {
    switch (destinationType) {
      case DestinationType.airport:
        return (<LocalAirport className={"destination-option-icon"} />);
      case DestinationType.hotel:
        return (<Hotel className={"destination-option-icon"} />);
      case DestinationType.city:
        return (<LocationCity className={"destination-option-icon"} />);
      default:
        return (<LocationOn className={"destination-option-icon"} />);
    }
  }

  private handleOpenChatSubmit(answer: string) {
    if (this.props.t('assistant.chat.answer.suggest_search') === answer) {
      this.setState({ currentStep: SearchAssistantStep.complete });
      return;
    }

    this.setState({ loadingQuestion: true, currentStep: SearchAssistantStep.open_chat, currentInputValue: '' });
    this.addAnswer(answer);
    const messages = this.state.thread.messages.slice(1, this.state.thread.messages.length);

    this.searchApiService.processChat(messages)
      .then(response => this.processOpenChatResponse(response))
      .finally(() => this.setState({ loadingQuestion: false }));
  }

  private handleAnswerSubmit(nextStep: SearchAssistantStep, answer: string) {
    this.setState({ loadingQuestion: true, currentStep: nextStep });
    this.addAnswer(answer);

    setTimeout(() => {
      this.addAssistantQuestion(nextStep);
      this.setState({ loadingQuestion: false });
    }, 300);
  }

  private processOpenChatResponse(response: ChatResponse) {
    const currentThread = this.state.thread;
    const text = response.message?.content ? response.message?.content : '';
    const message = new ChatMessage(ChatMessageRole.assistant, text);
    currentThread.messages.push(message);
    this.setState({ thread: currentThread, currentStatus: response.status });

    if (currentThread.messages.length > 3 && this.state.searching === false) {
      this.startSearch(currentThread);
    }
  }

  private getOpenChatInputOptions() {
    if (this.state.currentStatus === ChatOutcomeStatus.complete || this.state.currentStatus === ChatOutcomeStatus.exceeded) {
      return [this.props.t('assistant.chat.answer.suggest_search')];
    } else {
      return [];
    }
  }

  private addAssistantQuestion(step: SearchAssistantStep) {
    const currentThread = this.state.thread;
    const text = this.props.t('assistant.chat.question.' + SearchAssistantStep[step]);
    const message = new ChatMessage(ChatMessageRole.assistant, text);
    currentThread.messages.push(message);
    this.setState({ thread: currentThread });
  }

  private addAnswer(answer: string) {
    const currentThread = this.state.thread;
    const message = new ChatMessage(ChatMessageRole.user, answer);
    currentThread.messages.push(message);
    this.setState({ thread: currentThread });
  }

  private getCompanionsSelectComponent() {
    let companionsSelectOpen = this.state.companionsSelectOpen;
    return <>
      { companionsSelectOpen ? <div className={"search-assistant-companions-wrapper"}>
        <div ref={this.companionsWrapperRef} className="search-assistant-companions-select"><CompanionsSelect
          initialValueExtractor={() => this.state.currentCompanions}
          onValueChange={(v: TripCompanions) => this.onCompanionsChanged(v as TripCompanions)}>
        </CompanionsSelect></div></div> : null }
      <IconButton
        size={"small"}
        className={"search-assistant-companions-icon"}
        onClick={e => this.setState({ companionsSelectOpen: true})}>
        <Group/>
      </IconButton>
    </>;
  }

  private getDatesPickerComponent() {
    const dateLocale = SUPPORTED_LOCALES.includes(navigator.language.split('-')[0]) ? navigator.language : "en-US";
    return (
      <DatePicker
        key="search-assistant-dates-select"
        className={"search-assistant-step-component"}
        popperClassName={"search-assistant-dates-select"}
        minDate={new Date()}
        selected={this.state.currentDates && this.state.currentDates.length ? this.state.currentDates[0] : null}
        onChange={(dates: [Date | null, Date | null]) => this.onDatesChange(dates)}
        startDate={this.state.currentDates && this.state.currentDates.length ? this.state.currentDates[0] : null}
        endDate={this.state.currentDates && this.state.currentDates.length ? this.state.currentDates[1] : null}
        selectsRange
        dateFormat={DateHelper.getDateFormatString(dateLocale)}
        locale={SUPPORTED_LOCALES.includes(navigator.language.split('-')[0]) ? navigator.language.split('-')[0] : "en"}
        customInput={
          <IconButton
            size={"small"}
            className={"search-assistant-dates-select-icon"}>
            <CalendarMonth/>
          </IconButton>}
      />
    )
  }

  private onCompanionsChanged(companions: TripCompanions) {
    this.setState({ currentCompanions: companions, currentInputValue: this.getCompanionsDisplay(companions)});
  }

  private onDatesChange(value: [Date | null, Date | null]) {
    this.setState({ currentDates: value});
    const start = value && value[0] ? value[0] : undefined;
    const end = value && value[1] ? value[1] : undefined;
    if (!start || !end || start > end) {
      return;
    }
    const dateLocale = SUPPORTED_LOCALES.includes(navigator.language.split('-')[0]) ? navigator.language : "en-US";
    this.setState({ currentInputValue:  DateHelper.formatDateRange(start, end, dateLocale)});
  }

  private getCompanionsDisplay(value: TripCompanions) {
    let display = '';
    if (value) {
      display = value.adults + ' ' + this.props.t('companions.adults');
      if (value.children && value.children > 0) {
        display += ', ' + value.children + ' ' + this.props.t('companions.children') + ' (';

        for(let i=0; i<value.children; i++) {
          if (i !== 0) {
            display += ' & '
          }
          display += '' + value.childrenAges?.[i];
        }
        display += ')';
      } else {
        display += ', 0 ' + this.props.t('companions.children');
      }
    }
    return display;
  }

  private startSearch(thread: ChatThread) {
    this.setState({
      searching: true
    });

    this.searchApiService.findMatchingAccommodations(thread, 5)
      .then(res => this.setState({recommendations: res, searching: false}))
      .finally(() => this.setState({
        searching: false
      }));
  }
}

export default withTranslation()(withRouter(TripSearchAssistant));
