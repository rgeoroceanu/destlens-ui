import React, {Component, ReactElement} from 'react';
import './SearchFilter.css';
import {Box, Button, FormControl, InputLabel, Link, MenuItem, Select} from "@mui/material";
import TripSearch from "../../model/TripSearch";
import TripType from "../../model/TripType";
import PeriodType from "../../model/PeriodType";
import SearchFilterCompanionsSelect from "../search-filter-companions-select/SearchFilterCompanionsSelect";
import TripTerms from "../../model/TripTerms";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import SearchApiService from "../../service/SearchApiService";
import SearchInput from "../search-input/SearchInput";
import Accommodation from "../../model/Accommodation";
import {Hotel, LocalAirport, LocationCity, LocationOn, NearMe} from "@mui/icons-material";
import Nameable from "../../model/Nameable";
import Destination from "../../model/Destination";
import DestinationType from "../../model/DestinationType";
import TagCategory from "../../model/TagCategory";
import Tag from "../../model/Tag";
import DatePicker from "react-datepicker";
import {SUPPORTED_LOCALES} from "../../App";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

// const SEARCH_TYPE_OPTIONS = ["Accommodation", "Flight", "Transfer", "Car Rental"];

interface SearchFilterConfig {
  onValueChange: (value: TripSearch) => void,
  initialValueExtractor?: () => TripSearch
}

class SearchFilter extends Component<any, any> {

  private searchApiService = new SearchApiService();

  constructor(props: SearchFilterConfig) {
    super(props);
    const value = props.initialValueExtractor && props.initialValueExtractor() ? props.initialValueExtractor() : new TripSearch();
    this.state = {
      currentValue: value,
      isDestinationSelect: value.tripDetails.destination !== undefined,
      isSpecificPeriodSelect: value.tripTerms.period === undefined,
      tags: []
    }
  }

  componentDidMount() {
    this.searchApiService.getAllTags()
      .then(tags => this.setState({tags: tags}));
  }

