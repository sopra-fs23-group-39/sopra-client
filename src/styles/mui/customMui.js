import { createTheme } from '@mui/material/styles';
import * as colors from '@mui/material/colors';


const theme = createTheme({
  palette: {
    primary: {
      light: colors.yellow[400],
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
  /*components: {
    MuiButton: {
      styleOverrides: {
        root: {
          '--button-color': (props) => props.theme.palette.primary.main,
          '--button-background': (props) => props.theme.palette.secondary.main,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '--input-color': (props) => props.theme.palette.primary.main,
          '--input-background': (props) => props.theme.palette.secondary.main,
        },
      },
    },
  },*/
});

export default theme;
