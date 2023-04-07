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
import PeriodTypeDisplay from "../../model/PeriodTypeDisplay";
import DurationTypeDisplay from "../../model/DurationTypeDisplay";

//const SEARCH_TYPE_OPTIONS = ["Accommodation", "Flight", "Transfer", "Car Rental"];

class TripSearchAssistant extends Component<any, any> {

  private searchApiService = new SearchApiService();

  constructor(props: any) {
    super(props);
    this.state = this.getInitialState();
  }

  componentDidMount() {
    this.searchApiService.getAllTags()
      .then(tags => this.setState({tags: tags}));
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
    switch (this.state.currentStep) {
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
    const message = new ChatMessage(false, this.getStepQuestion(SearchAssistantStep.destination_known_select));
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
      // case SearchAssistantStep.search_options:
      //   previousStep = SearchAssistantStep.destination_known_select;
      //   break;
      case SearchAssistantStep.period_known_select:
        //previousStep = SearchAssistantStep.search_options;
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
      // case SearchAssistantStep.search_options:
      //   this.handleOptionsSubmit(this.state.currentInputValue);
      //   break;
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

  private getStepQuestion(step: SearchAssistantStep) {
    switch (step) {
      case SearchAssistantStep.destination_known_select:
        return "Hello there! I am Tripwizard and I will help you find your perfect trip. Do you know where you want to go?";
      case SearchAssistantStep.destination_select:
        return "Great! So where do you want to go?";
      case SearchAssistantStep.type_select:
        return "No problem! We will find something suitable for you. You just need to tell us what kind of trip do you want.";
      // case SearchAssistantStep.search_options:
      //   return "Awesome! Now that we know the type of trip you want, let me know what more about what you want to find.";
      case SearchAssistantStep.period_known_select:
        return "Do you know the exact period when you plan to travel?";
      case SearchAssistantStep.period_duration_select:
        return "No worries! Then you can select an approximate period. First choose the trip duration:";
      case SearchAssistantStep.period_season_select:
        return "Second, select in which period of the year:";
      case SearchAssistantStep.period_dates_select:
        return "Perfect! Then select the dates.";
      case SearchAssistantStep.companions_select:
        return "Who do you plan to travel with?";
      case SearchAssistantStep.tags_select:
        return "Now let's select some tags that should be applied to the search.";
      case SearchAssistantStep.previous_locations_select:
        return "Enter a few locations where did you enjoyed staying in the past. This will help a lot in finding the best results for your personal tastes.";
      case SearchAssistantStep.complete:
        return "Congrats! You completed all the steps! Now I will find something suitable just for you!";
      default:
        return "";
    }
  }

  private getStepComponent(step: SearchAssistantStep) {
    if (this.state.loadingQuestion) {
      return <TextField className={"search-assistant-step-component"} disabled={true}></TextField>
    }
    switch (step) {
      case SearchAssistantStep.destination_known_select:
        return <Autocomplete
          disablePortal
          id="search-assistant-destination-or-type-select"
          key="search-assistant-destination-or-type-select"
          className={"search-assistant-step-component"}
          onChange={(e, v) => this.setState({ currentInputValue: v as string})}
          options={["Yes", "No"]}
          autoHighlight={true}
          renderInput={(params) => <TextField {...params} onKeyDownCapture={e => this.handleInputKeyPress(e)}/>}
        />
      case SearchAssistantStep.type_select:
        return <Select
          id="search-assistant-purpose"
          className={"search-assistant-step-component"}
          onChange={(e) => this.setState({currentInputValue: e.target.value as TripType})}
          onKeyDownCapture={e => this.handleInputKeyPress(e)}>
          <MenuItem value={TripType.beach}>Beach</MenuItem>
          <MenuItem value={TripType.city}>City</MenuItem>
          <MenuItem value={TripType.sightseeing}>Sightseeing</MenuItem>
          <MenuItem value={TripType.mountain}>Mountain</MenuItem>
          <MenuItem value={TripType.ski}>Ski</MenuItem>
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
          disablePortal
          id="search-assistant-period-known-select"
          key="search-assistant-period-known-select"
          defaultValue={null}
          value={null}
          className={"search-assistant-step-component"}
          onChange={(e, v) => this.setState({ currentInputValue: v as string})}
          options={["Yes", "No"]}
          autoHighlight={true}
          renderInput={(params) => <TextField {...params} onKeyDownCapture={e => this.handleInputKeyPress(e)}/>}
        />;
      case SearchAssistantStep.period_duration_select:
        return <Autocomplete
          disablePortal
          id="search-assistant-period-duration-select"
          key="search-assistant-period-duration-select"
          className={"search-assistant-step-component"}
          onChange={(e, v) => this.setState({ currentInputValue: v as DurationType})}
          options={[DurationType.weekend, DurationType.week, DurationType.month]}
          getOptionLabel={option => DurationTypeDisplay.of(option)}
          autoHighlight={true}
          renderInput={(params) => <TextField {...params} onKeyDownCapture={e => this.handleInputKeyPress(e)}/>}
        />
      case SearchAssistantStep.period_season_select:
        return <Autocomplete
          disablePortal
          id="search-assistant-period-season-select"
          key="search-assistant-period-season-select"
          className={"search-assistant-step-component"}
          onChange={(e, v) => this.setState({ currentInputValue: v as PeriodType})}
          options={[PeriodType.summer, PeriodType.fall, PeriodType.winter, PeriodType.spring]}
          getOptionLabel={option => PeriodTypeDisplay.of(option)}
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
            locale={SUPPORTED_LOCALES.includes(navigator.language.split('-')[0]) ? navigator.language.split('-')[0] : "en"}
            customInput={<TextField value={this.state.currentInputValue?.[0] + ' - ' + this.state.currentInputValue?.[1]}
                                    placeholder={undefined}
                                    style={{width: '100%'}}
                                    onKeyDownCapture={e => this.handleInputKeyPress(e)}/>}
          />
        )
      case SearchAssistantStep.companions_select:
        let companionsSelectOpen = this.state.companionsSelectOpen;
        return <>
          { companionsSelectOpen ? <div className={"search-assistant-companions-wrapper"}>
            <CompanionsSelect
              className="search-assistant-companions-select"
              initialValueExtractor={() => this.state.tripSearch.tripTerms}
              onValueChange={(v: TripTerms) => this.setState({ currentInputValue: v as TripTerms})}>
            </CompanionsSelect></div> : null }
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

  private handleDestinationOrTypeSubmit(value: string) {
    if ("Yes" === value) {
      this.handleAnswerSubmit(SearchAssistantStep.destination_select, value);
    } else if ("No" === value) {
      this.handleAnswerSubmit(SearchAssistantStep.type_select, value);
    }
  }

  private handlePeriodKnownSelect(value: string) {
    if ("Yes" === value) {
      this.handleAnswerSubmit(SearchAssistantStep.period_dates_select, value);
    } else if ("No" === value) {
      this.handleAnswerSubmit(SearchAssistantStep.period_duration_select, value);
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
    this.handleAnswerSubmit(SearchAssistantStep.period_season_select, DurationTypeDisplay.of(value));
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
    this.handleAnswerSubmit(SearchAssistantStep.companions_select, PeriodTypeDisplay.of(value));
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

    const startString = new Date(start).getDate() + '/' + new Date(start).getMonth() + '/' +  new Date(start).getFullYear();
    const endString = new Date(end).getDate() + '/' + new Date(end).getMonth() + '/' + new Date(end).getFullYear();
    this.handleAnswerSubmit(SearchAssistantStep.companions_select,  startString + ' - '+ endString);
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
    return value ? value.adults + ' adults, ' + value.children + ' children': '';
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
    this.handleAnswerSubmit(SearchAssistantStep.period_known_select, value);
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

  // private handleOptionsSubmit(value: string[]) {
  //   let typeValue = this.state.tripSearch.tripDetails;
  //   typeValue = {
  //     ...typeValue,
  //     accommodation: true
  //   };
  //   typeValue = {
  //     ...typeValue,
  //     flight: value.indexOf("Flight") > -1
  //   };
  //   typeValue = {
  //     ...typeValue,
  //     transfer: value.indexOf("Transfer") > -1
  //   };
  //   typeValue = {
  //     ...typeValue,
  //     carRental: value.indexOf("Car Rental") > -1
  //   };
  //
  //   const newValue = {
  //     ...this.state.tripSearch,
  //     tripDetails: typeValue
  //   }
  //   this.setState({
  //     tripSearch: newValue
  //   });
  //   this.handleAnswerSubmit(SearchAssistantStep.period_known_select, value.join(', '));
  // }

  private handleAnswerSubmit(nextStep: SearchAssistantStep, answer: string) {
    this.setState({ loadingQuestion: true, currentStep: nextStep });
    this.addAnswer(answer);

    setTimeout(() => {
      this.addAssistantQuestion(nextStep);
      this.setState({ loadingQuestion: false });
    }, 500);
  }

  private addAssistantQuestion(step: SearchAssistantStep) {
    const currentThread = this.state.thread;
    const message = new ChatMessage(false, this.getStepQuestion(step));
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

export default withRouter(TripSearchAssistant);
