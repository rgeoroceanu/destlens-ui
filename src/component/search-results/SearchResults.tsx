import React, {Component} from 'react';
import './SearchResults.css';
import AccommodationMatch from "../../model/AccommodationMatch";
import SearchResult from "../search-result/SearchResult";

class SearchResults extends Component<any, any> {

  render() {
    const currentValue = this.props.results;
    return (
      <div className={"search-results-wrapper"}>
        {this.getResultComponents(currentValue)}
      </div>
    );
  }

  private getResultComponents(matches: AccommodationMatch[]) {
    const components = [];
    for (let i=0; i<matches.length; i++) {
      const component = <SearchResult key={'result'+i}result={matches[i]}></SearchResult>
      components.push(component);
    }
    return components;
  }
}

export default SearchResults;
