import {useState, useEffect} from 'react';
import {api, handleError} from 'helpers/api';
import {Button} from 'components/ui/Button';
import {useHistory} from 'react-router-dom';
import BaseContainer from "components/ui/BaseContainer";
import "styles/views/Join.scss";
import PropTypes from "prop-types";

const FormField = props => {
    return (
      <div className="Join lobby field">
        <label className="Join lobby label">
          {props.label}
        </label>
        <input
          className="lobby code input"
          placeholder="enter lobby code here.."
          value={props.value}
          onChange={e => props.onChange(e.target.value)}
        />
      </div>
    );
  };
  
  FormField.propTypes = {
    label: PropTypes.string,
    value: PropTypes.string,
    onChange: PropTypes.func
  };

const JoinGame = () => {
    const history = useHistory();
    const [lobbyId, setlobbyId] = useState(null);
    


    const joinLobby = async (lobbyId) => {
        try {
            const requestBody = JSON.stringify(localStorage.getItem('id'));
            await api.put(`/game/${lobbyId}`, requestBody);
            history.push(`/game/${lobbyId}`);
        } catch (error) {
              alert(`Something went wrong trying to join the game: \n${handleError(error)}`);
        }
        };

    return (
        <BaseContainer>
            <div className="join container">
                <div className="join form">
                    <h1 style={{textAlign: "center"}}>The Movie Monster</h1>
                    <FormField
                        label="Lobby Code"
                        value={lobbyId}
                        onChange={l => setlobbyId(l)}
                    />
                    <div className="login button-container">
                        <Button
                            width="100%"
                            onClick={() => joinLobby(lobbyId)}
                        >
                        Join Game
                        </Button>
                    </div>
                    <div className="join button-container">
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

export default JoinGame;
