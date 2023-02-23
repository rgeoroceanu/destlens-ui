import React, {Component} from 'react';
import './TripSearchTags.css';
import Progress from "../../../common/component/progress/Progress";
import {Container} from "@mui/material";
import StepNavigation from "../../../common/component/step-navigation/StepNavigation";
import TripSearch from "../../../common/model/TripSearch";
import {Navigate} from "react-router-dom";
import TripTags from "../../../common/model/TripTags";
import TripTagsStep from "../../component/trip-tags-step/TripTagsStep";
import withRouter from "../../../common/helper/WithRouter";

class TripSearchTags extends Component<any, any> {

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
        <Progress value={60}/>
        <div className={"content-scrollable"}>
          <Container className={"content-wrapper"}>
            <StepNavigation
              onNext={this.onNextStep.bind(this)}
              onPrevious={this.onPreviousStep.bind(this)}
              previousButtonVisible={true}
              nextButtonVisible={true}
              nextButtonEnabled={true}
              nextButtonColor={this.isStepValid() ? "primary" : "inherit"}
              nextButtonLabel={this.isStepValid() ? "Next" : "Skip"}/>

            <TripTagsStep onValueChange={this.onTagsValueChange.bind(this)}
                          initialValueExtractor={() => this.state.tripSearch.tags}/>
          </Container>
        </div>

        {this.state.previous ? <Navigate to="/trip-search-terms" replace={false} /> : null}
        {this.state.next ? <Navigate to="/trip-search-history" state={{tripSearch: this.state.tripSearch}} replace={false} /> : null}
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
    state.tripSearch.tags = tags;
    this.setState(state);
  }

  private isStepValid(): boolean {
    const tags = this.state.tripSearch.tags;
    return tags && tags.tags &&  Array.from(tags.tags).length > 0;
  }
}

export default withRouter(TripSearchTags);
