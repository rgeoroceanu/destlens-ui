import React from "react";
import './SearchResult.css';
import {ArrowLeftRounded, ArrowRightRounded} from "@mui/icons-material";
import IconButton from "@mui/material/IconButton";
import {t} from "i18next";
import Accommodation from "../../model/Accommodation";

interface SearchResultValue {
  result: Accommodation;
  index: number;
}

function SearchResult({result, index}: SearchResultValue) {
  const [currentImageIndex, setCurrentImageIndex] = React.useState<number>(0);

  return <div className={"search-result-wrapper"} onClick={e => handleClick(result)}>
    <div className={"search-result-image-container"}>
      <img className={"search-result-image"}
           src={result.photos?.[currentImageIndex]} alt={"accommodation"}/>
      <IconButton aria-label="image-next"
                  className={"search-result-image-next"}
                  onClick={e => handleNextImage(e, setCurrentImageIndex, result.photos.length, currentImageIndex)}>
        <ArrowRightRounded />
      </IconButton>
      <IconButton aria-label="image-previous"
                  className={"search-result-image-previous"}
                  onClick={e => handlePreviousImage(e, setCurrentImageIndex, result.photos.length, currentImageIndex)}>
        <ArrowLeftRounded />
      </IconButton>
      {/*{ index === 0 && result.score > 0.7 ? <div className={"search-result-score"}>{'Best match: ' + Math.floor(result.score * 100) + '%'}</div> : null }*/}
    </div>
    <div className={"search-result-details-wrapper"}>
      <div className={"search-result-title"}>{result.name}</div>
      <div className={"search-result-subtitle"}>{result.city + ', ' + result.country}</div>
      <div className={"search-result-details"}>
        <div className={"search-result-price"}>{result.priceLevel}</div>
      </div>
      { result.ratingImageUrl ? <div className={"search-result-rating"}>
        <img className={"search-result-rating-image"} src={result.ratingImageUrl} alt={"rating"}/>
        <div className={"search-result-rating-reviews"}>{result.reviewCount + ' ' + t("search.result.reviews")}</div>
      </div> : null }

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

function handleClick(result: Accommodation) {
  window.open(result.url, '_blank');
}

export default SearchResult;