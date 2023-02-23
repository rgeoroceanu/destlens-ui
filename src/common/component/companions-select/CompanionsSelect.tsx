import React, {Component} from 'react';
import './CompanionsSelect.css';
import TripTerms from "../../model/TripTerms";
import {Button, Chip, FormControl, InputLabel, MenuItem, Select} from "@mui/material";
import {Add} from "@mui/icons-material";

interface CompanionsSelectConfig {
  onValueChange: (value: TripTerms) => void,
  initialValueExtractor?: () => TripTerms
}

class CompanionsSelect extends Component<any, any> {

  constructor(props: CompanionsSelectConfig) {
    super(props);
    const initialValue = props.initialValueExtractor ? props.initialValueExtractor() : null
    this.state = {
      currentValue: initialValue,
      isAddChildAge: false
    }
    this.props.onValueChange(initialValue);
  }

  render() {
    return (
      <div className={"companions-select-wrapper"}>
        <FormControl className={"companions-select-adults"}>
          <InputLabel id="companions-select-adults-label">Adults</InputLabel>
          <Select
            size={"small"}
            id="companions-select-adults"
            labelId="companions-select-adults-label"
            value={this.state.currentValue?.adults}
            label="Adults"
            onChange={(e) => this.handleAdultsValueChange(e.target.value)}>
            {this.getAdultOptions()}
          </Select>
        </FormControl>

        <FormControl className={"companions-select-rooms"}>
          <InputLabel id="companions-select-rooms-label">Rooms</InputLabel>
          <Select
            size={"small"}
            id="companions-select-rooms"
            labelId="companions-select-rooms-label"
            value={this.state.currentValue?.rooms}
            label="Rooms"
            onChange={(e) => this.handleRoomsValueChange(e.target.value)}>
            {this.getRoomOptions()}
          </Select>
        </FormControl>

        {this.getChildrenValue()}

        { this.state.isAddChildAge ? <FormControl className={"companions-select-children"}>
          <InputLabel id="companions-select-child-age-label">Age</InputLabel>
          <div className={"companions-select-child-age-wrapper"}>
            <Select
              size={"small"}
              id="companions-select-child-age"
              labelId="companions-select-child-age-label"
              label="Age"
              value={1}
              onChange={(e) => this.handleChildAgeValueSelect(e.target.value)}>
              {this.getChildAgeOptions()}
            </Select>
          </div>
        </FormControl>  : <Button variant={"outlined"}
                                  className={"companion-select-add-child"}
                                  aria-label="companion-select-add-child"
                                  color={"primary"}
                                  size="small"
                                  onClick={e => this.onChildAdd()}>
          <div style={{fontSize: 10, lineHeight: "10px", display: "flex", flexDirection: "column", alignItems: "center"}}>
            <Add fontSize="small" />
            <span>Child</span>
          </div>

        </Button> }
      </div>
    );
  }

  private getAdultOptions() {
    const adults = [];
    for (let i=0;i<15;i++) {
      const adult = <MenuItem key={"adult" + i }value={i + 1}>{i + 1}</MenuItem>;
      adults.push(adult);
    }
    return adults;
  }

  private getRoomOptions() {
    const rooms = [];
    for (let i=0;i<10;i++) {
      const room = <MenuItem key={"room" + i } value={i + 1}>{i + 1}</MenuItem>;
      rooms.push(room);
    }
    return rooms;
  }

  private getChildrenValue() {
    const children = this.state.currentValue?.childrenAges ? this.state.currentValue?.childrenAges : [];
    const childrenChips = [];
    for (let i=0;i<children.length;i++) {
      const age = children[i];
      const chip = <Chip key={"child" + i } className="child-tag" label={age} variant="outlined" onDelete={() => this.onRemoveChild(age)} />;
      childrenChips.push(chip);
    }
    return childrenChips;
  }

  private getChildAgeOptions() {
    const ages = [];
    for (let i=0;i<19;i++) {
      const age = <MenuItem key={"age" + i }value={i}>{i}</MenuItem>;
      ages.push(age);
    }
    return ages;
  }

  private onChildAdd() {
    this.setState({ isAddChildAge: true});
  }

  private onRemoveChild(childAge: number) {
    const children = this.state.currentValue?.children ?  this.state.currentValue.children -1 : 0;
    const childrenAges = this.state.currentValue?.childrenAges ? this.state.currentValue.childrenAges : [];
    const index = childrenAges.indexOf(childAge);
    childrenAges.splice(index, 1);

    this.setState({
      currentValue: {
        ...this.state.currentValue,
        children: children,
        childrenAges: childrenAges
      }
    });
  }

  private handleChildAgeValueSelect(age: unknown) {
    const children = this.state.currentValue?.children ?  this.state.currentValue.children + 1 : 1;
    const childrenAges = this.state.currentValue?.childrenAges ? this.state.currentValue.childrenAges : [];
    childrenAges.push(age);

    this.setState({
      isAddChildAge: false,
      currentValue: {
        ...this.state.currentValue,
        children: children,
        childrenAges: childrenAges
      }
    });
  }

  private handleAdultsValueChange(adults: number) {

  }

  private handleRoomsValueChange(rooms: number) {

  }
}

export default CompanionsSelect;
