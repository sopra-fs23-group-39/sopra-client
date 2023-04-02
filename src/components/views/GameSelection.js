import {useEffect, useState} from 'react';
import {api, handleError} from 'helpers/api';
// import {Spinner} from 'components/ui/Spinner';
import {Button} from 'components/ui/Button';
import {useHistory} from 'react-router-dom';
import BaseContainer from "components/ui/BaseContainer";
// import PropTypes from "prop-types";
import "styles/views/Main.scss";

const GameSelection = () => {
    const history = useHistory();
    const [users, setUsers] = useState(null);

    const createGame = async (gameMode) => {

        try {
            const hostId = localStorage.getItem('currentUserId');
            const requestBody = JSON.stringify({hostId, gameMode: gameMode});
            const response = await api.post('/game', requestBody);
            console.log(response.data);
            const gameId = response.data.gameId;
            history.push(`/game/${gameId}`);
            console.log('request to:', response.request.responseURL);
            console.log('status code:', response.status);
            console.log('status text:', response.statusText);
            console.log('requested data:', response.data);

            // See here to get more data.
            console.log(response);
        } catch (error) {
            console.error(`Something went wrong while fetching the game info: \n${handleError(error)}`);
            console.error("Details:", error);
            alert("Something went wrong while fetching the game info! See the console for details.");
        }
    }

    return (
        <BaseContainer>
            <div className="gameSelection container" style={{display: "flex", justifyContent: "center", alignItems: "center", height: "100%", width: "100%"}}>
                <div className="main form">
                    <h1 style={{textAlign: "center"}}>The Movie Monster</h1>
                    <div className="Movie Trailers button-container">
                        <Button
                            width="100%"
                            style={{marginTop: 80}}
                            onClick={() => createGame('TRAILER')}
                        >
                            Movie Trailers
                        </Button>
                    </div>
                    <div className="Movie Posters button-container">
                        <Button
                            width="100%"
                            style={{marginTop: 20}}
                            onClick={() => createGame("POSTER")}
                        >
                            Movie Posters
                        </Button>
                    </div>
                    <div className="Actors button-container">
                        <Button
                            width="100%"
                            style={{marginTop: 20}}
                            onClick={() => createGame("ACTOR")}
                        >
                            Actors
                        </Button>
                    </div>
                    <div className="mixed button-container">
                        <Button
                            width="100%"
                            style={{marginTop: 20}}
                            onClick={() => createGame('MIXED')}
                        >
                            Mixed
                        </Button>
                    </div>
                    <div className="Back to main page button-container">
                        <Button
                            width="100%"
                            style={{marginTop: 350}}
                            onClick={() => history.push('/main')}
                        >
                            Cancel
                        </Button>
                    </div>
                </div>
            </div>
        </BaseContainer>
    );
}

export default GameSelection;
