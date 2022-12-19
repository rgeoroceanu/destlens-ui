import React, {Component} from 'react';
import './TripTypeStep.css';
import EnableSwitch from "../../../common/component/enable-toggle/EnableSwitch";
import FormControlLabel from "@mui/material/FormControlLabel";
import {FormGroup, ToggleButton, ToggleButtonGroup} from "@mui/material";
import TripPurpose from "../../../common/model/TripPurpose";
import TripType from "../../../common/model/TripType";

interface TripTypeStepConfig {
  onValueChange: (value: TripType) => void,
  initialValueExtractor?: () => TripType
}

const initialValue: TripType = {
  purpose: TripPurpose.leisure,
  accommodation: true,
  flight: false,
  transfer: false,
  carRental: false
};

class TripTypeStep extends Component<any, any> {

  constructor(props: TripTypeStepConfig) {
    super(props);
    const value = props.initialValueExtractor && props.initialValueExtractor() ? props.initialValueExtractor() : initialValue;
    this.state = {
      currentValue: value
    }
    this.handlePurposeChange = this.handlePurposeChange.bind(this);
    this.onSearchTypeChange = this.onSearchTypeChange.bind(this);
    this.props.onValueChange(value);
  }

  render() {
    const currentValue = this.state.currentValue;
    return (
      <div>
        <div className={"title"}>Pick trip type</div>
        <div className={"subtitle"}>Select what type of search you want.</div>

        <div className={"section"}>Trip purpose</div>

        <ToggleButtonGroup className={"purpose-group"}
                           value={this.state.currentValue.purpose}
                           exclusive
                           onChange={this.handlePurposeChange}
                          aria-label={"purpose"}>
          <ToggleButton className={"purpose-item"}
                        value={TripPurpose.leisure}
                        color={"primary"}>
            Leisure
          </ToggleButton>
          <ToggleButton className={"purpose-item"}
                        value={TripPurpose.business}
                        color={"primary"}>
            Business
          </ToggleButton>
        </ToggleButtonGroup>

        <div className={"section"}>Search type</div>
        <FormGroup className={"controls-wrapper"}>
          <FormControlLabel className={"control-label"}
                            control={<EnableSwitch name="accommodation" defaultChecked onChange={this.onSearchTypeChange} value={currentValue.accommodation}/>}
                            label="Accommodation"
                            labelPlacement={"start"}/>
          <FormControlLabel className={"control-label"}
                            disabled
                            control={<EnableSwitch name="flight" onChange={this.onSearchTypeChange} value={currentValue.flight} />}
                            label="Flight (coming soon)"
                            labelPlacement={"start"}
          />
          <FormControlLabel className={"control-label"}
                            disabled
                            control={<EnableSwitch name="transfer" onChange={this.onSearchTypeChange} value={currentValue.transfer}/>}
                            label="Transfer (coming soon)"
                            labelPlacement={"start"}
          />
          <FormControlLabel className={"control-label"}
                            disabled
                            control={<EnableSwitch name="carRental" onChange={this.onSearchTypeChange} value={currentValue.carRental}/>}
                            label="Car Rental (coming soon)"
                            labelPlacement={"start"}
          />
        </FormGroup>
      </div>
    );
  }

  handlePurposeChange(event: React.MouseEvent<HTMLElement>, newPurpose: TripPurpose) {
    if (newPurpose === null) {
      return;
    }
    const newValue = {
      ...this.state.currentValue,
      purpose: newPurpose
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
}

export default TripTypeStep;
