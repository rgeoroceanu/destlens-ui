import React, {Component} from 'react';
import './TermsStep.css';
import {AdapterDayjs} from '@mui/x-date-pickers-pro/AdapterDayjs';
import TextField from "@mui/material/TextField";
import {Box, InputAdornment} from "@mui/material";
import {CalendarMonth} from "@mui/icons-material";
import NumberInput from "../../../common/component/number-input/NumberInput";
import FormControlLabel from "@mui/material/FormControlLabel";
import {DateRange, DateRangePicker, LocalizationProvider} from '@mui/x-date-pickers-pro';
import TripTerms from "../../../common/model/TripTerms";

interface TripTermsStepConfig {
  onValueChange: (value: TripTerms) => void,
  initialValueExtractor?: () => TripTerms
}

const initialStartDate = new Date();
const initialEndDate = new Date();
initialEndDate.setDate(initialStartDate.getDate() + 1)

const initialValue: TripTerms = {
  startDate: initialStartDate,
  endDate: initialEndDate,
  adults: 2,
  children: 0,
  childrenAges: [],
  rooms: 1
};

class TermsStep extends Component<any, any> {

  constructor(props: TripTermsStepConfig) {
    super(props);
    const value = props.initialValueExtractor && props.initialValueExtractor() ? props.initialValueExtractor() : initialValue;
    this.state = {
      currentValue: value
    }
    this.props.onValueChange(value);
  }

  render() {
    return (
      <div>
        <div className={"title"}>Select terms</div>
        <div className={"subtitle"}>Select trip period and companions.</div>
        <LocalizationProvider
          dateAdapter={AdapterDayjs}
          localeText={{ start: 'Check-in', end: 'Check-out' }}>
          <DateRangePicker
            className={"dates-picker"}
            value={[this.state.currentValue.startDate, this.state.currentValue.endDate]}
            onChange={this.onDatesValueChange.bind(this)}
            minDate={new Date()}
            renderInput={(startProps, endProps) => (
              <React.Fragment>
                <TextField {...startProps}
                           className={"date-field"}
                           InputProps={{
                             sx: {
                               "& input": {
                                 textAlign: "center"
                               }
                             },
                             startAdornment: (
                               <InputAdornment position="start">
                                 <CalendarMonth />
                               </InputAdornment>
                             ),
                           }}>
                </TextField>
                <Box sx={{ mx: 2 }}> - </Box>
                <TextField {...endProps}
                           className={"date-field"}
                           InputProps={{
                             sx: {
                               "& input": {
                                 textAlign: "center"
                               }
                             },
                             startAdornment: (
                               <InputAdornment position="start">
                                 <CalendarMonth />
                               </InputAdornment>
                             ),
                           }}>
                </TextField>
              </React.Fragment>
            )}
          />
        </LocalizationProvider>

        <div className={"controls-wrapper"}>
          <FormControlLabel className={"control-label"}
                            control={<NumberInput onValueChange={val => this.onAttendanceChange(val, "adults")} defaultValue={this.state.currentValue.adults}/>}
                            label="Adults"
                            labelPlacement={"start"} />
          <FormControlLabel className={"control-label"}
                            control={<NumberInput onValueChange={val => this.onAttendanceChange(val, "children")} defaultValue={this.state.currentValue.children}/>}
                            label="Children"
                            labelPlacement={"start"} />

          { this.getChildrenAgeFields() }

          <FormControlLabel className={"control-label"}
                            control={<NumberInput onValueChange={val => this.onAttendanceChange(val, "rooms")} defaultValue={this.state.currentValue.rooms}/>}
                            label="Rooms"
                            labelPlacement={"start"} />
        </div>
      </div>
    );
  }

  private getChildrenAgeFields() {
    const fields = [];
    const children = this.state.currentValue.children;
    for (let i = 0; i < children; i++) {
      const defaultValue = this.state.currentValue.childrenAges[i] ? this.state.currentValue.childrenAges[i] : 0;
      const field = <FormControlLabel className={"control-label"}
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

  private onDatesValueChange(dates: DateRange<any>) {
    const start = dates && dates[0] ? dates[0] : undefined;
    const end = dates && dates[1] ? dates[1] : undefined;

    if (start > end) {
      return;
    }

    const newValue = {
      ...this.state.currentValue,
      startDate: start.toDate(),
      endDate: end.toDate()
    };
    this.setState({
      currentValue: newValue
    });
    this.props.onValueChange(newValue);
  }
}

export default TermsStep;