  render() {
    // const searchOptionsValue = this.getSearchOptionsValue();
    const currentDestinationSelectFlag = this.state.isDestinationSelect;
    const currentPeriodSelectFlag = this.state.isSpecificPeriodSelect;

    return (
      <div className={"search-filter-wrapper"}>
        <div className={"search-filter-type-wrapper"}>
          { !currentDestinationSelectFlag ?
            <FormControl fullWidth size="small">
              <InputLabel id="search-filter-purpose-label">Purpose</InputLabel>
              <Select
                id="search-filter-purpose"
                labelId="search-filter-purpose-label"
                value={this.state.currentValue?.tripDetails?.category}
                label="Purpose"
                onChange={() => this.handlePurposeChange()}>
                <MenuItem value={TripType.beach}>Beach</MenuItem>
                <MenuItem value={TripType.sports}>Sports</MenuItem>
                <MenuItem value={TripType.city}>City</MenuItem>
                <MenuItem value={TripType.resort}>Resort</MenuItem>
                <MenuItem value={TripType.road_trip}>Road Trip</MenuItem>
                <MenuItem value={TripType.sightseeing}>Sightseeing</MenuItem>
                <MenuItem value={TripType.mountain}>Mountain</MenuItem>
                <MenuItem value={TripType.ski}>Ski</MenuItem>
              </Select>
            </FormControl> : <SearchInput
              size={"small"}
              label={"Destination"}
              searchFunction={query => this.searchApiService.searchDestination(query)}
              onValueChange={dest => this.handleDestinationChange(dest)}
              currentValue={this.state.currentValue?.tripDetails?.destination}
              initialOptions={this.state.currentValue?.destination ? [this.state.currentValue.destination] : []}
              optionComponentGenerator={(props, option) => this.generateDestinationOption(props, option as Destination)}
              className={'destination'}
              startAdornment={<NearMe className={"destination-value-icon"}/>}/>}

          <Link className="search-filter-link" onClick={e => this.handleChangeToDestinationSelect()}>
            { currentDestinationSelectFlag ? "I do not know where" : "Choose destination" }
          </Link>
        </div>

        {/*<FormControl fullWidth size="small">*/}
        {/*  <InputLabel id="search-filter-options-label">Options</InputLabel>*/}
        {/*  <Select*/}
        {/*    labelId="search-filter-options-label"*/}
        {/*    id="search-filter-options"*/}
        {/*    multiple*/}
        {/*    value={searchOptionsValue}*/}
        {/*    onChange={(e) => this.handleOptionsChange(e.target.value as string[])}*/}
        {/*    input={<OutlinedInput label="Option" />}*/}
        {/*    renderValue={(selected) => selected.join(', ')}*/}
        {/*    MenuProps={MenuProps}*/}
        {/*  >*/}
        {/*    {SEARCH_TYPE_OPTIONS.map(name => (*/}
        {/*      <MenuItem key={name} value={name}>*/}
        {/*        <Checkbox checked={searchOptionsValue.indexOf(name) > -1} />*/}
        {/*        <ListItemText primary={name} />*/}
        {/*      </MenuItem>*/}
        {/*    ))}*/}
        {/*  </Select>*/}
        {/*</FormControl>*/}

        <div className={"search-filter-period-wrapper"}>
          { !currentPeriodSelectFlag ?
            <FormControl fullWidth size="small">
              <InputLabel id="search-filter-period-label">Period</InputLabel>
              <Select
                id="search-filter-period"
                labelId="search-filter-period-label"
                value={this.state.currentValue?.tripTerms?.period}
                label="Period"
                onChange={(e, r) => this.handlePeriodChange(e.target.value as string)}>
                <MenuItem value={PeriodType.summer}>Summer</MenuItem>
                <MenuItem value={PeriodType.autumn}>Autumn</MenuItem>
                <MenuItem value={PeriodType.winter}>Winter</MenuItem>
                <MenuItem value={PeriodType.spring}>Spring</MenuItem>
              </Select>
            </FormControl> : <DatePicker
              selected={this.state.currentValue?.tripTerms?.startDate}
              minDate={new Date()}
              onChange={this.handleDatesValueChange.bind(this)}
              startDate={this.state.currentValue?.tripTerms?.startDate}
              endDate={this.state.currentValue?.tripTerms?.endDate}
              selectsRange
              locale={SUPPORTED_LOCALES.includes(navigator.language.split('-')[0]) ? navigator.language.split('-')[0] : "en"}
              customInput={<TextField value={this.state.currentValue?.tripTerms?.startDate + ' - ' + this.state.currentValue?.tripTerms?.endDate}
                                      size={"small"}
                                      placeholder={undefined}
                                      style={{width: '100%'}}/>}
            />


            // <LocalizationProvider
            //   dateAdapter={AdapterDayjs}
            //   localeText={{ start: 'Check-in', end: 'Check-out' }}>
            //   <DateRangePicker
            //     className={"search-filter-period-dates"}
            //     value={[this.state.currentValue?.tripTerms?.startDate, this.state.currentValue?.tripTerms?.endDate]}
            //     onChange={this.handleDatesValueChange.bind(this)}
            //     minDate={new Date()}
            //     renderInput={(startProps, endProps) => (
            //       <React.Fragment>
            //         <TextField {...startProps}
            //                    size={"small"}
            //                    className={"date-field"}
            //                    InputProps={{
            //                      sx: {
            //                        "& input": {
            //                          textAlign: "center"
            //                        }
            //                      },
            //                      startAdornment: (
            //                        <InputAdornment position="start">
            //                          <CalendarMonth />
            //                        </InputAdornment>
            //                      ),
            //                    }}>
            //         </TextField>
            //         <Box sx={{ mx: 1 }}></Box>
            //         <TextField {...endProps}
            //                    size={"small"}
            //                    className={"date-field"}
            //                    InputProps={{
            //                      sx: {
            //                        "& input": {
            //                          textAlign: "center"
            //                        }
            //                      },
            //                      startAdornment: (
            //                        <InputAdornment position="start">
            //                          <CalendarMonth />
            //                        </InputAdornment>
            //                      ),
            //                    }}>
            //         </TextField>
            //       </React.Fragment>
            //     )}
            //   />
            // </LocalizationProvider>
            }

          <Link className="search-filter-link" onClick={e => this.handleChangeToPeriodSelect()}>
            { currentPeriodSelectFlag ? "I do not know when" : "Choose specific dates" }
          </Link>
        </div>

        <Autocomplete
          multiple
          size={"small"}
          id="search-filter-tags"
          className={"search-filter-tags"}
          options={this.state.tags}
          value={this.state.tags.filter((t: Tag) => this.state.currentValue?.tags?.tags ? this.state.currentValue?.tags?.tags.includes(t.id) : false)}
          getOptionLabel={(tag: Tag) => tag.name as string}
          onChange={(e, tags) => this.handleTagsChange(tags)}
          renderInput={(params) => (
            <TextField
              {...params}
              variant="outlined"
              label="Tags"
              placeholder="Search"
            />
          )}
        />

        <SearchInput
          size={"small"}
          label="Previous locations"
          multiple={true}
          key={"search-filter-previous-locations"}
          searchFunction={query => this.searchApiService.searchAccommodation(query)}
          onValueChange={value => this.handlePreviousLocationsChange(value)}
          initialOptions={this.state.currentValue.previousLocations?.locations ? this.state.currentValue.previousLocations?.locations : []}
          className={"search-filter-previous-locations"}
          optionComponentGenerator={(props, option) => this.generateLocationOption(props, option as Accommodation)}
          currentValue={this.state.currentValue.previousLocations?.locations}
          startAdornment={<Hotel className={"location-start-icon"}/>}></SearchInput>

        <SearchFilterCompanionsSelect
          className={"search-filter-companions"}
          onValueChange={this.handleCompanionsChange.bind(this)}
          initialValueExtractor={() => this.state.currentValue?.tripTerms}>
        </SearchFilterCompanionsSelect>

        <Button
          className={"search-filter-apply"}
          variant={"contained"}
          size={"small"}
          onClick={this.applyFilter.bind(this)}>Apply</Button>
      </div>
    );
  }

