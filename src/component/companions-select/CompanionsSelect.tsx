import React, {Component} from 'react';
import './CompanionsSelect.css';
import TripCompanions from "../../model/TripCompanions";
import {FormControlLabel} from "@mui/material";
import NumberInput from "../number-input/NumberInput";
import {withTranslation} from "react-i18next";

interface CompanionsSelectConfig extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  onValueChange: (value: TripCompanions) => void,
  initialValueExtractor?: () => TripCompanions
}

class CompanionsSelect extends Component<any, any> {

  constructor(props: CompanionsSelectConfig) {
    super(props);
    const initialValue = props.initialValueExtractor ? props.initialValueExtractor() : null
    this.state = {
      currentValue: initialValue,
    }
  }

  render() {
    return (
      <div className={"companions-select-wrapper " + (this.props.className ? this.props.className : "")}>
        <FormControlLabel className={"companions-select-label"}
                          control={<NumberInput onValueChange={val => this.onAttendanceChange(val, "adults")}
                                                max={6}
                                                defaultValue={this.state.currentValue?.adults}/>}
                          label={this.props.t('companions.adults')}
                          labelPlacement={"start"} />
        <FormControlLabel className={"companions-select-label"}
                          control={<NumberInput onValueChange={val => this.onAttendanceChange(val, "children")}
                                                max={6}
                                                defaultValue={this.state.currentValue?.children}/>}
                          label={this.props.t('companions.children')}
                          labelPlacement={"start"} />

        { this.getChildrenAgeFields() }
      </div>
    );
  }

  private getChildrenAgeFields() {
    const fields = [];
    const children = this.state.currentValue?.children ? this.state.currentValue.children : [];
    for (let i = 0; i < children; i++) {
      const defaultValue = this.state.currentValue?.childrenAges[i] ? this.state.currentValue.childrenAges[i] : 0;
      const field = <FormControlLabel className={"companions-select-label"}
                                      key={"child-age-" + (i + 1)}
                                      control={<NumberInput onValueChange={val => this.onChildAgeChange(val, i)}
                                                            key={"child-age-" + i}
                                                            max={17}
                                                            defaultValue={defaultValue}/>}
                                      label={this.props.t('companions.childAge', { number: '' + (i + 1)})}
                                      labelPlacement={"start"} />

      fields.push(field);
    }

    return fields;
  }

  private onAttendanceChange(value: number, field: string) {
    const newValue = {
      ...this.state.currentValue,
      [field]: value
    }
    this.setState({
      currentValue: newValue
    });
    this.props.onValueChange(newValue);
  }

  private onChildAgeChange(value: number, childFieldIndex: number) {
    const childrenAges = this.state.currentValue.childrenAges;
    childrenAges[childFieldIndex] = value;
    const newValue = {
      ...this.state.currentValue,
      childrenAges: childrenAges
    }
    this.setState({
      currentValue: newValue
    });
    this.props.onValueChange(newValue);
  }
}

export default withTranslation()(CompanionsSelect);
