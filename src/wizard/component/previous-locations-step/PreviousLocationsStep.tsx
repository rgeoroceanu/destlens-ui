import React, {Component, FunctionComponent, ReactElement} from 'react';
import './PreviousLocationsStep.css';
import SearchInput from "../../../common/component/search-input/SearchInput";
import FormControlLabel from "@mui/material/FormControlLabel";
import SearchApiService from "../../service/SearchApiService";
import PreviousLocations from "../../../common/model/PreviousLocations";
import Nameable from "../../../common/model/Nameable";
import WindowDimensions from "../../../common/component/window-dimensions/WindowDimensions";
import Accommodation from "../../../common/model/Accommodation";
import {Hotel} from "@mui/icons-material";
import {Box} from "@mui/material";

type ScreenWidth = (screenWidth: number) => any;

interface PreviousLocationsStepConfig {
  onValueChange: (value: PreviousLocations) => void,
  initialValueExtractor?: () => PreviousLocations
}

interface IScreenWidth {
  children: ScreenWidth
}

export const ScreenWidth: FunctionComponent<IScreenWidth> = ({children}) => {
  const dimensions = WindowDimensions();
  return children(dimensions.width);
};

class PreviousLocationsStep extends Component<any, any> {

  private searchApiService = new SearchApiService();

  constructor(props: PreviousLocationsStepConfig) {
    super(props);
    const initialValue = props.initialValueExtractor ? props.initialValueExtractor() : null
    this.state = {
      currentValue: initialValue
    }
    this.props.onValueChange(initialValue);
  }

  render() {
    return (
      <div>
        <div className={"title"}>Enter previous locations you enjoyed</div>
        <div className={"subtitle"}>Enter as many positive accommodations as you remember. This will help us find the
          best results for you.
        </div>
        <div className={"locations-wrapper"}>
          {this.getPreviousLocationFields()}
        </div>
      </div>
    );
  }

  private getPreviousLocationFields() {
    const fieldCount = this.state.currentValue.locations.length;
    const fields = [];
    for (let i = 0; i < fieldCount + 1; i++) {
      const locationWrapper =
        <ScreenWidth key={"sc-" + i}>
          {(width) => <FormControlLabel className={"location-label"}
                                        key={"previous-location-" + i}
                                        control={<SearchInput
                                          key={"previous-location-input" + i}
                                          searchFunction={query => this.searchApiService.searchAccommodation(query)}
                                          onValueChange={value => this.handleValueChange(value, i)}
                                          initialOptions={this.getLocationValue(i) ? [this.getLocationValue(i)] : []}
                                          className={"location-hotel"}
                                          optionComponentGenerator={(props, option) => this.generateLocationOption(props, option as Accommodation)}
                                          currentValue={this.getLocationValue(i)}
                                        startAdornment={<Hotel className={"location-start-icon"}/>}></SearchInput>}
                                        label={"Accommodation " + (i+1)}
                                        labelPlacement={width > 1024 ? "start" : "top"} />}</ScreenWidth>

      fields.push(locationWrapper);
    }
    return fields;
  }

  private getLocationValue(locationIndex: number): Accommodation {
    return this.state.currentValue.locations && this.state.currentValue.locations.length > 0 ?
      this.state.currentValue.locations[locationIndex] : undefined;
  }

  private handleValueChange(value: Nameable | null | Nameable[], fieldIndex: number) {
    const locations = this.state.currentValue.locations;
    if (locations.length < fieldIndex + 1) {
      locations.push({});
    }

    if (!value) {
      locations.splice(fieldIndex, 1);
    } else {
      locations[fieldIndex] = value;
    }
    
    this.setState({
      currentValue: {
        ...this.state.currentValue,
        locations: locations
      }
    });
    this.props.onValueChange(this.state.currentValue);
  }

  private generateLocationOption(props: any, option: Accommodation): ReactElement {
    return (<Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
      <div className={"location-option-wrapper"}>
        <Hotel className={"location-option-icon"} />
        <div className={"location-wrapper-text"}>
          <div className={"location-wrapper-title"}>
            {option.name}
          </div>
          <div className={"location-wrapper-subtitle"}>
            {option.city + ', ' + option.country}
          </div>
        </div>
      </div>
    </Box>);
  }
}

export default PreviousLocationsStep;
