import React, {Component, ReactElement} from 'react';
import './DestinationStep.css';
import SearchInput from "../../../common/component/search-input/SearchInput";
import SearchApiService from "../../service/SearchApiService";
import Nameable from "../../../common/model/Nameable";
import {Box} from "@mui/material";
import Destination from "../../../common/model/Destination";
import DestinationType from "../../../common/model/DestinationType";
import {Hotel, LocalAirport, LocationCity, LocationOn, NearMe} from "@mui/icons-material";


interface DestinationStepConfig {
  onDestinationSelect: (destination: Nameable) => void,
  initialValueExtractor?: () => Destination
}

class DestinationStep extends Component<any, any> {

  private searchApiService = new SearchApiService();

  constructor(props: DestinationStepConfig) {
    super(props);
    this.state = {
      onDestinationSelect: props.onDestinationSelect,
      currentValue: props.initialValueExtractor ? props.initialValueExtractor() : null
    };
  }

  render() {
    return (
      <div>
        <div className={"title"}>Choose destination</div>
        <div className={"subtitle"}>Enter your desired destination for which you want us to find the best trip.</div>
        <SearchInput
          searchFunction={query => this.searchApiService.searchDestination(query)}
          onValueChange={dest => this.onDestinationSelect(dest, this.state)}
          currentValue={this.state.currentValue}
          initialOptions={this.state.currentValue ? [this.state.currentValue] : []}
          optionComponentGenerator={(props, option) => this.generateDestinationOption(props, option as Destination)}
          className={''}
        startAdornment={<NearMe className={"destination-value-icon"}/>}/>
      </div>
    );
  }

  onDestinationSelect(destination: Nameable | null, currentState: Readonly<any>) {
    currentState.onDestinationSelect(destination);
    this.setState({
      currentValue: destination
    });
  }

  private generateDestinationOption(props: any, option: Destination): ReactElement {
    return (<Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
        { this.getDestinationTypeIcon(option.type) }
        {option.name}
      </Box>);
  }

  private getDestinationTypeIcon(destinationType: DestinationType) {
    switch (destinationType) {
      case DestinationType.airport:
        return (<LocalAirport className={"destination-option-icon"} />);
      case DestinationType.hotel:
        return (<Hotel className={"destination-option-icon"} />);
      case DestinationType.city:
        return (<LocationCity className={"destination-option-icon"} />);
      default:
        return (<LocationOn className={"destination-option-icon"} />);
    }
  }
}

export default DestinationStep;
