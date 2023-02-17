import React, {Component} from 'react';
import './TripSearchResults.css';
import Progress from "../../../common/component/progress/Progress";
import {Container} from "@mui/material";
import TripSearch from "../../../common/model/TripSearch";
import SearchResults from "../../component/search-result/SearchResults";
import CircularProgress from "@mui/material/CircularProgress";
import SearchApiService from "../../service/SearchApiService";
import MatchResult from "../../../common/model/MatchResult";

class TripSearchResults extends Component<any, any> {

  private readonly searchService = new SearchApiService();

  constructor(props: any) {
    super(props);
    this.state = {
      tripSearchFormValues: new TripSearch()
    };
  }
  render() {
    return (
      <div>
        <Progress value={100}/>
        <Container className={"content-wrapper"}>
          { this.state.searching ? this.getProgressComponent() : (this.state.complete && this.getMatches() ? <SearchResults matches={this.getMatches()}/> : this.state.currentComponent) }
        </Container>
      </div>
    );
  }

  private getProgressComponent() {
    return <div className={"progress-wrapper"}>
      <CircularProgress className={"progress"}/>
    </div>
  }

  private onFilterChange(filter: TripSearch) {
    const state = { ...this.state };
    this.setState(state);
  }

  private startSearch() {
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

  private onMatchResult(result: MatchResult) {
    this.setState({
      matches: result.accommodationMatches,
      complete: true
    });
  }

  private getMatches() {
    return this.state.matches;
  }
}

export default TripSearchResults;
