import React from "react";
import './SearchResult.css';
import AccommodationMatch from "../../model/AccommodationMatch";

interface SearchResultValue {
  result: AccommodationMatch;
}

function SearchResult({result}: SearchResultValue) {
  return <div className={"search-result-wrapper"}>
    <div className={"search-result-image-container"}>
      <img className={"search-result-image"}
           src={result.accommodation.images[0]} alt={"accommodation"}/>
    </div>
    <div className={"search-result-details-wrapper"}>
      <div className={"search-result-title"}>{result.accommodation.name}</div>
      <div className={"search-result-subtitle"}>{result.accommodation.city + ', ' + result.accommodation.country}</div>
      <img className={"search-result-rating-image"} src={result.accommodation.ratingImageUrl} alt={"rating"}/>
      <div className={"search-result-subtitle"}>{result.accommodation.pricePerNight + ' ' + result.accommodation.currency + ' / night'}</div>
    </div>
  </div>;
}

export default SearchResult;