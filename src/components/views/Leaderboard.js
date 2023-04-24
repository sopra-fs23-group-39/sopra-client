import {Button} from 'components/ui/Button';
import {useHistory} from 'react-router-dom';
import BaseContainer from "components/ui/BaseContainer";
import "styles/views/Leaderboard.scss";
import {api, handleError} from "../../helpers/api";
import {useEffect, useState} from "react";
import Player from "../ui/Player";
import PropTypes from "prop-types";

const FormField = props => {
    return (
        <div className="dashboard field">
            <label className="dashboard label">
                {props.label}
            </label>
            <input
                type={props.type}
                className="dashboard input"
                placeholder="enter here.."
                disabled={props.disabled}
                value={props.value}
                onChange={e => props.onChange(e.target.value)}
            />
        </div>
    );
};

FormField.propTypes = {
    label: PropTypes.string,
    value: PropTypes.string,
    type: PropTypes.string,
    disabled: PropTypes.bool,
    onChange: PropTypes.func
};

const Leaderboard = () => {
    const history = useHistory();
    const [users, setUsers] = useState(null);

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await api.get('/users');
                setUsers(response.data);
            } catch (error) {
                console.error(`Something went wrong while fetching the users: \n${handleError(error)}`);
                console.error("Details:", error);
                alert("Something went wrong while fetching the users! See the console for details.");
            }
        }
        fetchData();
    }, []);

    let content = null;

    if (users) {
        users.sort((a, b) => (a.rank - b.rank));
        content = (
            <div className="leaderboard">
                <ul className="player-list">
                    {users.map(user => (
                        <Player user={user} key={user.id}/>
                    ))}
                </ul>
            </div>
        );
    }

    return (
        <BaseContainer>
            <div className="leaderboard container">
                <div className="leaderboard form">
                    <h1 style={{textAlign: "center"}}>Leaderboard</h1>
                    {content}
                    <div className="leaderboard button-container">
                        <Button
                            width="100%"
                            style={{marginTop: 350}}
                            onClick={() => history.push("/main")}
                        >
                            Back
                        </Button>
                    </div>
                </div>
            </div>
        </BaseContainer>
    );
}

export default Leaderboard;