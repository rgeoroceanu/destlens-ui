import {createTheme} from "@mui/material";

export const theme = createTheme({
  palette: {
    primary: {
      main: '#01aac1',
    },
    secondary: {
      main: '#111111'
    }
  },
});

declare module '@mui/material/styles' {

  interface Palette {
    secondary: Palette['secondary'];
  }
}
