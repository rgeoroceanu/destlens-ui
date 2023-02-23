import React, {Component} from 'react';
import './TripTagsStep.css';
import TripTags from "../../../common/model/TripTags";
import TextField from "@mui/material/TextField";
import {Box, Chip} from "@mui/material";
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import SearchApiService from "../../service/SearchApiService";
import Autocomplete from "@mui/material/Autocomplete";
import TagCategory from "../../../common/model/TagCategory";


interface TripTagsStepConfig {
  onValueChange: (value: TripTags) => void,
  initialValueExtractor?: () => TripTags
}

class TripTagsStep extends Component<any, any> {

  private searchApiService = new SearchApiService();

  constructor(props: TripTagsStepConfig) {
    super(props);
    const value = props.initialValueExtractor && props.initialValueExtractor() ? props.initialValueExtractor() : new TripTags();
    this.state = {
      currentValue: value,
      tabIndex: "0"
    }
    this.props.onValueChange(value);
  }

  render() {
    const tagCategories = this.searchApiService.getTagCategories();

    return (
      <div>
        <div className={"title"}>Select keywords</div>
        <div className={"subtitle"}>Select as many tags as you like</div>

        <Autocomplete
          disablePortal
          multiple={true}
          disableClearable={true}
          onChange={(e, values) => this.onTagSelected(values)}
          clearOnBlur={true}
          className={"tags-search"}
          options={tagCategories.map(cat => cat.tags).flat()}
          value={[]}
          renderInput={(params) => <TextField {...params} label="Tags" placeholder="Search" />}
        />

        {this.getCurrentTags()}

        {this.getTagTabs(tagCategories)}

      </div>
    );
  }

  private handleTagCategoryChange(tabIndex: string) {
    this.setState({tabIndex: tabIndex});
  }

  private getCurrentTags() {
    const tags = this.state.currentValue.tags;
    const tagChips = [];
    let i = 0;
    for (const tag of tags) {
      i += 1;
      const chip = <Chip key={"valueTag" + i } className="tag" label={tag} variant="outlined" onDelete={() => this.onRemoveTag(tag)} />;
      tagChips.push(chip);
    }

    return <div className={"tags-wrapper"}>
      {tagChips}
    </div>
  }

  private onTagSelected(tags: string[]) {
    tags.forEach(tag => this.onAddTag(tag));
  }

  private onRemoveTag(tag: string) {
    const selectedTags = this.state.currentValue.tags;
    selectedTags.delete(tag);
    const newValue = {
      ...this.state.currentValue,
      tags: selectedTags
    };
    this.setState({
      currentValue: newValue
    });
    this.props.onValueChange(newValue);
  }

  private onAddTag(tag: string) {
    const selectedTags = this.state.currentValue.tags;
    selectedTags.add(tag);

    console.log(selectedTags)

    const newValue = {
      ...this.state.currentValue,
      tags: selectedTags
    };
    this.setState({
      currentValue: newValue
    });
    this.props.onValueChange(newValue);
  }

  private getTagTabs(tagCategories: TagCategory[]) {
    const tabs = [];
    const tabPanels = [];
    for (let i = 0; i < tagCategories.length; i++) {
      const category = tagCategories[i];
      const tab = <Tab key={"tab" + i} label={category.name} value={'' + i} />;
      tabs.push(tab);

      const tags = [];
      for (let j = 0; j < category.tags.length; j++) {
        const tag = category.tags[j];

        if (this.state.currentValue.tags.has(tag)) {
          continue;
        }

        const tagComponent = <Chip className="tag"
                                   key={"optionTag" + i + '-' + j }
                                   label={tag}
                                   variant="outlined" onClick={() => this.onAddTag(tag)} />;
        tags.push(tagComponent);
      }

      const tabPanel =  <TabPanel key={"tabPanel" + i } value={'' + i}>
        <div className={"tags-wrapper"}>
          {tags}
        </div>
      </TabPanel>;

      tabPanels.push(tabPanel);
    }

    return (
      <TabContext value={this.state.tabIndex}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TabList onChange={(e, value) => this.handleTagCategoryChange(value)} aria-label="TagCategory categories">
            {tabs}
          </TabList>
        </Box>
        {tabPanels}
      </TabContext>
    );
  }
}

export default TripTagsStep;
