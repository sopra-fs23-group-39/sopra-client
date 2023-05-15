import React from 'react';
import { Button } from '@mui/material';
import theme from 'styles/mui/customMui';
import { ThemeProvider} from '@mui/material/styles';



export function SecondaryButton ({ label, onClick}) {
  
    return (
      <Button
            sx={{
                margin: 1,
                color: theme.palette.primary.main,
                border: `1px solid ${theme.palette.primary.main}`,
                '&:hover': {
                backgroundColor: theme.palette.primary.light,
                color: theme.palette.primary.contrastText
                },
            }}
        variant="outlined"
        maxWidth="100%"
        onClick={onClick}
        size='small'
      >
        {label}
      </Button>
    );
};

export default SecondaryButton;