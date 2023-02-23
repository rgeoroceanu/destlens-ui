import React, {Component} from 'react';
import './TripTermsStep.css';
import {AdapterDayjs} from '@mui/x-date-pickers-pro/AdapterDayjs';
import TextField from "@mui/material/TextField";
import {Box, InputAdornment, Link, ToggleButton, ToggleButtonGroup} from "@mui/material";
import {CalendarMonth} from "@mui/icons-material";
import NumberInput from "../../../common/component/number-input/NumberInput";
import FormControlLabel from "@mui/material/FormControlLabel";
import {DateRange, DateRangePicker, LocalizationProvider} from '@mui/x-date-pickers-pro';
import TripTerms from "../../../common/model/TripTerms";
import PeriodType from "../../../common/model/PeriodType";
import withRouter from "../../../common/helper/WithRouter";
import DurationType from "../../../common/model/DurationType";

const initialStartDate = new Date();
const initialEndDate = new Date();
initialEndDate.setDate(initialStartDate.getDate() + 1);

interface TripTermsStepConfig {
  onValueChange: (value: TripTerms) => void,
  initialValueExtractor?: () => TripTerms
}

class TripTermsStep extends Component<any, any> {

  constructor(props: TripTermsStepConfig) {
    super(props);
    const value = props.initialValueExtractor && props.initialValueExtractor() ? props.initialValueExtractor() : new TripTerms();
    this.state = {
      currentValue: value,
      isSpecificPeriod: value.period === undefined
    }
    this.props.onValueChange(value);
  }

  render() {
    return (
      <div>
        <div className={"title"}>Select terms</div>
        <div className={"subtitle"}>Select period and companions</div>

        <div className={"section"}>Period</div>
        { this.state.isSpecificPeriod === false ?
          <div className={"period-wrapper"}>
            <ToggleButtonGroup className={"duration-group"}
                               value={this.state.currentValue.duration}
                               exclusive
                               onChange={this.handleDurationChange.bind(this)}
                               aria-label={"duration"}>
              <ToggleButton className={"duration-item"}
                            value={DurationType.weekend}
                            color={"primary"}>
                One weekend
              </ToggleButton>
              <ToggleButton className={"duration-item"}
                            value={DurationType.week}
                            color={"primary"}>
                One week
              </ToggleButton>
              <ToggleButton className={"duration-item"}
                            value={DurationType.month}
                            color={"primary"}>
                One month
              </ToggleButton>
            </ToggleButtonGroup>

            <span className={"period-delimiter"}>in</span>

            <ToggleButtonGroup className={"period-group"}
                               value={this.state.currentValue.period}
                               exclusive
                               onChange={this.handlePeriodChange.bind(this)}
                               aria-label={"period"}>
              <ToggleButton className={"period-item"}
                            value={PeriodType.summer}
                            color={"primary"}>
                Summer
              </ToggleButton>
              <ToggleButton className={"period-item"}
                            value={PeriodType.autumn}
                            color={"primary"}>
                Autumn
              </ToggleButton>
              <ToggleButton className={"period-item"}
                            value={PeriodType.winter}
                            color={"primary"}>
                Winter
              </ToggleButton>
              <ToggleButton className={"period-item"}
                            value={PeriodType.spring}
                            color={"primary"}>
                Spring
              </ToggleButton>
            </ToggleButtonGroup>
          </div> : null }

        { this.state.isSpecificPeriod ? <LocalizationProvider
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
        </LocalizationProvider> : null }

        <div className={"period-switch-wrapper"}>
          <Link className={'period-switch-button'}
                onClick={e => this.togglePeriodEnableState()}>{this.state.isSpecificPeriod === false ? 'Or choose dates' : 'I do not know when'}
          </Link>
        </div>


        <div className={"section"}>Who's traveling?</div>
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

  private togglePeriodEnableState() {
    this.setState({
      isSpecificPeriod: !this.state.isSpecificPeriod
    });
    const newValue = {
      ...this.state.currentValue,
      startDate: null,
      endDate: null,
      period: undefined
    };
    this.setState({
      currentValue: newValue
    });
    this.props.onValueChange(newValue);
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

  handlePeriodChange(event: React.MouseEvent<HTMLElement> | null, newPeriod: PeriodType | null) {
    const newValue = {
      ...this.state.currentValue,
      period: newPeriod
    };
    this.setState({
      currentValue: newValue
    });
    this.props.onValueChange(newValue);
  };

  handleDurationChange(event: React.MouseEvent<HTMLElement> | null, newDuration: DurationType | null) {
    const newValue = {
      ...this.state.currentValue,
      duration: newDuration
    };
    this.setState({
      currentValue: newValue
    });
    this.props.onValueChange(newValue);
  };
}

export default withRouter(TripTermsStep);