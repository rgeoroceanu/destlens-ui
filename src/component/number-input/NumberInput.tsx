import React from "react";
import './NumberInput.css'
import {FormControl, IconButton, OutlinedInput} from "@mui/material";
import {Add, Remove} from "@mui/icons-material";

interface NumberInputConfig {
  defaultValue: number;
  onValueChange: (event: number) => void;
  max?: number;
}

function NumberInput(config: NumberInputConfig) {
  const [value, setValue] = React.useState<number>(config.defaultValue);
  const onValueChange = (value: number) => {
    setValue(value);
    config.onValueChange(value);
  };
  const onHandleIncrement = () => {
    const newValue = Math.min(value + 1, config.max ? config.max : 100);
    onValueChange(newValue);
  };
  const onHandleDecrement = () => {
    const newValue = Math.max(value - 1, 0);
    onValueChange(newValue);
  };

  return (
    <div className={"number-input-container"}>
      <IconButton key="remove" className="number-input-button" color="secondary" aria-label="remove" onClick={onHandleDecrement}>
        <Remove className={"number-input-button-icon"}/>
      </IconButton>
      <FormControl className="number-input-field" sx={{ m: 1 }} variant="outlined">
        <OutlinedInput
          onKeyPress={(event) => {
            if (!/[0-9]/.test(event.key)) {
              event.preventDefault();
            }
          }}
          size="small"
          id="number-input-value"
          value={value}
          datatype={"number"}
          onChange={e => onValueChange(+e.target.value)}
          inputProps={{
            'aria-label': 'weight',
            style: {textAlign: "center"}
          }}
        />
      </FormControl>
      <IconButton key="add" className="number-input-button" color="secondary" aria-label="add" size={"small"} onClick={onHandleIncrement}>
        <Add className={"number-input-button-icon"}/>
      </IconButton>
    </div>
  );
}

export default NumberInput;