  private applyFilter() {
    this.props.onValueChange(this.state.currentValue);
  }

  private handleCompanionsChange(terms: TripTerms) {
    this.setState({
      currentValue: {
        ...this.state.currentValue,
        tripTerms: terms
      }
    });
  }

  private handleTagsChange(value: Tag[]) {
    const tags = {
      ...this.state.currentValue.tags,
      tags: value.map(t => t.id)
    };

    this.setState({
      currentValue: {
        ...this.state.currentValue,
        tags: tags
      }
    });
  }

  private handleChangeToDestinationSelect() {
    const currentDestinationSelectFlag = this.state.isDestinationSelect;

    const tripDetails = {
      ...this.state.currentValue.tripDetails,
      destination: undefined,
      category: undefined
    };

    this.setState({
      isDestinationSelect: !currentDestinationSelectFlag,
      currentValue: {
        ...this.state.currentValue,
        tripDetails: tripDetails
      }
    });
  }

  private handleChangeToPeriodSelect() {
    const currentPeriodSelectFlag = this.state.isSpecificPeriodSelect;

    const tripTerms = {
      ...this.state.currentValue.tripTerms,
      startDate: undefined,
      endDate: undefined,
      period: undefined
    };

    this.setState({
      isSpecificPeriodSelect: !currentPeriodSelectFlag,
      currentValue: {
        ...this.state.currentValue,
        tripTerms: tripTerms
      }
    });
  }

  private handlePreviousLocationsChange(value: Nameable | null | Nameable[]) {
    const locationsValue = {
      ...this.state.currentValue.previousLocations,
      locations: value
    };

    this.setState({
      currentValue: {
        ...this.state.currentValue,
        previousLocations: locationsValue
      }
    });
  }

  // private getSearchOptionsValue() {
  //   const value = [];
  //   if (this.state.currentValue?.tripDetails?.accommodation === true) {
  //     value.push("Accommodation");
  //   }
  //   if (this.state.currentValue?.tripDetails?.flight === true) {
  //     value.push("Flight");
  //   }
  //   if (this.state.currentValue?.tripDetails?.transfer === true) {
  //     value.push("Transfer");
  //   }
  //   if (this.state.currentValue?.tripDetails?.carRental === true) {
  //     value.push("Car Rental");
  //   }
  //   return value;
  // }

  private handlePurposeChange() {

  }

  private handleDestinationChange(dest: Nameable | Nameable[] | null) {

  }


  private handleAttendanceChange() {

  }

  private handlePeriodChange(value: string) {
    const newValue = {
      ...this.state.currentValue.tripTerms,
      period: value as PeriodType,
    };
    this.setState({
      currentValue: {
        ...this.state.currentValue,
        tripTerms: newValue
      }
    });
  }

  private handleDatesValueChange(dates: [Date | null, Date | null]) {
    const start = dates && dates[0] ? dates[0] : undefined;
    const end = dates && dates[1] ? dates[1] : undefined;

    if (start && end && start > end) {
      return;
    }

    const newValue = {
      ...this.state.currentValue.tripTerms,
      startDate: start,
      endDate: end
    };

    this.setState({
      currentValue: {
        ...this.state.currentValue,
        tripTerms: newValue
      }
    });
  }

  // private handleOptionsChange(value: string[]) {
  //   let typeValue = this.state.currentValue.tripDetails;
  //   typeValue = {
  //     ...typeValue,
  //     accommodation: true
  //   };
  //   typeValue = {
  //     ...typeValue,
  //     flight: value.indexOf("Flight") > -1
  //   };
  //   typeValue = {
  //     ...typeValue,
  //     transfer: value.indexOf("Transfer") > -1
  //   };
  //   typeValue = {
  //     ...typeValue,
  //     carRental: value.indexOf("Car Rental") > -1
  //   };
  //
  //   const newValue = {
  //     ...this.state.currentValue,
  //     tripDetails: typeValue
  //   }
  //   this.setState({
  //     currentValue: newValue
  //   });
  // }

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

export default SearchFilter;
