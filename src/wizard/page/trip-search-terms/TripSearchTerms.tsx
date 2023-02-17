import React, {Component} from 'react';
import './TripSearchTerms.css';
import Progress from "../../../common/component/progress/Progress";
import {Container} from "@mui/material";
import StepNavigation from "../../../common/component/step-navigation/StepNavigation";
import TripTermsStep from "../../component/trip-terms-step/TripTermsStep";
import TripSearch from "../../../common/model/TripSearch";
import TripTerms from "../../../common/model/TripTerms";
import {Navigate} from "react-router-dom";

class TripSearchTerms extends Component<any, any> {

  constructor(props: any) {
    super(props);
    this.state = {
      tripSearchFormValues: new TripSearch(),
      next: false,
      previous: false
    };
  }
  render() {
    return (
      <div>
        <Progress value={40}/>
        <Container className={"content-wrapper"}>
          <StepNavigation
            onNext={this.onNextStep.bind(this)}
            onPrevious={this.onPreviousStep.bind(this)}
            previousButtonVisible={true}
            nextButtonVisible={true}
            nextButtonEnabled={this.isTermsStepValid()}
            nextButtonColor={"primary"}
            nextButtonLabel={"Next"}/>

          <TripTermsStep onValueChange={this.onTripTermsValueChange.bind(this)}
                         initialValueExtractor={() => this.state.tripSearchFormValues.tripTerms}/>
        </Container>

        {this.state.previous ? <Navigate to="/" replace={true} /> : null}
        {this.state.next ? <Navigate to="/trip-search-tags" replace={true} /> : null}
      </div>
    );
  }

  private onNextStep() {
    this.setState({ next: true});
  }

  private onPreviousStep() {
    this.setState({ previous: true});
  }

  private onTripTermsValueChange(tripTerms: TripTerms) {
    const state = { ...this.state };
    state.tripSearchFormValues.tripTerms = tripTerms;
    this.setState(state);
  }

  private isTermsStepValid(): boolean {
    const terms = this.state.tripSearchFormValues.tripTerms;
    //return terms && terms.startDate && terms.endDate && terms.startDate <= terms.endDate
    //  && terms.adults && terms.adults > 0 && terms.rooms && terms.rooms > 0;
    return true;
  }
}

export default TripSearchTerms;
