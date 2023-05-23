import {Redirect} from "react-router-dom";
import PropTypes from "prop-types";


export const MainGuard = props => {
  if (localStorage.getItem("id")) {
    return props.children;
  }
  return <Redirect to="/login"/>;
};

MainGuard.propTypes = {
  children: PropTypes.node
};