import React, {Component} from 'react';
import './TripSearchDestination.css';
import Progress from "../../../common/component/progress/Progress";
import {Container} from "@mui/material";
import StepNavigation from "../../../common/component/step-navigation/StepNavigation";
import TripSearch from "../../../common/model/TripSearch";
import {Navigate} from "react-router-dom";
import TripTypeStep from "../../component/trip-type-step/TripTypeStep";
import TripDetails from "../../../common/model/TripDetails";
import withRouter from "../../../common/helper/WithRouter";

class TripSearchDestination extends Component<any, any> {

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
        <Progress value={20}/>
        <div className={"content-scrollable"}>
          <Container className={"content-wrapper"}>
            <StepNavigation
              onNext={this.onNextStep.bind(this)}
              onPrevious={() => {}}
              previousButtonVisible={false}
              nextButtonVisible={true}
              nextButtonEnabled={this.isTypeStepValid()}
              nextButtonColor={"primary"}
              nextButtonLabel={"Next"}/>

            <TripTypeStep onValueChange={this.onTripTypeValueChange.bind(this)}
                          initialValueExtractor={() => this.state.tripSearch.tripType}/>
          </Container>
        </div>

        {this.state.next ? <Navigate to="/trip-search-terms" state={{tripSearch: this.state.tripSearch}} replace={false} /> : null}
      </div>
    );
  }

  private onNextStep() {
    this.setState({ next: true});
  }

  private onTripTypeValueChange(tripType: TripDetails) {
    const state = { ...this.state };
    state.tripSearch.tripType = tripType;
    this.setState(state);
  }

  private isTypeStepValid(): boolean {
    const type = this.state.tripSearch.tripType;
    return type && type.accommodation === true && type.destination && type.destination.name;
  }
}

export default withRouter(TripSearchDestination);
