import React, {Component} from 'react';
import './CompanionsSelect.css';
import TripTerms from "../../model/TripTerms";
import {FormControlLabel} from "@mui/material";
import NumberInput from "../number-input/NumberInput";

interface CompanionsSelectConfig extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  onValueChange: (value: TripTerms) => void,
  initialValueExtractor?: () => TripTerms
}

class CompanionsSelect extends Component<any, any> {

  constructor(props: CompanionsSelectConfig) {
    super(props);
    const initialValue = props.initialValueExtractor ? props.initialValueExtractor() : null
    this.state = {
      currentValue: initialValue,
    }
    this.props.onValueChange(initialValue);
  }

  render() {
    return (
      <div className={"companions-select-wrapper " + (this.props.className ? this.props.className : "")}>
        <FormControlLabel className={"companions-select-label"}
                          control={<NumberInput onValueChange={val => this.onAttendanceChange(val, "adults")}
                                                defaultValue={this.state.currentValue?.adults}/>}
                          label="Adults"
                          labelPlacement={"start"} />
        <FormControlLabel className={"companions-select-label"}
                          control={<NumberInput onValueChange={val => this.onAttendanceChange(val, "children")}
                                                defaultValue={this.state.currentValue?.children}/>}
                          label="Children"
                          labelPlacement={"start"} />

        { this.getChildrenAgeFields() }

        <FormControlLabel className={"companions-select-label"}
                          control={<NumberInput onValueChange={val => this.onAttendanceChange(val, "rooms")}
                                                defaultValue={this.state.currentValue?.rooms}/>}
                          label="Rooms"
                          labelPlacement={"start"} />
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
                                                            defaultValue={defaultValue}/>}
                                      label={"Child " + (i + 1) + " age"}
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

export default CompanionsSelect;
