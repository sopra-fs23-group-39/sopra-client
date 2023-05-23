import {useHistory} from 'react-router-dom';
import React, { useState } from 'react';
import PropTypes from "prop-types";
import "styles/Inspect.scss"


const Player = ({user}) => {
    const [hoveredUser, setHoveredUser] = useState(null);
    const history = useHistory();

    const rerouteToUser = (user) => {
        history.push("/profile/" + user.id)
    }

    const handleHover = (user) => {
        setHoveredUser(user);
    };

    return (
        <div className="player container">
            <div
                className="player leaderboardname"
                onMouseOver={() => handleHover(user)}
                onMouseOut={() => handleHover(null)}
                onClick={() => rerouteToUser(user)}
            >
                {user.username}
                {hoveredUser === user && <span className="inspect">Inspect</span>}
            </div>
        </div>)
}

Player.propTypes = {
    user: PropTypes.object
};

export default Player;