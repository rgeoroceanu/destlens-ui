import {createTheme} from "@mui/material";
import { enUS, deDE,roRO } from '@mui/material/locale';

export const theme = createTheme({
    palette: {
      primary: {
        main: '#01aac1',
      },
      secondary: {
        main: '#111111'
      }
    },
  },
  enUS, deDE, roRO );

declare module '@mui/material/styles' {

  interface Palette {
    secondary: Palette['secondary'];
  }
}
