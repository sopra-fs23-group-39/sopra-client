import React from 'react';
import { Button } from '@mui/material';
import theme from 'styles/mui/customMui';
import { ThemeProvider} from '@mui/material/styles';

export function PrimaryButton ({ label, onClick }) {

  return (
    <ThemeProvider theme={theme}>
      <Button
        sx={{
          margin: 1,
          minHeight:40,
          maxHeight:40,
          color: theme.palette.primary.text,
          backgroundColor: theme.palette.primary.main
        }}
        width="100%"
        onClick={onClick}
        variant='contained'
      >
        {label}
      </Button>
    </ThemeProvider>
  );
}

export default PrimaryButton;
