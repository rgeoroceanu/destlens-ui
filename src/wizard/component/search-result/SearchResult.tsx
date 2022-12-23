import React, {Component} from 'react';
import './SearchResult.css';
import AccommodationMatch from "../../../common/model/AccommodationMatch";
import {ArrowBackIos, ArrowForwardIos, Star, StarHalf} from "@mui/icons-material";
import {Button, IconButton} from "@mui/material";

interface SearchResultConfig {
  matches: AccommodationMatch[]
}

class SearchResult extends Component<any, any> {

  constructor(props: SearchResultConfig) {
    super(props);
    this.state = {
      matches: props.matches,
      currentValueIndex: 0
    };
  }

  render() {
    const currentValue = this.state.matches[this.state.currentValueIndex];
    const isFirst = currentValue === this.state.matches[0];
    const isLast = currentValue === this.state.matches[this.state.matches.length - 1];
    return (
      <div className={"search-result-wrapper"}>
        <div className={"search-result-navigation-wrapper"}>
          <IconButton
            disabled={ isFirst }
            className={"search-result-previous"}
            color={"primary"}
            onClick={this.onPreviousResult.bind(this)}>
            <ArrowBackIos/>
          </IconButton>
          <div className={"search-result-container"}>
            <div className={"search-result-image-container"}>
              <img className={"search-result-image"}
                   src={currentValue.accommodation.mediumPhotoUrl} alt={"accommodation"}/>
              {/*{ isFirst ? <div className={"search-result-score"}>{ Math.floor(currentValue.score) + '%'} </div> : null }*/}
            </div>
            <div className={"search-result-info-container"}>
              <div className={"search-result-name"}>{currentValue.accommodation.name}</div>
              <div className={"search-result-location"}>{currentValue.accommodation.city + ', ' + currentValue.accommodation.country}</div>
              <div className={"search-result-details-wrapper"}>
                <div className={"search-result-details-rating"}>
                  <div className={"search-result-rating-image"}>{this.getRatingComponent(currentValue.accommodation.ratingImageUrl)}</div>
                  <div className={"search-result-rating-display"}>{this.getRatingDisplay(currentValue.accommodation.ratingDisplay)}</div>
                  <div className={"search-result-price"}>{ currentValue.accommodation.priceLevelDisplay }</div>
                </div>
                <div className={"search-result-details-deal"}>
                  <img className={"search-result-booking-logo"} src={"/tripadvisor_logo.png"} alt="logo" />
                  <Button
                    href={currentValue.accommodation.url}
                    target={"_blank"}
                    className={"search-result-button"}
                    variant="contained"
                    color={"primary"}>
                    View details
                  </Button>
                </div>
              </div>
            </div>
          </div>
          <IconButton
            disabled={ isLast }
            className={"search-result-next"}
            color={"primary"}
            onClick={this.onNextResult.bind(this)}>
            <ArrowForwardIos/>
          </IconButton>
        </div>
      </div>
    );
  }

  private getRatingComponent(ratingImageUrl: string) {
    return  <img src={ratingImageUrl} alt={"rating"}/>
  }

  private getRatingDisplay(ratingDisplay: string) {
    return ratingDisplay.charAt(0).toUpperCase() + ratingDisplay.slice(1).toLowerCase()
  }

  private onNextResult() {
    const currentValueIndex = this.state.currentValueIndex;
    this.setState({
      currentValueIndex: Math.min(currentValueIndex + 1, this.state.matches.length)
    });
  }

  private onPreviousResult() {
    const currentValueIndex = this.state.currentValueIndex;
    this.setState({
      currentValueIndex: Math.max(0, currentValueIndex - 1)
    });
  }
}

export default SearchResult;
