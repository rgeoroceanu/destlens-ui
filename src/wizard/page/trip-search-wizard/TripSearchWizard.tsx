import React, {Component} from 'react';
import './TripSearchWizard.css';
import Progress from "../../../common/component/progress/Progress";
import {Container} from "@mui/material";
import StepNavigation from "../../../common/component/step-navigation/StepNavigation";
import DestinationStep from "../../component/destination-step/DestinationStep";
import TripTypeStep from "../../component/search-type-step/TripTypeStep";
import PreviousLocationsStep from "../../component/previous-locations-step/PreviousLocationsStep";
import TermsStep from "../../component/conditions-step/TermsStep";
import Nameable from "../../../common/model/Nameable";
import TripSearch from "../../../common/model/TripSearch";
import TripType from "../../../common/model/TripType";
import TripTerms from "../../../common/model/TripTerms";
import PreviousLocations from "../../../common/model/PreviousLocations";
import FinalStep from "../../component/final-step/FinalStep";
import CircularProgress from "@mui/material/CircularProgress";
import SearchApiService from "../../service/SearchApiService";
import SearchResult from "../../component/search-result/SearchResult";
import MatchResult from "../../../common/model/MatchResult";

enum TripSearchStep {
  destination_select,
  trip_type,
  trip_terms,
  previous_locations,
  final,
  result
}

function getProgressValue(step: TripSearchStep): number {
  switch (step) {
    case 0:
      return 20;
    case 1:
      return 40;
    case 2:
      return 60;
    case 3:
      return 80;
    case 4:
      return 100;
    default:
      return 100;
  }
}

class TripSearchWizard extends Component<any, any> {

  private readonly destinationStepComponent = <DestinationStep onDestinationSelect={this.onDestinationSelect.bind(this)}
                                                               initialValueExtractor={() => this.state.tripSearchFormValues.destination}/>;

  private readonly tripTypeStepComponent = <TripTypeStep onValueChange={this.onTripTypeValueChange.bind(this)}
                                                         initialValueExtractor={() => this.state.tripSearchFormValues.tripType}/>;

  private readonly tripTermsStepComponent = <TermsStep onValueChange={this.onTripTermsValueChange.bind(this)}
                                                       initialValueExtractor={() => this.state.tripSearchFormValues.tripTerms}/>;

  private readonly previousLocationsStepComponent = <PreviousLocationsStep onValueChange={this.onPreviousLocationsValueChange.bind(this)}
                                                                           initialValueExtractor={() => this.state.tripSearchFormValues.previousLocations ? this.state.tripSearchFormValues.previousLocations : new PreviousLocations()}/>;

  private readonly finalStepComponent = <FinalStep onStartSearch={this.handleSubmit.bind(this)}/>;
  private readonly searchService = new SearchApiService();

  constructor(props: any) {
    super(props);
    this.state = {
      currentStep: TripSearchStep.destination_select,
      currentComponent: this.getStepComponent(TripSearchStep.destination_select),
      tripSearchFormValues: new TripSearch(),
      previousButtonVisible: false,
      nextButtonLabel: 'Next',
      nextButtonColor: 'primary',
      searching: false,
      matches: [],
      searchComplete: false
    };
  }

  private handleSubmit() {
    this.setState({
      searching: true
    });

    this.searchService.findMatchingAccommodations(this.state.tripSearchFormValues)
      .then(res => this.onMatchResult(res))
      .catch(e => this.setState({
        searching: false
      }))
      .finally(() => this.setState({
        searching: false
      }));
  }

  render() {
    const currentStep = this.state.currentStep;

    return (
      <div>
        <Progress value={getProgressValue(currentStep)}/>
        <Container className={"content-wrapper"}>
          <StepNavigation
            onNext={this.onNextStep.bind(this)}
            onPrevious={this.onPreviousStep.bind(this)}
            previousButtonVisible={this.state.previousButtonVisible}
            nextButtonVisible={this.state.currentStep !== TripSearchStep.final}
            nextButtonEnabled={this.isStepValid(currentStep)}
            nextButtonColor={this.getNextButtonColor()}
            nextButtonLabel={this.getNextButtonLabel()}/>

          { this.state.searching ? this.getProgressComponent() : (this.state.complete && this.getMatches() ? <SearchResult matches={this.getMatches()}/> : this.state.currentComponent) }
        </Container>
      </div>
    );
  }

