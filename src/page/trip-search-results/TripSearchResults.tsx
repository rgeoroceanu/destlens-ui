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
import {withTranslation} from "react-i18next";
import ReactGA from "react-ga4";

class TripSearchResults extends Component<any, any> {

  private readonly searchService = new SearchApiService();

  constructor(props: any) {
    super(props);
    this.state = {
      results: [],
      searching: false
    };
  }

  componentDidMount() {
    ReactGA.send({ hitType: "pageview", page: "/trip-search-results", title: "Search Results" });
    if (this.state.searching === false) {
      this.startSearch(this.props.location?.state?.tripSearch);
    }
  }

  render() {
    const results = this.getMatches();

    return (
      <div>
        <Progress value={100}/>
        <div className={"content-scrollable"}>
          <Container className={"content-wrapper"}>
            <SearchFilter onValueChange={(v: TripSearch) => this.startSearch(v)}
                          initialValueExtractor={() => this.props.location?.state?.tripSearch}>
            </SearchFilter>

            { this.state.searching ? this.getProgressComponent() :
              (results.length > 0 ? <SearchResults results={results}></SearchResults> : this.getNoResultsComponent()) }
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

  private getNoResultsComponent() {
    return <div className={"progress-wrapper"}>
      <div className={"no-results"}>{this.props.t('search.empty')}</div>
    </div>
  }

  private startSearch(search: TripSearch) {
    this.setState({
      searching: true,
      results: []
    });

    this.searchService.findMatchingAccommodations(search)
      .then(res => this.onMatchResults(res))
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

export default withTranslation()(withRouter(TripSearchResults));
