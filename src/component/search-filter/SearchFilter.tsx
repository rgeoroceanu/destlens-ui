import React, {Component, ReactElement} from 'react';
import './SearchFilter.css';
import {Box, Button, FormControl, InputLabel, Link, MenuItem, Select} from "@mui/material";
import TripSearch from "../../model/TripSearch";
import TripType from "../../model/TripType";
import PeriodType from "../../model/PeriodType";
import TripCompanions from "../../model/TripCompanions";
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
import {withTranslation} from "react-i18next";
import DateHelper from "../../helper/DateHelper";

class SearchFilter extends Component<any, any> {

  private searchApiService = new SearchApiService();
  private readonly companionsWrapperRef: React.RefObject<any> | undefined ;

  constructor(props: any) {
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
    const {t} = this.props;
    const currentTags = this.state.currentValue?.tags?.tags;
    const dateLocale = SUPPORTED_LOCALES.includes(navigator.language.split('-')[0]) ? navigator.language : "en-US";

    return (
      <div className={"search-filter-wrapper"}>
        <div className={"search-filter-type-wrapper"}>
          { !currentDestinationSelectFlag ?
            <FormControl fullWidth size="small">
              <InputLabel id="search-filter-purpose-label">{t('search.filter.purpose')}</InputLabel>
              <Select
                id="search-filter-purpose"
                labelId="search-filter-purpose-label"
                value={this.state.currentValue?.tripDetails?.category}
                label={t('search.filter.purpose')}
                onChange={(e, r) => this.handlePurposeChange(e.target.value)}>
                <MenuItem value={TripType.beach}>{t('type.tripType.BEACH')}</MenuItem>
                <MenuItem value={TripType.city}>{t('type.tripType.CITY')}</MenuItem>
                <MenuItem value={TripType.sightseeing}>{t('type.tripType.SIGHTSEEING')}</MenuItem>
                <MenuItem value={TripType.mountain}>{t('type.tripType.MOUNTAIN')}</MenuItem>
                <MenuItem value={TripType.ski}>{t('type.tripType.SKI')}</MenuItem>
              </Select>
            </FormControl> : <SearchInput
              size={"small"}
              label={t('search.filter.destination')}
              searchFunction={query => this.searchApiService.searchDestination(query)}
              onValueChange={dest => this.handleDestinationChange(dest)}
              currentValue={this.state.currentValue?.tripDetails?.destination}
              initialOptions={this.state.currentValue?.destination ? [this.state.currentValue.destination] : []}
              optionComponentGenerator={(props, option) => this.generateDestinationOption(props, option as Destination)}
              className={'destination'}
              startAdornment={<NearMe className={"destination-value-icon"}/>}/>}

          <Link className="search-filter-link" onClick={e => this.handleChangeToDestinationSelect()}>
            { currentDestinationSelectFlag ? t('search.filter.destinationKnown.no') : t('search.filter.destinationKnown.yes')  }
          </Link>
        </div>

        <div className={"search-filter-period-wrapper"}>
          { !currentPeriodSelectFlag ?
            <div className={"search-filter-period-unknown-wrapper"}>
              <FormControl fullWidth size="small">
                <InputLabel id="search-filter-duration-label">{t('search.filter.duration')}</InputLabel>
                <Select
                  id="search-filter-duration"
                  labelId="search-filter-duration-label"
                  value={this.state.currentValue?.tripTerms?.duration}
                  label={t('search.filter.duration')}
                  onChange={(e, r) => this.handleDurationChange(e.target.value as string)}>
                  <MenuItem value={DurationType.weekend}>{t('type.durationType.WEEKEND')}</MenuItem>
                  <MenuItem value={DurationType.week}>{t('type.durationType.WEEK')}</MenuItem>
                  <MenuItem value={DurationType.month}>{t('type.durationType.MONTH')}</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth size="small">
                <InputLabel id="search-filter-period-label">{t('search.filter.period')}</InputLabel>
                <Select
                  id="search-filter-period"
                  labelId="search-filter-period-label"
                  value={this.state.currentValue?.tripTerms?.period}
                  label={t('search.filter.period')}
                  onChange={(e, r) => this.handlePeriodChange(e.target.value as string)}>
                  <MenuItem value={PeriodType.summer}>{t('type.periodType.SUMMER')}</MenuItem>
                  <MenuItem value={PeriodType.fall}>{t('type.periodType.FALL')}</MenuItem>
                  <MenuItem value={PeriodType.winter}>{t('type.periodType.WINTER')}</MenuItem>
                  <MenuItem value={PeriodType.spring}>{t('type.periodType.SPRING')}</MenuItem>
                </Select>
              </FormControl>
            </div> : <DatePicker
              selected={this.state.currentValue?.tripTerms?.startDate}
              minDate={new Date()}
              onChange={this.handleDatesValueChange.bind(this)}
              startDate={this.state.currentValue?.tripTerms?.startDate}
              endDate={this.state.currentValue?.tripTerms?.endDate}
              dateFormat={DateHelper.getDateFormatString(dateLocale)}
              selectsRange
              locale={SUPPORTED_LOCALES.includes(navigator.language.split('-')[0]) ? navigator.language.split('-')[0] : "en"}
              customInput={<TextField size={"small"}
                                      label={t('search.filter.dates')}
                                      placeholder={undefined}
                                      style={{width: '100%'}}/>}
            />
          }

          <Link className="search-filter-link" onClick={e => this.handleChangeToPeriodSelect()}>
            { currentPeriodSelectFlag ? t("search.filter.periodKnown.no") : t("search.filter.periodKnown.yes") }
          </Link>
        </div>

        <div className={"search-filter-companions-wrapper"} ref={this.companionsWrapperRef}>
          <TextField
            size={"small"}
            className={"search-filter-companions"}
            label={t("search.filter.companions")}
            value={this.getCompanionsDisplay(this.state.currentValue?.tripTerms)}
            onClick={e => this.setState({ companionsSelectOpen: true})}></TextField>
          { companionsSelectOpen ? <CompanionsSelect
              className="search-filter-companions-select"
              initialValueExtractor={() => this.state.currentValue.tripTerms}
              onValueChange={(v: TripCompanions) => this.handleCompanionsChange(v as TripCompanions)}>
            </CompanionsSelect> : null }
        </div>

        <Autocomplete
          multiple
          size={"small"}
          id="search-filter-tags"
          className={"search-filter-tags"}
          options={this.state.tags}
          value={this.state.tags.filter((t: Tag) => !!currentTags && typeof currentTags === "object" && currentTags.hasOwnProperty("length") && typeof currentTags.length === "number" && currentTags.length > 0 ? this.state.currentValue?.tags?.tags.includes(t.id) : false)}
          getOptionLabel={(tag: Tag) => tag.name as string}
          onChange={(e, tags) => this.handleTagsChange(tags)}
          renderInput={(params) => (
            <TextField
              {...params}
              variant="outlined"
              label={t("search.filter.tags")}
              placeholder={t("general.search")}
            />
          )}
        />

        <SearchInput
          size={"small"}
          label={t("search.filter.previousLocations")}
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

  private getCompanionsDisplay(value: TripCompanions) {
    return value ? value.adults + ' ' + this.props.t('companions.adults') + ', ' + value.children + ' ' + this.props.t('companions.children') : '';
  }

  private applyFilter() {
    this.props.onValueChange(this.state.currentValue);
  }

  private handleCompanionsChange(terms: TripCompanions) {
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

export default withTranslation()(SearchFilter);
