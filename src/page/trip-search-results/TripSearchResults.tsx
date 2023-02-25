import React, {Component} from 'react';
import './TripSearchResults.css';
import Progress from "../../component/progress/Progress";
import {Container} from "@mui/material";
import TripSearch from "../../model/TripSearch";
import SearchResults from "../../component/search-results/SearchResults";
import CircularProgress from "@mui/material/CircularProgress";
import SearchApiService from "../../service/SearchApiService";
import SearchFilter from "../../component/search-filter/SearchFilter";
import withRouter from "../../helper/WithRouter";
import AccommodationMatch from "../../model/AccommodationMatch";

class TripSearchResults extends Component<any, any> {

  private readonly searchService = new SearchApiService();

  constructor(props: any) {
    super(props);
    const tripSearch = props.location?.state?.tripSearch;
    this.state = {
      tripSearch: tripSearch ? tripSearch : new TripSearch(),
      results: [],
      searching: true
    };
  }

  componentDidMount() {
    this.startSearch();
  }

  render() {
    const results = this.getMatches();

    return (
      <div>
        <Progress value={100}/>
        <div className={"content-scrollable"}>
          <Container className={"content-wrapper"}>
            <SearchFilter onValueChange={this.onFilterChange.bind(this)}
                          initialValueExtractor={() => this.state.tripSearch}>
            </SearchFilter>

            { this.state.searching ? this.getProgressComponent() : <SearchResults results={results}></SearchResults> }
          </Container>
        </div>
      </div>
    );
  }

  private getProgressComponent() {
    return <div className={"progress-wrapper"}>
      <CircularProgress className={"progress"}/>
    </div>
  }

  private onFilterChange(search: TripSearch) {
    this.setState({ tripSearch: search });
    this.startSearch();
  }

  private startSearch() {
    this.setState({
      searching: true
    });

    this.searchService.findMatchingAccommodations(this.state.tripSearch)
      .then(res => this.onMatchResults(res))
      .catch(e => this.setState({
        searching: false
      }))
      .finally(() => this.setState({
        searching: false
      }));
  }

  private onMatchResults(results: AccommodationMatch[]) {
    this.setState({results: results, searching: false})
  }

  private getMatches() {
    return this.state.results;
  }
}

export default withRouter(TripSearchResults);
