import React from "react";
import PropTypes from "prop-types";
import "styles/views/Header.scss";
import {Box, ThemeProvider} from "@mui/material";
import theme from "styles/mui/customMui";

/**
 * This is an example of a Functional and stateless component (View) in React. Functional components are not classes and thus don't handle internal state changes.
 * Conceptually, components are like JavaScript functions. They accept arbitrary inputs (called “props”) and return React elements describing what should appear on the screen.
 * They are reusable pieces, and think about each piece in isolation.
 * Functional components have to return always something. However, they don't need a "render()" method.
 * https://reactjs.org/docs/components-and-props.html
 * @FunctionalComponent
 */
const Header = props => (
  <ThemeProvider theme={theme}>
    <div className="header container" style={{height: props.height}}>
      <Box className="row">
        <h1 className="header title">
          <Box sx={{color: theme.palette.primary.main}}>The Movie Monster</Box>
        </h1>
        
      </Box>
    </div>
  </ThemeProvider>
);

Header.propTypes = {
  height: PropTypes.string
};

/**
 * Don't forget to export your component!
 */
export default Header;