  private getMatches() {
    return this.state.matches;
  }

  private onMatchResult(result: MatchResult) {
    this.setState({
      matches: result.accommodationMatches,
      complete: true
    });
  }

  private getProgressComponent() {
    return <div className={"progress-wrapper"}>
      <CircularProgress className={"progress"}/>
    </div>
  }

  private onNextStep() {
    const currentStep = this.state.currentStep;
    if (!this.isStepValid(currentStep)) {
      return;
    }
    const nextStep = Math.min(currentStep + 1, 4);
    this.handleStepChange(nextStep);
  }

  private onPreviousStep() {
    const currentStep = this.state.currentStep;
    const previousStep = Math.max(currentStep - 1, 0);
    this.setState( {
      complete: false,
      searching: false
    });
    this.handleStepChange(previousStep);
  }

  private handleStepChange(step: TripSearchStep) {
    const previousVisible = step !== TripSearchStep.destination_select && this.state.searching === false;
    this.setState( {
      currentStep: step,
      previousButtonVisible: previousVisible,
      currentComponent: this.getStepComponent(step)
    });
  }

  private getStepComponent(step: TripSearchStep) {
    switch (step) {
      case 1:
        return this.tripTypeStepComponent;
      case 2:
        return this.tripTermsStepComponent;
      case 3:
        return this.previousLocationsStepComponent;
      case 4:
        return this.finalStepComponent;
      case 0:
      default:
        return this.destinationStepComponent;
    }
  }

  private onDestinationSelect(destination: Nameable) {
    const state = { ...this.state };
    state.tripSearchFormValues.destination = destination;
    state.nextButtonVisible = this.isDestinationStepValid();
    this.setState(state);
  }

  private onTripTypeValueChange(tripType: TripType) {
    const state = { ...this.state };
    state.tripSearchFormValues.tripType = tripType;
    this.setState(state);
  }

  private onTripTermsValueChange(tripTerms: TripTerms) {
    const state = { ...this.state };
    state.tripSearchFormValues.tripTerms = tripTerms;
    this.setState(state);
  }

  private onPreviousLocationsValueChange(previousLocations: PreviousLocations) {
    const state = { ...this.state };
    state.tripSearchFormValues.previousLocations = previousLocations;
    this.setState(state);
  }

  private isStepValid(step: TripSearchStep) {
    switch (step) {
      case 0:
        return this.isDestinationStepValid();
      case 1:
        return this.isTypeStepValid();
      case 2:
        return this.isTermsStepValid();
      case 3:
        return this.isPreviousLocationsStepValid();
      case 4:
        return true;
      default:
        return false;
    }
  }

  private getNextButtonLabel() {
    return 'Next';
  }

  private getNextButtonColor(): "primary" | "inherit" {
    return "primary";
  }

  private getPreviousLocationsCount() {
    return this.state.tripSearchFormValues.previousLocations
    && this.state.tripSearchFormValues.previousLocations.locations ?
      this.state.tripSearchFormValues.previousLocations.locations.length : 0;

  }

  private isPreviousLocationsStepValid(): boolean {
    return this.getPreviousLocationsCount() > 0;
  }

  private isDestinationStepValid(): boolean {
    const destination = this.state.tripSearchFormValues.destination;
    return destination && destination.name;
  }

  private isTermsStepValid(): boolean {
    const terms = this.state.tripSearchFormValues.tripTerms;
    return terms && terms.startDate && terms.endDate && terms.startDate <= terms.endDate
      && terms.adults && terms.adults > 0 && terms.rooms && terms.rooms > 0;
  }

  private isTypeStepValid(): boolean {
    const type = this.state.tripSearchFormValues.tripType;
    return type && type.accommodation === true;
  }
}

export default TripSearchWizard;
