import { createTheme } from '@mui/material/styles';
import * as colors from '@mui/material/colors';


const theme = createTheme({
  palette: {
    primary: {
      light: colors.yellow[300],
      main: colors.yellow[500],
      dark: colors.orange[500],
      contrastText: '#000',
    },
    secondary: {
      light: colors.blue[400],
      main: colors.blue[500],
      dark: colors.blue[900],
      contrastText: '#fff',
      text: '#000',
    },
    tertiary: {
      light:'#000',
      main: '#000',
      dark: '#000',
      contrastText: '#fff',
      text: '#fff',
    },
  },
});

export default theme;
