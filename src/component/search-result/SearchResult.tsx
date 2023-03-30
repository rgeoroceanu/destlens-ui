import React from "react";
import './SearchResult.css';
import AccommodationMatch from "../../model/AccommodationMatch";
import {ArrowLeftRounded, ArrowRightRounded} from "@mui/icons-material";
import IconButton from "@mui/material/IconButton";

interface SearchResultValue {
  result: AccommodationMatch;
}

function SearchResult({result}: SearchResultValue) {
  const [currentImageIndex, setCurrentImageIndex] = React.useState<number>(0);

  return <div className={"search-result-wrapper"} onClick={e => handleClick(result)}>
    <div className={"search-result-image-container"}>
      <img className={"search-result-image"}
           src={result.accommodation.photos[currentImageIndex]} alt={"accommodation"}/>
      <IconButton aria-label="image-next"
                  className={"search-result-image-next"}
                  onClick={e => handleNextImage(e, setCurrentImageIndex, result.accommodation.photos.length, currentImageIndex)}>
        <ArrowRightRounded />
      </IconButton>
      <IconButton aria-label="image-previous"
                  className={"search-result-image-previous"}
                  onClick={e => handlePreviousImage(e, setCurrentImageIndex, result.accommodation.photos.length, currentImageIndex)}>
        <ArrowLeftRounded />
      </IconButton>
    </div>
    <div className={"search-result-details-wrapper"}>
      <div className={"search-result-title"}>{result.accommodation.name}</div>
      <div className={"search-result-subtitle"}>{result.accommodation.city + ', ' + result.accommodation.country}</div>
      <div className={"search-result-price"}>{"$".repeat(result.accommodation.priceLevel)}</div>
      <div className={"search-result-rating"}>
        <img className={"search-result-rating-image"} src={result.accommodation.ratingImageUrl} alt={"rating"}/>
        <div className={"search-result-rating-reviews"}>{result.accommodation.reviewCount + ' reviews'}</div>
      </div>

    </div>
  </div>;
}

function handleNextImage(e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
                         setCurrentImageIndex: React.Dispatch<React.SetStateAction<number>>,
                         imageCount: number, currentImageIndex: number) {
  e.stopPropagation();
  const index = currentImageIndex === imageCount - 1 ? 0 : ++currentImageIndex;
  setCurrentImageIndex(index);
}

function handlePreviousImage(e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
                             setCurrentImageIndex: React.Dispatch<React.SetStateAction<number>>,
                             imageCount: number, currentImageIndex: number) {
  e.stopPropagation();
  const index = currentImageIndex === 0 - 1 ? imageCount - 1 : --currentImageIndex;
  setCurrentImageIndex(index);
}

function handleClick(result: AccommodationMatch) {
  window.open(result.accommodation.url, '_blank');
}

export default SearchResult;