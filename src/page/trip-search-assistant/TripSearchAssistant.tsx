import React, {Component, ReactElement} from 'react';
import './TripSearchAssistant.css';
import TripSearch from "../../model/TripSearch";
import withRouter from "../../helper/WithRouter";
import ChatThread from "../../model/ChatThread";
import Chat from "../../component/chat/Chat";
import {Box, Container} from "@mui/material";
import SearchAssistantStep from "../../model/SearchAssistantStep";
import ChatMessage from "../../model/ChatMessage";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Destination from "../../model/Destination";
import {Hotel, LocalAirport, LocationCity, LocationOn} from "@mui/icons-material";
import SearchInput from "../../component/search-input/SearchInput";
import SearchApiService from "../../service/SearchApiService";
import DestinationType from "../../model/DestinationType";
import Nameable from "../../model/Nameable";
import Accommodation from "../../model/Accommodation";
import {Navigate} from "react-router-dom";
import Tag from "../../model/Tag";
import "react-datepicker/dist/react-datepicker.css";
import Progress from "../../component/progress/Progress";
import {withTranslation} from "react-i18next";
import AnswerYesNoType from "../../model/AnswerYesNoType";
import ReactGA from "react-ga4";
import ChatResponse from "../../model/ChatResponse";
import ChatMessageRole from "../../model/ChatMessageRole";
import ChatOutcomeStatus from "../../model/ChatOutcomeStatus";

class TripSearchAssistant extends Component<any, any> {

  private searchApiService = new SearchApiService();
  private readonly companionsWrapperRef: React.RefObject<any> | undefined ;

  constructor(props: any) {
    super(props);
    this.state = this.getInitialState();
    this.companionsWrapperRef = React.createRef();
  }

