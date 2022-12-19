import {LinearProgress, linearProgressClasses, styled} from "@mui/material";
import React from "react";

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 3,
  borderRadius: 3,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor: 'transparent',
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 3,
    backgroundColor: theme.palette.primary,
  },
}));

interface ProgressValue {
  value: number;
}

function Progress({value}: ProgressValue) {
  return (
    <BorderLinearProgress variant="determinate" value={value} />
  );
}

export default Progress;

