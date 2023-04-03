import {Redirect} from "react-router-dom";
import PropTypes from "prop-types";

/**
 * @Guard
 * @param props
 */
export const GameSelectionGuard = props => {
    //TODO: Delete this and uncomment token part when registration/login is setup
    if(true){
        return props.children;
    }
    return <Redirect to="/login"/>;

    /*if (localStorage.getItem("token")) {
        return props.children;
    }
    return <Redirect to="/login"/>;
    */
};

GameSelectionGuard.propTypes = {
    children: PropTypes.node
};