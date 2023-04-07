import React, {Component, ReactElement} from 'react';
import './SearchFilter.css';
import {Box, Button, FormControl, InputLabel, Link, MenuItem, Select} from "@mui/material";
import TripSearch from "../../model/TripSearch";
import TripType from "../../model/TripType";
import PeriodType from "../../model/PeriodType";
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
import Tag from "../../model/Tag";
import DatePicker from "react-datepicker";
import {SUPPORTED_LOCALES} from "../../App";
import CompanionsSelect from "../companions-select/CompanionsSelect";
import DurationType from "../../model/DurationType";

interface SearchFilterConfig {
  onValueChange: (value: TripSearch) => void,
  initialValueExtractor?: () => TripSearch
}

class SearchFilter extends Component<any, any> {

  private searchApiService = new SearchApiService();
  private companionsWrapperRef: React.RefObject<any> | undefined ;

  constructor(props: SearchFilterConfig) {
    super(props);
    const value = props.initialValueExtractor && props.initialValueExtractor() ? props.initialValueExtractor() : new TripSearch();
    this.state = {
      currentValue: value,
      isDestinationSelect: value.tripDetails.destination !== undefined,
      isSpecificPeriodSelect: value.tripTerms.period === undefined,
      companionsSelectOpen: false,
      tags: []
    };
    this.companionsWrapperRef = React.createRef();
  }

  componentDidMount() {
    document.addEventListener("mousedown", this.handleClickOutside.bind(this));
    this.searchApiService.getAllTags()
      .then(tags => this.setState({tags: tags}));
  }
  componentWillUnmount() {
    document.removeEventListener("mousedown", this.handleClickOutside.bind(this));
  }

  handleClickOutside(event: { target: any }) {
    if (this.state.companionsSelectOpen && this.companionsWrapperRef && !this.companionsWrapperRef.current.contains(event.target)) {
      this.setState({companionsSelectOpen: false});
    }
  }

  render() {
    const currentDestinationSelectFlag = this.state.isDestinationSelect;
    const currentPeriodSelectFlag = this.state.isSpecificPeriodSelect;
    const companionsSelectOpen = this.state.companionsSelectOpen;

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
                onChange={(e, r) => this.handlePurposeChange(e.target.value)}>
                <MenuItem value={TripType.beach}>Beach</MenuItem>
                <MenuItem value={TripType.city}>City</MenuItem>
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

        <div className={"search-filter-period-wrapper"}>
          { !currentPeriodSelectFlag ?
            <div className={"search-filter-period-unknown-wrapper"}>
              <FormControl fullWidth size="small">
                <InputLabel id="search-filter-duration-label">Duration</InputLabel>
                <Select
                  id="search-filter-duration"
                  labelId="search-filter-duration-label"
                  value={this.state.currentValue?.tripTerms?.duration}
                  label="Duration"
                  onChange={(e, r) => this.handleDurationChange(e.target.value as string)}>
                  <MenuItem value={DurationType.weekend}>Over the eekend</MenuItem>
                  <MenuItem value={DurationType.week}>One week</MenuItem>
                  <MenuItem value={DurationType.month}>Whole month</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth size="small">
                <InputLabel id="search-filter-period-label">Period</InputLabel>
                <Select
                  id="search-filter-period"
                  labelId="search-filter-period-label"
                  value={this.state.currentValue?.tripTerms?.period}
                  label="Period"
                  onChange={(e, r) => this.handlePeriodChange(e.target.value as string)}>
                  <MenuItem value={PeriodType.summer}>Summer</MenuItem>
                  <MenuItem value={PeriodType.fall}>Fall</MenuItem>
                  <MenuItem value={PeriodType.winter}>Winter</MenuItem>
                  <MenuItem value={PeriodType.spring}>Spring</MenuItem>
                </Select>
              </FormControl>
            </div> : <DatePicker
              selected={this.state.currentValue?.tripTerms?.startDate}
              minDate={new Date()}
              onChange={this.handleDatesValueChange.bind(this)}
              startDate={this.state.currentValue?.tripTerms?.startDate}
              endDate={this.state.currentValue?.tripTerms?.endDate}
              selectsRange
              locale={SUPPORTED_LOCALES.includes(navigator.language.split('-')[0]) ? navigator.language.split('-')[0] : "en"}
              customInput={<TextField value={this.state.currentValue?.tripTerms?.startDate + ' - ' + this.state.currentValue?.tripTerms?.endDate}
                                      size={"small"}
                                      label={"Dates"}
                                      placeholder={undefined}
                                      style={{width: '100%'}}/>}
            />
          }

          <Link className="search-filter-link" onClick={e => this.handleChangeToPeriodSelect()}>
            { currentPeriodSelectFlag ? "I do not know when" : "Choose specific dates" }
          </Link>
        </div>

        <div className={"search-filter-companions-wrapper"} ref={this.companionsWrapperRef}>
          <TextField
            size={"small"}
            className={"search-filter-companions"}
            label={"Companions"}
            value={this.getCompanionsDisplay(this.state.currentValue?.tripTerms)}
            onClick={e => this.setState({ companionsSelectOpen: true})}></TextField>
          { companionsSelectOpen ? <CompanionsSelect
              className="search-filter-companions-select"
              initialValueExtractor={() => this.state.currentValue.tripTerms}
              onValueChange={(v: TripTerms) => this.handleCompanionsChange(v as TripTerms)}>
            </CompanionsSelect> : null }
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

        <Button
          className={"search-filter-apply"}
          variant={"contained"}
          size={"small"}
          onClick={this.applyFilter.bind(this)}>Apply</Button>
      </div>
    );
  }

  private getCompanionsDisplay(value: TripTerms) {
    return value ? value.adults + ' adults, ' + value.children + ' children': '';
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

  private handlePurposeChange(category: TripType) {
    const newValue = {
      ...this.state.currentValue.tripDetails,
      category: category,
    };
    this.setState({
      currentValue: {
        ...this.state.currentValue,
        tripDetails: newValue
      }
    });
  }

  private handleDestinationChange(dest: Nameable | Nameable[] | null) {
    const newValue = {
      ...this.state.currentValue.tripDetails,
      destination: dest,
    };
    this.setState({
      currentValue: {
        ...this.state.currentValue,
        tripDetails: newValue
      }
    });
  }

  private handlePeriodChange(value: string) {
    const newValue = {
      ...this.state.currentValue.tripTerms,
      period: value as PeriodType,
      startDate: undefined,
      endDate: undefined
    };
    this.setState({
      currentValue: {
        ...this.state.currentValue,
        tripTerms: newValue
      }
    });
  }

  private handleDurationChange(value: string) {
    const newValue = {
      ...this.state.currentValue.tripTerms,
      duration: value as DurationType,
      startDate: undefined,
      endDate: undefined
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
      endDate: end,
      period: undefined,
      duration: undefined
    };

    this.setState({
      currentValue: {
        ...this.state.currentValue,
        tripTerms: newValue
      }
    });
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
