import React, {Component, ReactElement} from 'react';
import './TripSearchAssistant.css';
import TripSearch from "../../model/TripSearch";
import withRouter from "../../helper/WithRouter";
import ChatThread from "../../model/ChatThread";
import Chat from "../../component/chat/Chat";
import {Box, Chip, Container, MenuItem, Select} from "@mui/material";
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
import {AdapterDayjs} from "@mui/x-date-pickers-pro/AdapterDayjs";
import {DateRangePicker, LocalizationProvider} from "@mui/x-date-pickers-pro";
import {DateRange} from "@mui/lab";
import CompanionsSelect from "../../component/companions-select/CompanionsSelect";
import TripTerms from "../../model/TripTerms";
import Accommodation from "../../model/Accommodation";

const SEARCH_TYPE_OPTIONS = ["Accommodation", "Flight", "Transfer", "Car Rental"];

class TripSearchAssistant extends Component<any, any> {

  private searchApiService = new SearchApiService();

  constructor(props: any) {
    super(props);
    this.state = this.getInitialState();
  }

  render() {
    const component = this.getStepComponent(this.state.currentStep);
    return (
      <Container className={"content-wrapper"}>
        <Chat
          loading={this.state.loadingQuestion}
          thread={this.state.thread}
          inputComponent={component}
          sendClickListener={() => this.handleSubmitAnswer()}
          restartClickListener={() => this.handleRestart()}
          previousClickListener={() => this.handlePrevious()}>
        </Chat>
      </Container>
    );
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
      companionsSelectOpen: false
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
      case SearchAssistantStep.search_options:
        previousStep = SearchAssistantStep.destination_known_select;
        break;
      case SearchAssistantStep.period_known_select:
        previousStep = SearchAssistantStep.search_options;
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
      case SearchAssistantStep.search_options:
        this.handleOptionsSubmit(this.state.currentInputValue);
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

  private getStepQuestion(step: SearchAssistantStep) {
    switch (step) {
      case SearchAssistantStep.destination_known_select:
        return "Hello there! I am Tripwizard and I will help you find your perfect trip. Do you know where you want to go?";
      case SearchAssistantStep.destination_select:
        return "Great! So where do you want to go?";
      case SearchAssistantStep.type_select:
        return "No problem! We will find something suitable for you. You just need to tell us more about what type of trip would you like to find.";
      case SearchAssistantStep.search_options:
        return "Awesome! Now that we know the type of trip you want, let me know what more about what you want to find.";
      case SearchAssistantStep.period_known_select:
        return "Do you know the exact period when you want to travel?";
      case SearchAssistantStep.period_duration_select:
        return "Then please choose the trip duration.";
      case SearchAssistantStep.period_season_select:
        return "...and in which period of the year.";
      case SearchAssistantStep.period_dates_select:
        return "Perfect! Then select the dates.";
      case SearchAssistantStep.companions_select:
        return "Who do you plan to travel with?";
      case SearchAssistantStep.tags_select:
        return "Now let's select some thing that you like most about the locations where you have been before.";
      case SearchAssistantStep.previous_locations_select:
        return "Previous locations";
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
          <MenuItem value={TripType.sports}>Sports</MenuItem>
          <MenuItem value={TripType.city}>City</MenuItem>
          <MenuItem value={TripType.resort}>Resort</MenuItem>
          <MenuItem value={TripType.road_trip}>Road Trip</MenuItem>
          <MenuItem value={TripType.sightseeing}>Sightseeing</MenuItem>
          <MenuItem value={TripType.mountain}>Mountain</MenuItem>
          <MenuItem value={TripType.ski}>Ski</MenuItem>
          <MenuItem value={TripType.business}>Business</MenuItem>
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
      case SearchAssistantStep.search_options:
        return <Autocomplete
          multiple
          defaultValue={["Accommodation"]}
          className={"search-assistant-step-component"}
          options={SEARCH_TYPE_OPTIONS}
          getOptionDisabled={(option) => option === SEARCH_TYPE_OPTIONS[0]}
          onChange={(e, v) => this.setState({ currentInputValue: v ? v as string[] : ["Accommodation"]})}
          renderTags={(tagValue, getTagProps) => {
            if (!tagValue) {
              tagValue = [];
            }
            if (!tagValue.includes("Accommodation")) {
              tagValue.unshift("Accommodation");
            }
            return tagValue.map((option, index) => (
              <Chip
                label={option}
                disabled={option === 'Accommodation'}
              />
            ))
          }
          }
          renderInput={(params) => (
            <TextField
              {...params}
              variant="outlined"
              onKeyDownCapture={e => this.handleInputKeyPress(e)}
            />
          )}
        />;
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
          options={[PeriodType.summer, PeriodType.autumn, PeriodType.winter, PeriodType.spring]}
          autoHighlight={true}
          renderInput={(params) => <TextField {...params} onKeyDownCapture={e => this.handleInputKeyPress(e)}/>}
        />;
      case SearchAssistantStep.period_dates_select:
        return <LocalizationProvider
          dateAdapter={AdapterDayjs}
          localeText={{ start: undefined, end: undefined }}>
          <DateRangePicker
            key="search-assistant-period-dates-select"
            className={"search-assistant-step-component"}
            value={this.state.currentInputValue && this.state.currentInputValue.length ? this.state.currentInputValue : [null, null]}
            onChange={v => this.setState({ currentInputValue: v as DateRange<Date>})}
            minDate={new Date()}
            renderInput={(startProps, endProps) => (
              <TextField {...startProps}
                         inputProps={{ ...startProps.inputProps, value: startProps.inputProps?.value + ' - ' + endProps.inputProps?.value, placeholder: undefined }}
                         style={{width: '100%'}}
                         onKeyDownCapture={e => this.handleInputKeyPress(e)}/>
            )}
          />
        </LocalizationProvider>;
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
        const tagCategories = this.searchApiService.getTagCategories();
        return <Autocomplete
          multiple
          id="search-assistant-tags-select"
          key="search-assistant-tags-select"
          className={"search-assistant-step-component search-assistant-tags-select"}
          onChange={(e, v) => this.setState({ currentInputValue: v as string[]})}
          options={tagCategories.map(cat => cat.tags).flat()}
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
          startAdornment={<Hotel className={"location-start-icon"}/>}></SearchInput>
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
    this.handleAnswerSubmit(SearchAssistantStep.search_options, dest.name);
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
      duration: value
    };
    this.setState({
      tripSearch: {
        ...this.state.tripSearch,
        tripTerms: tripTerms
      }
    });
    this.handleAnswerSubmit(SearchAssistantStep.period_season_select, value);
  }

  private handlePeriodSeasonSubmit(value: PeriodType) {
    const tripTerms = {
      ...this.state.tripSearch.tripTerms,
      period: value
    };
    this.setState({
      tripSearch: {
        ...this.state.tripSearch,
        tripTerms: tripTerms
      }
    });
    this.handleAnswerSubmit(SearchAssistantStep.companions_select, value);
  }

  private handlePeriodDatesSubmit(value: DateRange<any>) {
    const start = value && value[0] ? value[0] : undefined;
    const end = value && value[1] ? value[1] : undefined;

    if (start > end) {
      return;
    }

    const newValue = {
      ...this.state.tripSearch.tripTerms,
      startDate: start.toDate(),
      endDate: end.toDate()
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

  private handleTagsSubmit(value: string[]) {
    const tags = {
      ...this.state.tripSearch.tags,
      tags: value
    };
    this.setState({
      tripSearch: {
        ...this.state.tripSearch,
        tags: tags
      }
    });
    this.handleAnswerSubmit(SearchAssistantStep.previous_locations_select, value.join(', '));
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
    return value ? value.adults + ' adults, ' + value.children + ' children, ' + value.rooms + ' rooms': '';
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
    this.handleAnswerSubmit(SearchAssistantStep.search_options, value);
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

  private handleOptionsSubmit(value: string[]) {
    let typeValue = this.state.tripSearch.tripDetails;
    typeValue = {
      ...typeValue,
      accommodation: true
    };
    typeValue = {
      ...typeValue,
      flight: value.indexOf("Flight") > -1
    };
    typeValue = {
      ...typeValue,
      transfer: value.indexOf("Transfer") > -1
    };
    typeValue = {
      ...typeValue,
      carRental: value.indexOf("Car Rental") > -1
    };

    const newValue = {
      ...this.state.tripSearch,
      tripDetails: typeValue
    }
    this.setState({
      tripSearch: newValue
    });
    this.handleAnswerSubmit(SearchAssistantStep.period_known_select, value.join(', '));
  }

  private handleAnswerSubmit(nextStep: SearchAssistantStep, answer: string) {
    this.setState({ loadingQuestion: true, currentStep: nextStep });
    this.addAnswer(answer);

    setTimeout(() => {
      this.addAssistantQuestion(nextStep);
      this.setState({ loadingQuestion: false });
    }, 1000);
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
