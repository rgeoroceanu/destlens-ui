import React, {Component} from 'react';
import './TripSearchTerms.css';
import Progress from "../../../common/component/progress/Progress";
import {Container} from "@mui/material";
import StepNavigation from "../../../common/component/step-navigation/StepNavigation";
import TripTermsStep from "../../component/trip-terms-step/TripTermsStep";
import TripSearch from "../../../common/model/TripSearch";
import TripTerms from "../../../common/model/TripTerms";
import {Navigate} from "react-router-dom";
import withRouter from "../../../common/helper/WithRouter";

class TripSearchTerms extends Component<any, any> {

  constructor(props: any) {
    super(props);
    const tripSearch = props.location?.state?.tripSearch;
    this.state = {
      tripSearch: tripSearch ? tripSearch : new TripSearch(),
      next: false,
      previous: false
    };
  }

  render() {
    return (
      <div>
        <Progress value={40}/>
        <div className={"content-scrollable"}>
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
                           initialValueExtractor={() => this.state.tripSearch.tripTerms}/>
          </Container>
        </div>

        {this.state.previous ? <Navigate to="/" state={{tripSearch: this.state.tripSearch}} replace={false} /> : null}
        {this.state.next ? <Navigate to="/trip-search-tags" state={{tripSearch: this.state.tripSearch}} replace={false} /> : null}
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
    state.tripSearch.tripTerms = tripTerms;
    this.setState(state);
  }

  private isTermsStepValid(): boolean {
    const terms = this.state.tripSearch.tripTerms;
    //return terms && terms.startDate && terms.endDate && terms.startDate <= terms.endDate
    //  && terms.adults && terms.adults > 0 && terms.rooms && terms.rooms > 0;
    return true;
  }
}

export default withRouter(TripSearchTerms);
