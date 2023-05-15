import * as React from 'react';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Grow from '@mui/material/Grow';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import { ThemeProvider } from '@mui/material/styles';
import theme from 'styles/mui/customMui';

export function SplitButton({ options, handleClick }) {
  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef(null);
  const [selectedIndex, setSelectedIndex] = React.useState(0);

  const handleMenuItemClick = (event, index) => {
    setSelectedIndex(index);
    setOpen(false);
    handleClick(options[index]);
  };

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }

    setOpen(false);
  };

  /*const handleClose = (event) => {
    const path = event.composedPath();
    if (
      anchorRef.current &&
      anchorRef.current.contains(event.target) &&
      path.every((el) => !el.classList?.contains?.('MuiMenuItem-root'))
    ) {
      setOpen(false);
    }
  };*/

  const selectedOption = options[selectedIndex];

  return (
    <ThemeProvider theme={theme}>
        <React.Fragment>
        <ButtonGroup 
                variant="contained" 
                ref={anchorRef} 
                aria-label="split button" 
                sx={{
                margin: 2,
                color: theme.palette.primary.text,
                backgroundColor: theme.palette.primary.main,
                minWidth: 180,
                maxWidth: 180
                }}>
            <Button 
                //onClick={() => handleClick(selectedOption)}
                sx={{ 
                    width: '100%',
                    borderRadius: '4px 0 0 4px',
                    '& span': {
                    pointerEvents: 'none',
                  }, 
                }}>
                    {selectedOption}
            </Button>
            <Button
            size="small"
            aria-controls={open ? 'split-button-menu' : undefined}
            aria-expanded={open ? 'true' : undefined}
            aria-label="select merge strategy"
            aria-haspopup="menu"
            onClick={handleToggle}
            sx={{ borderRadius: '0 4px 4px 0' }}
            >
            <ArrowDropDownIcon sx={{ fontSize: '1rem' }} />
            </Button>
        </ButtonGroup>
        <Popper
            sx={{
            zIndex: 1,
            }}
            open={open}
            anchorEl={anchorRef.current}
            role={undefined}
            transition
            disablePortal
        >
            {({ TransitionProps, placement }) => (
            <Grow
                {...TransitionProps}
                style={{
                transformOrigin:
                    placement === 'bottom' ? 'center top' : 'center bottom',
                }}
            >
                <Paper>
                <ClickAwayListener onClickAway={handleClose}>
                    <MenuList id="split-button-menu" autoFocusItem>
                    {options.map((option, index) => (
                        <MenuItem
                        key={option}
                        selected={index === selectedIndex}
                        onClick={(event) => handleMenuItemClick(event, index)}
                        >
                        {option}
                        </MenuItem>
                    ))}
                    </MenuList>
                </ClickAwayListener>
                </Paper>
            </Grow>
            )}
        </Popper>
        </React.Fragment>
    </ThemeProvider>
  );
}

export default SplitButton;
