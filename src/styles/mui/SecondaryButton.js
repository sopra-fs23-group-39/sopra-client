import React from 'react';
import { Box, Button } from '@mui/material';
import theme from 'styles/mui/customMui';
import { ThemeProvider} from '@mui/material/styles';



export function SecondaryButton ({ label, onClick}) {
  
  return (
  <ThemeProvider theme={theme}>
    <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
      <Button
        sx={{
          margin: 1,
          minHeight: "30%",
          minWidth: "25%",
          color: theme.palette.primary.main,
          border: `1px solid ${theme.palette.primary.main}`,
          '&:hover': {
          backgroundColor: theme.palette.primary.light,
          color: theme.palette.primary.contrastText
          },
        }}
        variant="outlined"
        onClick={onClick}
        size='small'
      >
        {label}
      </Button>
    </Box>
  </ThemeProvider>
  );
}

export default SecondaryButton;