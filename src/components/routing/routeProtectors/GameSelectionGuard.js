import {Redirect} from "react-router-dom";
import PropTypes from "prop-types";

/**
 * @Guard
 * @param props
 */
export const GameSelectionGuard = props => {
  //TODO
  if (true) {
    return props.children;
  }
  return <Redirect to="/login"/>;
};

GameSelectionGuard.propTypes = {
  children: PropTypes.node
};