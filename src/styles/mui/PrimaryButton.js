import React from 'react';
import {Box, Button } from '@mui/material';
import theme from 'styles/mui/customMui';
import { ThemeProvider} from '@mui/material/styles';

export function PrimaryButton ({ label, onClick, disabled }) {

    return (
        <ThemeProvider theme={theme}>
          <Box sx={{width: '100%', display: 'flex', justifyContent: 'center' }}>
            <Button
              sx={{
                margin: 1,
                minHeight: "40%",
                minWidth: "30%",
                color: theme.palette.primary.text,
                backgroundColor: theme.palette.primary.main,
                "&:disabled": { 
                  color: theme.palette.primary.text,
                  backgroundColor: theme.palette.primary.main,
                  opacity: 0.5
                },
              }}
              onClick={onClick}
              disabled={disabled}
              variant='contained'
            >
              {label}
            </Button>
          </Box>
        </ThemeProvider>
    );
};

/*<Button
            sx={{
              margin: 1,
              color: theme.palette.primary.text
            }}
            width="100%"
            onClick={() => doLogin()}
            variant='contained'
          >
            Login
          </Button>*/
  
/*export const SecondaryButton = ({ label, onClick, sx }) => {
  
    return (
      <Button
        sx={{
          margin: 1,
          color: theme.palette.primary.main,
          borderColor: theme.palette.primary.main,
          '&:hover': {
            backgroundColor: theme.palette.primary.light,
          },
          ...sx // merge any custom styles passed to the component
        }}
        variant="outlined"
        maxWidth="100%"
        onClick={onClick}
        size='small'
      >
        {label}
      </Button>
    );
};  */

export default PrimaryButton;
