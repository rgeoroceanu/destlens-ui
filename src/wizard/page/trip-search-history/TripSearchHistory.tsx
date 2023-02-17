import React, {Component} from 'react';
import './TripSearchHistory.css';
import Progress from "../../../common/component/progress/Progress";
import {Container} from "@mui/material";
import StepNavigation from "../../../common/component/step-navigation/StepNavigation";
import TripSearch from "../../../common/model/TripSearch";
import {Navigate} from "react-router-dom";
import PreviousLocationsStep from "../../component/previous-locations-step/PreviousLocationsStep";
import PreviousLocations from "../../../common/model/PreviousLocations";

class TripSearchHistory extends Component<any, any> {

  constructor(props: any) {
    super(props);
    this.state = {
      tripSearchFormValues: new TripSearch(),
      next: false
    };
  }

  render() {
    return (
      <div>
        <Progress value={80}/>
        <Container className={"content-wrapper"}>
          <StepNavigation
            onNext={this.onNextStep.bind(this)}
            onPrevious={() => {}}
            previousButtonVisible={false}
            nextButtonVisible={true}
            nextButtonEnabled={true}
            nextButtonColor={this.isPreviousLocationsStepValid() ? "primary" : "inherit"}
            nextButtonLabel={this.isPreviousLocationsStepValid() ? "Next" : "Skip"}/>

          <PreviousLocationsStep onValueChange={this.onPreviousLocationsValueChange.bind(this)}
                                 initialValueExtractor={() => this.state.tripSearchFormValues.previousLocations ? this.state.tripSearchFormValues.previousLocations : new PreviousLocations()}/>


        </Container>

        {this.state.previous ? <Navigate to="/trip-search-tags" replace={true} /> : null}
        {this.state.next ? <Navigate to="/trip-search-results" replace={true} /> : null}
      </div>
    );
  }

  private onNextStep() {
    this.setState({ next: true});
  }

  private onPreviousLocationsValueChange(previousLocations: PreviousLocations) {
    const state = { ...this.state };
    state.tripSearchFormValues.previousLocations = previousLocations;
    this.setState(state);
  }

  private isPreviousLocationsStepValid(): boolean {
    return this.getPreviousLocationsCount() > 0;
  }

  private getPreviousLocationsCount() {
    return this.state.tripSearchFormValues.previousLocations
    && this.state.tripSearchFormValues.previousLocations.locations ?
      this.state.tripSearchFormValues.previousLocations.locations.length : 0;

  }
}

export default TripSearchHistory;