  componentDidMount() {
    ReactGA.send({ hitType: "pageview", page: "/", title: "Search Assistant" });
    document.addEventListener("mousedown", this.handleClickOutside.bind(this));
    this.searchApiService.getAllTags()
      .then(tags => this.setState({tags: tags}));
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
            skipButtonVisible={this.state.currentStep===SearchAssistantStep.tags_select || this.state.currentStep===SearchAssistantStep.previous_locations_select }>
          </Chat>
        </Container>
      </div>
    );
  }

  private getProgressValue(step: SearchAssistantStep) {
    switch (step) {
      case SearchAssistantStep.destination_known_select:
        return 10;
      case SearchAssistantStep.destination_select:
        return 20;
      case SearchAssistantStep.open_chat:
        return 30;
      case SearchAssistantStep.tags_select:
        return 75;
      case SearchAssistantStep.previous_locations_select:
        return 90;
      default:
        return 100;
    }
  }

  private getInitialState() {
    const tripSearch = new TripSearch();
    const chatThread = new ChatThread();
    const message = new ChatMessage(ChatMessageRole.assistant, this.props.t('assistant.chat.question.destination_known_select'));
    chatThread.messages.push(message);

    return {
      tripSearch: tripSearch,
      thread: chatThread,
      currentStep: SearchAssistantStep.destination_known_select,
      loadingQuestion: false,
      currentInputValue: null,
      tags: [],
      currentOutcome: null,
      currentStatus: null
    };
  }

  private handleRestart() {
    this.setState(this.getInitialState());
  }

  private handleSkip() {
    this.setState({ currentInputValue: undefined });
    this.addAnswer('(Step skipped)');
    switch (this.state.currentStep) {
      case SearchAssistantStep.tags_select:
        this.setState({ currentStep: SearchAssistantStep.previous_locations_select});
        break;
      default:
        this.setState({ currentStep: SearchAssistantStep.complete});
    }
  }

  private handleSubmitAnswer() {
    if (!this.state.currentInputValue) {
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
      case SearchAssistantStep.tags_select:
        this.handleTagsSubmit(this.state.currentInputValue);
        break;
      case SearchAssistantStep.previous_locations_select:
        this.handlePreviousLocationsSubmit(this.state.currentInputValue);
        break;
      default:
    }

    this.setState({ currentInputValue: undefined });
  }

  private handleInputKeyPress(e: React.KeyboardEvent<HTMLDivElement>) {
    if (e.key === 'Enter') {
      this.handleSubmitAnswer();
    }
  }

  private getStepComponent(step: SearchAssistantStep) {
    const {t} = this.props;

    if (this.state.loadingQuestion) {
      return <TextField className={"search-assistant-step-component"} disabled={true}></TextField>
    }

    switch (step) {
      case SearchAssistantStep.open_chat:
        return <Autocomplete
          freeSolo={this.state.currentStatus !== ChatOutcomeStatus.exceeded}
          componentsProps={{popper: {placement: "top-start"}}}
          id="search-assistant-open-chat-input"
          key="search-assistant-open-chat-input"
          className={"search-assistant-step-component"}
          onChange={(e, v) => this.setState({ currentInputValue: v as string})}
          options={[this.getOpenChatInputOptions()]}
          autoHighlight={true}
          autoSelect={true}
          renderInput={(params) => <TextField {...params}
                                              autoFocus
                                              onKeyDownCapture={e => this.handleInputKeyPress(e)}/>}
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
          getOptionLabel={o => t('type.answerYesNoType.' + o)}
          autoHighlight={true}
          renderInput={(params) => <TextField {...params}
                                              autoFocus
                                              onKeyDownCapture={e => this.handleInputKeyPress(e)}/>}
        />
      case SearchAssistantStep.destination_select:
        return <SearchInput
          label={undefined}
          className={"search-assistant-step-component"}
          searchFunction={query => this.searchApiService.searchDestination(query)}
          onValueChange={dest => this.setState({currentInputValue: dest as Nameable})}
          currentValue={this.state.tripSearch?.tripDetails?.destination}
          keyDownHandler={e => this.handleInputKeyPress(e)}
          initialOptions={this.state.tripSearch?.tripDetails.destination ? [this.state.tripSearch.tripDetails.destination] : []}
          optionComponentGenerator={(props, option) => this.generateDestinationOption(props, option as Destination)}/>;
      case SearchAssistantStep.tags_select:
        return <Autocomplete
          multiple
          componentsProps={{popper: {placement: "top-start"}}}
          id="search-assistant-tags-select"
          key="search-assistant-tags-select"
          className={"search-assistant-step-component search-assistant-tags-select"}
          onChange={(e, v) => this.setState({ currentInputValue: v as Tag[]})}
          options={this.state.tags}
          getOptionLabel={(tag: Tag) => tag.name as string}
          autoHighlight={true}
          renderInput={(params) => (
            <TextField{...params} autoFocus onKeyDownCapture={e => this.handleInputKeyPress(e)}/>
          )}
        />;
      case SearchAssistantStep.previous_locations_select:
        return <SearchInput
          multiple={true}
          key={"search-assistant-previous-locations"}
          searchFunction={query => this.searchApiService.searchAccommodation(query)}
          onValueChange={dest => this.setState({currentInputValue: dest as Nameable})}
          currentValue={this.state.previousLocations?.locations}
          keyDownHandler={e => this.handleInputKeyPress(e)}
          initialOptions={this.state.previousLocations?.locations ? this.state.previousLocations?.locations : []}
          className={"search-assistant-step-component"}
          optionComponentGenerator={(props, option) => this.generateLocationOption(props, option as Accommodation)}
          startAdornment={<Hotel className={"location-start-icon"}/>}></SearchInput>;
      case SearchAssistantStep.complete:
        return <Navigate to="/trip-search-results" state={{tripSearch: this.state.tripSearch}} replace={false} />
      default:
        return undefined;
    }
  }

  private handleDestinationSelect(dest: Nameable) {
    const tripDetails = {
      ...this.state.tripSearch.tripDetails,
      category: null,
      destination: dest
    };
    this.setState({
      tripSearch: {
        ...this.state.tripSearch,
        tripDetails: tripDetails
      }
    });
    this.handleOpenChatSubmit(dest.name);
  }

  private handleDestinationOrTypeSubmit(value: string) {
    if (AnswerYesNoType.yes === value) {
      this.handleAnswerSubmit(SearchAssistantStep.destination_select, this.props.t('type.answerYesNoType.YES'));
    } else {
      this.handleOpenChatSubmit(this.props.t('type.answerYesNoType.NO'));
    }
  }

  private handleTagsSubmit(value: Tag[]) {
    const tags = {
      ...this.state.tripSearch.tags,
      tags: value.map(t => t.id)
    };
    this.setState({
      tripSearch: {
        ...this.state.tripSearch,
        tags: tags
      }
    });
    this.handleAnswerSubmit(SearchAssistantStep.previous_locations_select, value.map(tag => tag.name).join(', '));
  }

  private handlePreviousLocationsSubmit(value: Accommodation[]) {
    const locations = {
      ...this.state.previousLocations,
      locations: value
    };
    this.setState({
      tripSearch: {
        ...this.state.tripSearch,
        previousLocations: locations
      }
    });
    this.handleAnswerSubmit(SearchAssistantStep.complete, value.map(l => l.name).join(', '));
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
      const nextStep = this.state.currentOutcome?.accommodations?.length > 20 ? SearchAssistantStep.tags_select : SearchAssistantStep.complete;
      this.handleAnswerSubmit(nextStep, answer);
      return;
    }

    this.setState({ loadingQuestion: true, currentStep: SearchAssistantStep.open_chat });
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
    this.setState({ thread: currentThread, currentOutcome: response.outcome, currentStatus: response.status });
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

  private generateLocationOption(props: any, option: Accommodation): ReactElement {
    return (<Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
      <div className={"location-option-wrapper"}>
        <Hotel className={"location-option-icon"} />
        <div className={"location-wrapper-text"}>
          <div className={"location-wrapper-title"}>
            {option.name}
          </div>
          <div className={"location-wrapper-subtitle"}>
            {option.city + ', ' + option.country}
          </div>
        </div>
      </div>
    </Box>);
  }
}

export default withTranslation()(withRouter(TripSearchAssistant));
