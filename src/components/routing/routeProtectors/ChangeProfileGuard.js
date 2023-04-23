import {Redirect} from "react-router-dom";
import PropTypes from "prop-types";


export const ChangeProfileGuard = props => {
    const { id } = props.match.params;
    const userId = localStorage.getItem("id");

    if (userId === id) {
        return props.children;
    }

    return <Redirect to="/main" />;
};

ChangeProfileGuard.propTypes = {
    children: PropTypes.node
};