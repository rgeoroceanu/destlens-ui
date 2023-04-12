import React, {Component, ReactElement} from 'react';
import './TripSearchAssistant.css';
import TripSearch from "../../model/TripSearch";
import withRouter from "../../helper/WithRouter";
import ChatThread from "../../model/ChatThread";
import Chat from "../../component/chat/Chat";
import {Box, Container, MenuItem, Select} from "@mui/material";
import SearchAssistantStep from "../../model/SearchAssistantStep";
import ChatMessage from "../../model/ChatMessage";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import TripType from "../../model/TripType";
import Destination from "../../model/Destination";
import {Hotel, LocalAirport, LocationCity, LocationOn} from "@mui/icons-material";
import SearchInput from "../../component/search-input/SearchInput";
import SearchApiService from "../../service/SearchApiService";
import DestinationType from "../../model/DestinationType";
import Nameable from "../../model/Nameable";
import DurationType from "../../model/DurationType";
import PeriodType from "../../model/PeriodType";
import DatePicker from "react-datepicker";
import CompanionsSelect from "../../component/companions-select/CompanionsSelect";
import TripTerms from "../../model/TripTerms";
import Accommodation from "../../model/Accommodation";
import {Navigate} from "react-router-dom";
import Tag from "../../model/Tag";
import "react-datepicker/dist/react-datepicker.css";
import {SUPPORTED_LOCALES} from '../../App';
import Progress from "../../component/progress/Progress";
import {withTranslation} from "react-i18next";
import AnswerYesNoType from "../../model/AnswerYesNoType";
import DateHelper from "../../helper/DateHelper";

class TripSearchAssistant extends Component<any, any> {

  private searchApiService = new SearchApiService();
  private readonly companionsWrapperRef: React.RefObject<any> | undefined ;

  constructor(props: any) {
    super(props);
    this.state = this.getInitialState();
    this.companionsWrapperRef = React.createRef();
  }

  componentDidMount() {
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
            previousClickListener={() => this.handlePrevious()}
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
      case SearchAssistantStep.type_select:
        return 20;
      case SearchAssistantStep.destination_select:
        return 20;
      case SearchAssistantStep.period_known_select:
        return 30;
      case SearchAssistantStep.period_duration_select:
        return 45;
      case SearchAssistantStep.period_season_select:
        return 55;
      case SearchAssistantStep.period_dates_select:
        return 45;
      case SearchAssistantStep.companions_select:
        return 60;
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
    const message = new ChatMessage(false, this.props.t('assistant.chat.question.destination_known_select'));
    chatThread.messages.push(message);

    return {
      tripSearch: tripSearch,
      thread: chatThread,
      currentStep: SearchAssistantStep.destination_known_select,
      loadingQuestion: false,
      currentInputValue: null,
      companionsSelectOpen: false,
      tags: []
    };
  }

  private handleRestart() {
    this.setState(this.getInitialState());
  }

