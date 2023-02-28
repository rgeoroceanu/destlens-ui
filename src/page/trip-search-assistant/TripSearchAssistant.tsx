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

const SEARCH_TYPE_OPTIONS = ["Accommodation", "Flight", "Transfer", "Car Rental"];

class TripSearchAssistant extends Component<any, any> {

  private searchApiService = new SearchApiService();

  constructor(props: any) {
    super(props);
    const tripSearch = new TripSearch();
    const chatThread = new ChatThread();
    const message = new ChatMessage(false, this.getStepQuestion(SearchAssistantStep.destination_known_select));
    chatThread.messages.push(message);

    this.state = {
      tripSearch: tripSearch,
      thread: chatThread,
      currentStep: SearchAssistantStep.destination_known_select,
      loadingQuestion: false,
      currentInputValue: null
    };
  }

  render() {
    const component = this.getStepComponent(this.state.currentStep);
    return (
      <Container className={"content-wrapper"}>
        <Chat
          loading={this.state.loadingQuestion}
          thread={this.state.thread}
          inputComponent={component}
          sendClickListener={() => this.handleSubmitAnswer()}>
        </Chat>
      </Container>
    );
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
        return "No problem! We will find something suitable for you. You just need to tell us more about what type of trip would you like to find."
      case SearchAssistantStep.search_options:
        return "Awesome! Now that we know the type of trip you want, let me know what more about what you want to find."
      case SearchAssistantStep.period_known_select:
        return "Do you know the exact period when you want to travel?"
      default:
        return "";
    }
  }

  private getStepComponent(step: SearchAssistantStep) {
    switch (step) {
      case SearchAssistantStep.destination_known_select:
        return <Autocomplete
          disablePortal
          id="search-assistant-destination-or-type-select"
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
          onChange={(e, v) => this.setState({ currentInputValue: v as string[]})}
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
          id="search-assistant-destination-or-type-select"
          className={"search-assistant-step-component"}
          onChange={(e, v) => this.setState({ currentInputValue: v as string})}
          options={["Yes", "No"]}
          autoHighlight={true}
          renderInput={(params) => <TextField {...params} onKeyDownCapture={e => this.handleInputKeyPress(e)}/>}
        />
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
    this.addAnswer(answer);
    this.setState({ loadingQuestion: true, currentStep: nextStep });

    setTimeout(() => {
      this.addAssistantQuestion(nextStep);
      this.setState({ loadingQuestion: false });
    }, 1500);
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
}

export default withRouter(TripSearchAssistant);
