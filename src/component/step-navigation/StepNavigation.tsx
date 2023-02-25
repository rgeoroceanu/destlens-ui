import React from "react";
import {Button, IconButton} from "@mui/material";
import {ArrowBack, ArrowForward} from "@mui/icons-material";
import './StepNavigation.css';
import {OverridableStringUnion} from "@mui/types";
import {ButtonPropsColorOverrides} from "@mui/material/Button/Button";

interface StepNavigationRoutes {
  onNext: any,
  onPrevious: any,
  previousButtonVisible: boolean,
  nextButtonVisible: boolean,
  nextButtonEnabled: boolean,
  nextButtonLabel: string,
  nextButtonColor: OverridableStringUnion<'inherit' | 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning', ButtonPropsColorOverrides>
}

function StepNavigation({onPrevious, onNext, previousButtonVisible = true, nextButtonVisible = false,
                          nextButtonEnabled = false, nextButtonLabel = 'Next', nextButtonColor = "primary"}: StepNavigationRoutes) {
  return (
    <div className={"navigation-wrapper"}>
      {previousButtonVisible ?
          <IconButton className={"navigation-back"} color={"secondary"} onClick={onPrevious}>
            <ArrowBack />
          </IconButton> : <div className={"navigation-back"}></div> }
      {
        nextButtonVisible ? <Button
          disabled={!nextButtonEnabled}
          className="navigation-next"
          variant="contained"
          color={nextButtonColor}
          endIcon={<ArrowForward />}
          onClick={onNext}>
          {nextButtonLabel}
        </Button> : <div className={"navigation-next"}></div>
      }

    </div>
  );
}

export default StepNavigation;
