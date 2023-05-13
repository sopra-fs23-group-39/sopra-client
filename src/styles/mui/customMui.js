import { Box } from '@mui/material';
import './Box.scss';
import { createTheme} from '@mui/material/styles';
import * as colors from '@mui/material/colors';


export const CustomBox = ({ children, ...props }) => (
  <Box className="box custom" {...props}>
    {children}
  </Box>
);

export const CustomContainer = ({ children, ...props }) => (
    <Box className="box" {...props}>
      {children}
    </Box>
  );



  const theme = createTheme({
    palette: {
      primary: {
        light: colors.yellow[400],
        main: colors.yellow[500],
        dark: colors.orange,
        contrastText: "#000" ,
      },
      secondary: {
        light: colors.blue[400],
        main: colors.blue[500],
        dark: colors.blue[900],
        contrastText: '#000',
      },
    },
  });

export {theme};

