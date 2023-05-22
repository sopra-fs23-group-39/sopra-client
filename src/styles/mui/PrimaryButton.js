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
}

export default PrimaryButton;
