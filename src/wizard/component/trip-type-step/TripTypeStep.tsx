import React, {Component, ReactElement} from 'react';
import './TripTypeStep.css';
import EnableSwitch from "../../../common/component/enable-toggle/EnableSwitch";
import FormControlLabel from "@mui/material/FormControlLabel";
import {Box, Button, FormGroup, Link, ToggleButton, ToggleButtonGroup} from "@mui/material";
import TripType from "../../../common/model/TripType";
import TripDetails from "../../../common/model/TripDetails";
import SearchInput from "../../../common/component/search-input/SearchInput";
import Destination from "../../../common/model/Destination";
import {Hotel, LocalAirport, LocationCity, LocationOn, NearMe} from "@mui/icons-material";
import SearchApiService from "../../service/SearchApiService";
import Nameable from "../../../common/model/Nameable";
import DestinationType from "../../../common/model/DestinationType";

interface TripTypeStepConfig {
  onValueChange: (value: TripDetails) => void,
  initialValueExtractor?: () => TripDetails,
  onDestinationSelect: (destination: Nameable) => void
}

const initialValue: TripDetails = {
  category: undefined,
  accommodation: true,
  flight: false,
  transfer: false,
  carRental: false,
  destination: undefined
};

class TripTypeStep extends Component<any, any> {

  private searchApiService = new SearchApiService();

  constructor(props: TripTypeStepConfig) {
    super(props);
    const value = props.initialValueExtractor && props.initialValueExtractor() ? props.initialValueExtractor() : initialValue;
    this.state = {
      currentValue: value,
      onDestinationSelect: props.onDestinationSelect,
      specificDestinationEnabled: value.category === undefined
    }
    this.handleCategoryChange = this.handleCategoryChange.bind(this);
    this.onSearchTypeChange = this.onSearchTypeChange.bind(this);
    this.props.onValueChange(value);
  }

  render() {
    const currentValue = this.state.currentValue;
    return (
      <div>
        <div className={"title"}>Trip type</div>
        <div className={"subtitle"}>Select what type of vacation you want</div>
        <div className={"section"}>{ this.state.specificDestinationEnabled === false ? 'Purpose' : 'Destination' } </div>

        { this.state.specificDestinationEnabled === false ? <ToggleButtonGroup className={"category-group"}
                                                                               value={this.state.currentValue.category}
                                                                               exclusive
                                                                               onChange={this.handleCategoryChange}
                                                                               aria-label={"category"}>
          <ToggleButton className={"category-item"}
                        value={TripType.beach}
                        color={"primary"}>
            Beach
          </ToggleButton>
          <ToggleButton className={"category-item"}
                        value={TripType.sports}
                        color={"primary"}>
            Sports
          </ToggleButton>
          <ToggleButton className={"category-item"}
                        value={TripType.city}
                        color={"primary"}>
            City
          </ToggleButton>
          <ToggleButton className={"category-item"}
                        value={TripType.resort}
                        color={"primary"}>
            Resort
          </ToggleButton>
          <ToggleButton className={"category-item"}
                        value={TripType.road_trip}
                        color={"primary"}>
            Roadtrip
          </ToggleButton>
          <ToggleButton className={"category-item"}
                        value={TripType.sightseeing}
                        color={"primary"}>
            Sightseeing
          </ToggleButton>
          <ToggleButton className={"category-item"}
                        value={TripType.mountain}
                        color={"primary"}>
            Mountain
          </ToggleButton>
          <ToggleButton className={"category-item"}
                        value={TripType.ski}
                        color={"primary"}>
            Ski
          </ToggleButton>
          <ToggleButton className={"category-item"}
                        value={TripType.business}
                        color={"primary"}>
            Business
          </ToggleButton>
        </ToggleButtonGroup> : null }

        { this.state.specificDestinationEnabled === true ? <SearchInput
          searchFunction={query => this.searchApiService.searchDestination(query)}
          onValueChange={dest => this.onDestinationSelect(dest)}
          currentValue={this.state.currentValue.destination}
          initialOptions={this.state.currentValue.destination ? [this.state.currentValue.destination] : []}
          optionComponentGenerator={(props, option) => this.generateDestinationOption(props, option as Destination)}
          className={'destination'}
          startAdornment={<NearMe className={"destination-value-icon"}/>}/> : null }

        <div className={"destination-switch-wrapper"}>
          <Link className={'destination-switch-button'}
                onClick={e => this.toggleDestinationEnableState()}>{this.state.specificDestinationEnabled === false ? 'Or choose destination' : 'I do not know where'}
          </Link>
        </div>

        <div className={"section"}>Search options</div>
        <FormGroup className={"controls-wrapper"}>
          <FormControlLabel className={"control-label"}
                            control={<EnableSwitch readOnly={true} name="accommodation" defaultChecked onChange={this.onSearchTypeChange} value={currentValue.accommodation}/>}
                            label="Accommodation"
                            labelPlacement={"start"}/>
          <FormControlLabel className={"control-label"}
                            control={<EnableSwitch name="flight" onChange={this.onSearchTypeChange} value={currentValue.flight} />}
                            label="Flight"
                            labelPlacement={"start"}
          />
          <FormControlLabel className={"control-label"}
                            control={<EnableSwitch name="transfer" onChange={this.onSearchTypeChange} value={currentValue.transfer}/>}
                            label="Transfer"
                            labelPlacement={"start"}
          />
          <FormControlLabel className={"control-label"}
                            control={<EnableSwitch name="carRental" onChange={this.onSearchTypeChange} value={currentValue.carRental}/>}
                            label="Car Rental"
                            labelPlacement={"start"}
          />
        </FormGroup>
      </div>
    );
  }

  private toggleDestinationEnableState() {
    this.setState({
      specificDestinationEnabled: !this.state.specificDestinationEnabled
    });
    const newValue = {
      ...this.state.currentValue,
      category: undefined,
      destination: undefined
    };
    this.setState({
      currentValue: newValue
    });
    this.props.onValueChange(newValue);
  }

  private handleCategoryChange(event: React.MouseEvent<HTMLElement> | null, newCategory: TripType | null) {
    const newValue = {
      ...this.state.currentValue,
      category: newCategory,
      destination: undefined
    };
    this.setState({
      currentValue: newValue
    });
    this.props.onValueChange(newValue);
  };

  private onSearchTypeChange(event: any) {
    const newValue = {
      ...this.state.currentValue,
      [event.target.name]: event.target.checked
    };
    this.setState({
      currentValue: newValue
    });
    this.props.onValueChange(newValue);
  }

  private onDestinationSelect(destination: Nameable | null | Nameable[]) {
    const newValue = {
      ...this.state.currentValue,
      destination: destination,
      category: undefined
    };
    this.setState({
      currentValue: newValue
    });
    this.props.onValueChange(newValue);
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

export default TripTypeStep;
