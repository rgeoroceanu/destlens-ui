import React, {Component} from "react";
import SearchResult from "../search-result/SearchResult";
import Carousel from "react-material-ui-carousel";
import './RecommendationsBox.css';

class RecommendationsBox extends Component<any, any> {

  render() {
    const currentValue = this.props.recommendations;
    return (
      <div className={"recommendations-box-wrapper"}>
        <Carousel className={"recommendations-box-carousel"} navButtonsProps={{style: { marginTop: -50}}}>
        {
          currentValue.map((item: any, i: number) => <div  key={'recommendations-box-item-'+i} className={"recommendation-box-item"}><SearchResult result={item} index={i} navigationVisible={false}></SearchResult></div> )
        }
        </Carousel>
      </div>
    );
  }
}

export default RecommendationsBox;