import {useHistory} from 'react-router-dom';
import PropTypes from "prop-types";
import "styles/views/Game.scss";


const Player = ({user}) => {

    const history = useHistory();

    const rerouteToUser = (user) => {
        history.push("/profile/" + user.id)
    }

    return (
        <div className="player container">
            <div className="player rank">rank: {user.rank}</div>
            <div className="player leaderboardname" onClick={() => rerouteToUser(user)}>{user.username} </div>
        </div>)
}

Player.propTypes = {
    user: PropTypes.object
};

export default Player;