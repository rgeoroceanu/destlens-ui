import React, {Component} from 'react';
import './TripSearchTags.css';
import Progress from "../../../common/component/progress/Progress";
import {Container} from "@mui/material";
import StepNavigation from "../../../common/component/step-navigation/StepNavigation";
import TripSearch from "../../../common/model/TripSearch";
import {Navigate} from "react-router-dom";
import TripTags from "../../../common/model/TripTags";
import TripTagsStep from "../../component/trip-tags-step/TripTagsStep";

class TripSearchTags extends Component<any, any> {

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
        <Progress value={60}/>
        <Container className={"content-wrapper"}>
          <StepNavigation
            onNext={this.onNextStep.bind(this)}
            onPrevious={this.onPreviousStep.bind(this)}
            previousButtonVisible={true}
            nextButtonVisible={true}
            nextButtonEnabled={this.isStepValid()}
            nextButtonColor={"primary"}
            nextButtonLabel={"Next"}/>

          <TripTagsStep onValueChange={this.onTagsValueChange.bind(this)}
                         initialValueExtractor={() => this.state.tripSearchFormValues.tags}/>
        </Container>

        {this.state.previous ? <Navigate to="/trip-search-terms" replace={true} /> : null}
        {this.state.next ? <Navigate to="/trip-search-history" replace={true} /> : null}
      </div>
    );
  }

  private onNextStep() {
    this.setState({ next: true});
  }

  private onPreviousStep() {
    this.setState({ previous: true});
  }

  private onTagsValueChange(tags: TripTags) {
    const state = { ...this.state };
    state.tripSearchFormValues.tags = tags;
    this.setState(state);
  }

  private isStepValid(): boolean {
    const terms = this.state.tripSearchFormValues.tags;
    //return terms && terms.startDate && terms.endDate && terms.startDate <= terms.endDate
    //  && terms.adults && terms.adults > 0 && terms.rooms && terms.rooms > 0;
    return true;
  }
}

export default TripSearchTags;
