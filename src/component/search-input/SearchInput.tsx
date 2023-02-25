import * as React from 'react';
import {ReactElement, useCallback} from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';
import './SearchInput.css';
import Nameable from "../../model/Nameable";
import {Box, debounce} from "@mui/material";

interface SearchInputConfig {
  searchFunction: (query: string) => Promise<Nameable[]>;
  onValueChange: (value: Nameable | null | Nameable[]) => void;
  className: string;
  currentValue: Nameable | null | Nameable[];
  initialOptions?: Nameable[];
  optionComponentGenerator?: ((props: any, option: Nameable | undefined) => ReactElement) | undefined;
  startAdornment?: ReactElement;
  multiple?: boolean;
  size?: "medium" | "small" | undefined;
  label?: string;
}

export const searchAsync = (query: string, searchFunction: any): Promise<Nameable[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(
        searchFunction(query)
      );
    }, 1000);
  });
};

function SearchInput({searchFunction, className = '', onValueChange, currentValue = null, initialOptions = [],
                       optionComponentGenerator, startAdornment, multiple = false, size = "medium", label = "Search"}: SearchInputConfig) {

  const defaultValue = currentValue === null ? (multiple ? [] : {name: ''}) : currentValue;
  const [options, setOptions] = React.useState<readonly Nameable[]>(initialOptions);
  const [value, setValue] = React.useState<Nameable | null | Nameable[]>(defaultValue);
  const [searchQuery, setSearchQuery] = React.useState<string>("");
  const [loading, setLoading] = React.useState<boolean>(false);

  const getOptionsDelayed = useCallback(
    debounce((query: string, callback: (options: Nameable[]) => void) => {
      setOptions([]);
      searchAsync(query, searchFunction)
        .then(callback)
        .catch(e => console.log(e));
    }, 500),
    []
  );

 React.useEffect(() => {
   if (!searchQuery || searchQuery.length < 2) {
     return;
   }

   const alreadyContained = (multiple === true && value ? (value as Nameable[]).map(v => v.name).includes(searchQuery) : searchQuery === (value as Nameable)?.name);
   if (alreadyContained) {
     return;
   }

    setLoading(true);

    getOptionsDelayed(searchQuery, (options: Nameable[]) => {
      setOptions(options);
      setLoading(false);
    });
  }, [searchQuery, getOptionsDelayed]);

  const onChange = (event: unknown, value: Nameable | null | Nameable[]) => {
    setValue(value);
    onValueChange(value);
  };

  const onInputChange = (event: unknown, value: string) => {
    setSearchQuery(value);
  };

  const renderOption = (generator: ((props: any, option: Nameable | undefined) => (React.ReactElement | undefined)) | undefined, props: any, option: Nameable | undefined) => {
    if (generator) {
      return generator(props, option);
    } else {
      return (<Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>{option?.name}</Box>);
    }
  }

  const filterOptions = (options: Nameable[]): Nameable[] => options;

  return (
    <Autocomplete className={"search-input " + className}
                  size={size}
                  id="search-input"
                  sx={{ width: 300 }}
                  multiple={multiple}
                  popupIcon={""}
                  filterOptions={filterOptions}
                  onInputChange={onInputChange}
                  value={value}
                  blurOnSelect={true}
                  onChange={onChange}
                  isOptionEqualToValue={(option, value) => option.name === value.name}
                  getOptionLabel={(option) => option.name}
                  options={options}
                  loading={loading}
                  autoHighlight
                  renderOption={(props, option) => renderOption(optionComponentGenerator, props, option)}
                  renderInput={(params) => (
                    <TextField
                      variant={"outlined"}
                      className={"search-input-text"}
                      {...params}
                      label={label}
                      InputProps={{
                        ...params.InputProps,
                        startAdornment: (
                          <React.Fragment>
                            {startAdornment ? startAdornment : null}
                            {params.InputProps.startAdornment}
                          </React.Fragment>
                        ),
                        endAdornment: (
                          <React.Fragment>
                            {loading ? <CircularProgress color="inherit" size={20} /> : null}
                            {params.InputProps.endAdornment}
                          </React.Fragment>
                        ),
                      }}
                    />
                  )}
    />
  );
}

export default SearchInput;