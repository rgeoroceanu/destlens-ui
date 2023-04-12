import React from "react";
import './SearchResult.css';
import AccommodationMatch from "../../model/AccommodationMatch";
import {ArrowLeftRounded, ArrowRightRounded} from "@mui/icons-material";
import IconButton from "@mui/material/IconButton";
import {SUPPORTED_LOCALES} from "../../App";
import {t} from "i18next";
import DateHelper from "../../helper/DateHelper";

interface SearchResultValue {
  result: AccommodationMatch;
  index: number;
}

function SearchResult({result, index}: SearchResultValue) {
  const [currentImageIndex, setCurrentImageIndex] = React.useState<number>(0);
  const dateLocale = SUPPORTED_LOCALES.includes(navigator.language.split('-')[0]) ? navigator.language : "en-US";

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
      { index === 0 && result.score > 0.7 ? <div className={"search-result-score"}>{'Best match: ' + Math.floor(result.score * 100) + '%'}</div> : null }
    </div>
    <div className={"search-result-details-wrapper"}>
      <div className={"search-result-title"}>{result.accommodation.name}</div>
      <div className={"search-result-subtitle"}>{result.accommodation.city + ', ' + result.accommodation.country}</div>
      <div className={"search-result-details"}>
        <div className={"search-result-period"}>{DateHelper.formatDateRange(result.checkinDate, result.checkoutDate, dateLocale)}</div>
        <div className={"search-result-price"}>{t("search.result.from") + " " + getTotalPrice(result) + result.currency}</div>
      </div>
      { result.accommodation.ratingImageUrl ? <div className={"search-result-rating"} onClick={event => handleTripadvisorImageClick(result, event)}>
        <img className={"search-result-rating-image"} src={result.accommodation.ratingImageUrl} alt={"rating"}/>
        <div className={"search-result-rating-reviews"}>{result.accommodation.reviewCount + ' ' + t("search.result.reviews")}</div>
      </div> : null }

    </div>
  </div>;
}

function getTotalPrice(result: AccommodationMatch) {
  const start = new Date(result.checkinDate);
  const end = new Date(result.checkoutDate);
  const diffTime = Math.abs(start.getTime() - end.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays * result.startingPrice;
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

function handleTripadvisorImageClick(result: AccommodationMatch, e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
  e.stopPropagation();
  window.open(result.accommodation.tripadvisorUrl, '_blank');
}

export default SearchResult;