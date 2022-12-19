import React, {Component} from 'react';
import './FinalStep.css';
import {Button} from "@mui/material";
import {PlayCircle} from "@mui/icons-material";


interface FinalStepConfig {
  onStartSearch: () => void
}

class FinalStep extends Component<any, any> {

  constructor(props: FinalStepConfig) {
    super(props);
    this.state = {
      onStartSearch: props.onStartSearch
    };
  }

  render() {
    return (
      <div className={"final-step-container"}>
        <div className={"title"}>Start search</div>
        <div className={"subtitle"}>Press start and we will search the best matches for you.</div>
        <Button
          className={"final-step-button"}
          variant="contained"
          onClick={this.state.onStartSearch}
          color={"primary"}
          startIcon={<PlayCircle />}>
          Start search
        </Button>
      </div>
    );
  }
}

export default FinalStep;