  private handlePrevious() {
    let previousStep = SearchAssistantStep.destination_known_select;
    switch (this.state.currentStep) {
      case SearchAssistantStep.destination_known_select:
        previousStep = SearchAssistantStep.destination_known_select;
        break;
      case SearchAssistantStep.type_select:
        previousStep = SearchAssistantStep.destination_known_select;
        break;
      case SearchAssistantStep.destination_select:
        previousStep = SearchAssistantStep.destination_known_select;
        break;
      case SearchAssistantStep.period_known_select:
        previousStep = SearchAssistantStep.destination_known_select;
        break;
      case SearchAssistantStep.period_duration_select:
        previousStep = SearchAssistantStep.period_known_select;
        break;
      case SearchAssistantStep.period_season_select:
        previousStep = SearchAssistantStep.period_duration_select;
        break;
      case SearchAssistantStep.period_dates_select:
        previousStep = SearchAssistantStep.period_known_select;
        break;
      case SearchAssistantStep.companions_select:
        previousStep = SearchAssistantStep.period_known_select;
        break;
      case SearchAssistantStep.tags_select:
        previousStep = SearchAssistantStep.companions_select;
        break;
      case SearchAssistantStep.previous_locations_select:
        previousStep = SearchAssistantStep.tags_select;
        break;
      default:
    }
    const thread = this.state.thread;
    thread.messages.pop();
    this.setState({ loadingQuestion: true });
    setTimeout(() => {
      this.addAssistantQuestion(previousStep);
      this.setState({ currentInputValue: undefined, currentStep: previousStep, thread: thread, loadingQuestion: false });
    }, 1000);
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
      case SearchAssistantStep.destination_known_select:
        this.handleDestinationOrTypeSubmit(this.state.currentInputValue);
        break;
      case SearchAssistantStep.type_select:
        this.handlePurposeSelect(this.state.currentInputValue);
        break;
      case SearchAssistantStep.destination_select:
        this.handleDestinationSelect(this.state.currentInputValue);
        break;
      case SearchAssistantStep.period_known_select:
        this.handlePeriodKnownSelect(this.state.currentInputValue);
        break;
      case SearchAssistantStep.period_duration_select:
        this.handlePeriodDurationSubmit(this.state.currentInputValue);
        break;
      case SearchAssistantStep.period_season_select:
        this.handlePeriodSeasonSubmit(this.state.currentInputValue);
        break;
      case SearchAssistantStep.period_dates_select:
        this.handlePeriodDatesSubmit(this.state.currentInputValue);
        break;
      case SearchAssistantStep.companions_select:
        this.handleCompanionsSubmit(this.state.currentInputValue);
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
    const dateLocale = SUPPORTED_LOCALES.includes(navigator.language.split('-')[0]) ? navigator.language : "en-US";

    if (this.state.loadingQuestion) {
      return <TextField className={"search-assistant-step-component"} disabled={true}></TextField>
    }
    switch (step) {
      case SearchAssistantStep.destination_known_select:
        return <Autocomplete
          componentsProps={{popper: {placement: "top-start"}}}
          id="search-assistant-destination-or-type-select"
          key="search-assistant-destination-or-type-select"
          className={"search-assistant-step-component"}
          onChange={(e, v) => this.setState({ currentInputValue: v as string})}
          options={[AnswerYesNoType.yes, AnswerYesNoType.no]}
          getOptionLabel={o => t('type.answerYesNoType.' + o)}
          autoHighlight={true}
          renderInput={(params) => <TextField {...params} onKeyDownCapture={e => this.handleInputKeyPress(e)}/>}
        />
      case SearchAssistantStep.type_select:
        return <Select
          id="search-assistant-purpose"
          className={"search-assistant-step-component"}
          value={undefined}
          onChange={(e) => this.setState({currentInputValue: e.target.value as TripType})}
          onKeyDownCapture={e => this.handleInputKeyPress(e)}>
          <MenuItem value={TripType.beach}>{t('type.tripType.BEACH')}</MenuItem>
          <MenuItem value={TripType.city}>{t('type.tripType.CITY')}</MenuItem>
          <MenuItem value={TripType.sightseeing}>{t('type.tripType.SIGHTSEEING')}</MenuItem>
          <MenuItem value={TripType.mountain}>{t('type.tripType.MOUNTAIN')}</MenuItem>
          <MenuItem value={TripType.ski}>{t('type.tripType.SKI')}</MenuItem>
        </Select>;
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
      case SearchAssistantStep.period_known_select:
        return <Autocomplete
          componentsProps={{popper: {placement: "top-start"}}}
          id="search-assistant-period-known-select"
          key="search-assistant-period-known-seledisablePortalct"
          defaultValue={null}
          value={null}
          className={"search-assistant-step-component"}
          onChange={(e, v) => this.setState({ currentInputValue: v as string})}
          options={[AnswerYesNoType.yes, AnswerYesNoType.no]}
          getOptionLabel={o => t('type.answerYesNoType.' + o)}
          autoHighlight={true}
          renderInput={(params) => <TextField {...params} onKeyDownCapture={e => this.handleInputKeyPress(e)}/>}
        />;
      case SearchAssistantStep.period_duration_select:
        return <Autocomplete
          componentsProps={{popper: {placement: "top-start"}}}
          id="search-assistant-period-duration-select"
          key="search-assistant-period-duration-select"
          className={"search-assistant-step-component"}
          onChange={(e, v) => this.setState({ currentInputValue: v as DurationType})}
          options={[DurationType.weekend, DurationType.week, DurationType.month]}
          getOptionLabel={option => t('type.durationType.' + option)}
          autoHighlight={true}
          renderInput={(params) => <TextField {...params} onKeyDownCapture={e => this.handleInputKeyPress(e)}/>}
        />
      case SearchAssistantStep.period_season_select:
        return <Autocomplete
          componentsProps={{popper: {placement: "top-start"}}}
          id="search-assistant-period-season-select"
          key="search-assistant-period-season-select"
          className={"search-assistant-step-component"}
          onChange={(e, v) => this.setState({ currentInputValue: v as PeriodType})}
          options={[PeriodType.summer, PeriodType.fall, PeriodType.winter, PeriodType.spring]}
          getOptionLabel={option => t('type.periodType.' + option)}
          autoHighlight={true}
          renderInput={(params) => <TextField {...params} onKeyDownCapture={e => this.handleInputKeyPress(e)}/>}
        />;
      case SearchAssistantStep.period_dates_select:
        return (
          <DatePicker
            key="search-assistant-dates-select"
            className={"search-assistant-step-component"}
            popperClassName={"search-assistant-dates-select"}
            minDate={new Date()}
            selected={this.state.currentInputValue && this.state.currentInputValue.length ? this.state.currentInputValue[0] : null}
            onChange={(dates: [Date | null, Date | null]) => this.setState({ currentInputValue: dates})}
            startDate={this.state.currentInputValue && this.state.currentInputValue.length ? this.state.currentInputValue[0] : null}
            endDate={this.state.currentInputValue && this.state.currentInputValue.length ? this.state.currentInputValue[1] : null}
            selectsRange
            dateFormat={DateHelper.getDateFormatString(dateLocale)}
            locale={SUPPORTED_LOCALES.includes(navigator.language.split('-')[0]) ? navigator.language.split('-')[0] : "en"}
            customInput={<TextField placeholder={undefined}
                                    style={{width: '100%'}}
                                    onKeyDownCapture={e => this.handleInputKeyPress(e)}/>}
          />
        )
      case SearchAssistantStep.companions_select:
        let companionsSelectOpen = this.state.companionsSelectOpen;
        return <>
          { companionsSelectOpen ? <div className={"search-assistant-companions-wrapper"}>
            <div ref={this.companionsWrapperRef} className="search-assistant-companions-select"><CompanionsSelect
              initialValueExtractor={() => this.state.tripSearch.tripTerms}
              onValueChange={(v: TripTerms) => this.setState({ currentInputValue: v as TripTerms})}>
            </CompanionsSelect></div></div> : null }
          <TextField
            className={"search-assistant-step-component"}
            value={this.getCompanionsDisplay(this.state.currentInputValue)}
            onClick={e => this.setState({ companionsSelectOpen: true}) }
            onKeyDownCapture={e => {
              this.setState({ companionsSelectOpen: false})
              this.handleInputKeyPress(e);
            }}></TextField>
        </>;
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
            <TextField{...params} onKeyDownCapture={e => this.handleInputKeyPress(e)}/>
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
    this.handleAnswerSubmit(SearchAssistantStep.period_known_select, dest.name);
  }

  private handleDestinationOrTypeSubmit(value: AnswerYesNoType) {
    if (AnswerYesNoType.yes === value) {
      this.handleAnswerSubmit(SearchAssistantStep.destination_select, this.props.t('type.answerYesNoType.YES'));
    } else if (AnswerYesNoType.no === value) {
      this.handleAnswerSubmit(SearchAssistantStep.type_select, this.props.t('type.answerYesNoType.NO'));
    }
  }

  private handlePeriodKnownSelect(value: AnswerYesNoType) {
    if (AnswerYesNoType.yes === value) {
      this.handleAnswerSubmit(SearchAssistantStep.period_dates_select, this.props.t('type.answerYesNoType.YES'));
    } else if (AnswerYesNoType.no === value) {
      this.handleAnswerSubmit(SearchAssistantStep.period_duration_select, this.props.t('type.answerYesNoType.NO'));
    }
  }

  private handlePeriodDurationSubmit(value: DurationType) {
    const tripTerms = {
      ...this.state.tripSearch.tripTerms,
      duration: value,
      startDate: undefined,
      endDate: undefined
    };
    this.setState({
      tripSearch: {
        ...this.state.tripSearch,
        tripTerms: tripTerms
      }
    });
    this.handleAnswerSubmit(SearchAssistantStep.period_season_select, this.props.t('type.durationType.' + value));
  }

  private handlePeriodSeasonSubmit(value: PeriodType) {
    const tripTerms = {
      ...this.state.tripSearch.tripTerms,
      period: value,
      startDate: undefined,
      endDate: undefined
    };
    this.setState({
      tripSearch: {
        ...this.state.tripSearch,
        tripTerms: tripTerms
      }
    });
    this.handleAnswerSubmit(SearchAssistantStep.companions_select, this.props.t('type.periodType.' + value));
  }

  private handlePeriodDatesSubmit(value: Date[]) {
    const start = value && value[0] ? value[0] : undefined;
    const end = value && value[1] ? value[1] : undefined;

    if (!start || !end || start > end) {
      return;
    }

    const newValue = {
      ...this.state.tripSearch.tripTerms,
      startDate: start,
      endDate: end,
      period: undefined,
      duration: undefined
    };
    this.setState({
      tripSearch: {
        ...this.state.tripSearch,
        tripTerms: newValue
      }
    });

    const dateLocale = SUPPORTED_LOCALES.includes(navigator.language.split('-')[0]) ? navigator.language : "en-US";
    this.handleAnswerSubmit(SearchAssistantStep.companions_select,  DateHelper.formatDateRange(start, end, dateLocale));
  }

  private handleCompanionsSubmit(value: TripTerms) {
    this.setState({
      tripSearch: {
        ...this.state.tripSearch,
        tripTerms: value
      }
    });
    this.handleAnswerSubmit(SearchAssistantStep.tags_select, this.getCompanionsDisplay(value));
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

  private getCompanionsDisplay(value: TripTerms) {
    return value ? value.adults + ' ' + this.props.t('companions.adults') + ', ' + value.children + ' ' + this.props.t('companions.children') : '';
  }

  private handlePurposeSelect(value: TripType) {
    const tripDetails = {
      ...this.state.tripSearch.tripDetails,
      category: value
    };
    this.setState({
      tripSearch: {
        ...this.state.tripSearch,
        tripDetails: tripDetails
      }
    });
    this.handleAnswerSubmit(SearchAssistantStep.period_known_select, this.props.t('type.tripType.' + value));
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

  private handleAnswerSubmit(nextStep: SearchAssistantStep, answer: string) {
    this.setState({ loadingQuestion: true, currentStep: nextStep });
    this.addAnswer(answer);

    setTimeout(() => {
      this.addAssistantQuestion(nextStep);
      this.setState({ loadingQuestion: false });
    }, 300);
  }

  private addAssistantQuestion(step: SearchAssistantStep) {
    const currentThread = this.state.thread;
    const text = this.props.t('assistant.chat.question.' + SearchAssistantStep[step]);
    const message = new ChatMessage(false, text);
    currentThread.messages.push(message);
    this.setState({ thread: currentThread });
  }

  private addAnswer(answer: string) {
    const currentThread = this.state.thread;
    const message = new ChatMessage(true, answer);
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
