import React, {Component} from 'react';
import './SearchResults.css';
import SearchResult from "../search-result/SearchResult";
import Accommodation from "../../model/Accommodation";

class SearchResults extends Component<any, any> {

  render() {
    const currentValue = this.props.results;
    return (
      <div className={"search-results-wrapper"}>
        {this.getResultComponents(currentValue)}
      </div>
    );
  }

  private getResultComponents(accommodations: Accommodation[]) {
    const components = [];
    for (let i=0; i<accommodations.length; i++) {
      const component = <SearchResult key={'result'+i} result={accommodations[i]} index={i}></SearchResult>
      components.push(component);
    }
    return components;
  }
}

export default SearchResults;
