import React, {Component} from 'react';
import './TripSearchHistory.css';
import Progress from "../../../common/component/progress/Progress";
import {Container} from "@mui/material";
import StepNavigation from "../../../common/component/step-navigation/StepNavigation";
import TripSearch from "../../../common/model/TripSearch";
import {Navigate} from "react-router-dom";
import PreviousLocationsStep from "../../component/previous-locations-step/PreviousLocationsStep";
import PreviousLocations from "../../../common/model/PreviousLocations";
import withRouter from "../../../common/helper/WithRouter";

class TripSearchHistory extends Component<any, any> {

  constructor(props: any) {
    super(props);
    const tripSearch = props.location?.state?.tripSearch;
    this.state = {
      tripSearch: tripSearch ? tripSearch : new TripSearch(),
      next: false
    };
  }

  render() {
    return (
      <div>
        <Progress value={80}/>
        <div className={"content-scrollable"}>
          <Container className={"content-wrapper"}>
            <StepNavigation
              onNext={this.onNextStep.bind(this)}
              onPrevious={this.onPreviousStep.bind(this)}
              previousButtonVisible={true}
              nextButtonVisible={true}
              nextButtonEnabled={true}
              nextButtonColor={this.isPreviousLocationsStepValid() ? "primary" : "inherit"}
              nextButtonLabel={this.isPreviousLocationsStepValid() ? "Next" : "Skip"}/>

            <PreviousLocationsStep onValueChange={this.onPreviousLocationsValueChange.bind(this)}
                                   initialValueExtractor={() => this.state.tripSearch.previousLocations ? this.state.tripSearch.previousLocations : new PreviousLocations()}/>


          </Container>
        </div>

        {this.state.previous ? <Navigate to="/trip-search-tags" state={{tripSearch: this.state.tripSearch}} replace={false} /> : null}
        {this.state.next ? <Navigate to="/trip-search-results" state={{tripSearch: this.state.tripSearch}} replace={false} /> : null}
      </div>
    );
  }

  private onNextStep() {
    this.setState({ next: true});
  }

  private onPreviousStep() {
    this.setState({ previous: true});
  }

  private onPreviousLocationsValueChange(previousLocations: PreviousLocations) {
    const state = { ...this.state };
    state.tripSearch.previousLocations = previousLocations;
    this.setState(state);
  }

  private isPreviousLocationsStepValid(): boolean {
    return this.getPreviousLocationsCount() > 0;
  }

  private getPreviousLocationsCount() {
    return this.state.tripSearch.previousLocations
    && this.state.tripSearch.previousLocations.locations ?
      this.state.tripSearch.previousLocations.locations.length : 0;

  }
}

export default withRouter(TripSearchHistory);
