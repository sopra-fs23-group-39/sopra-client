//import {useState} from 'react';
import {api, handleError} from 'helpers/api';
// import {Spinner} from 'components/ui/Spinner';
import {Button} from 'components/ui/Button';
import {useHistory} from 'react-router-dom';
import BaseContainer from "components/ui/BaseContainer";
// import PropTypes from "prop-types";
import "styles/views/Main.scss";
import {useState} from "react";

const GameSelection = () => {
    const history = useHistory();
    const [sliderValue, setSliderValue] = useState(5);
    let gameMode = "POSTER";


    const createGame = async (gameMode) => {
        try {
            console.log(gameMode)
            const hostId = localStorage.getItem('id');
            console.log(hostId);
            const requestBody = JSON.stringify({hostId, gameMode: gameMode, questionAmount: sliderValue});
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
    const handleSliderChange = (event) => {
        setSliderValue(event.target.value);
    };


    return (
        <BaseContainer>
            <div className="gameSelection container" style={{display: "flex", justifyContent: "center", alignItems: "center", height: "100%", width: "100%"}}>
                <div className="main form">
                    <h1 style={{textAlign: "center"}}>The Movie Monster</h1>
                    <div className="Movie Trailers button-container">
                        <Button
                            width="100%"
                            style={{marginTop: 80}}
                            onClick={() => gameMode = "TRAILER"}
                        >
                            Movie Trailers
                        </Button>
                    </div>
                    <div className="Movie Posters button-container">
                        <Button
                            width="100%"
                            style={{marginTop: 20}}
                            onClick={() => gameMode = "POSTER"}
                        >
                            Movie Posters
                        </Button>
                    </div>
                    <div className="Actors button-container">
                        <Button
                            width="100%"
                            style={{marginTop: 20}}
                            onClick={() => gameMode = "ACTOR"}
                        >
                            Actors
                        </Button>
                    </div>
                    <div className="mixed button-container">
                        <Button
                            width="100%"
                            style={{marginTop: 20, marginBottom: 20}}
                            onClick={() => gameMode = "MIXED"}
                        >
                            Mixed
                        </Button>
                    </div>
                    <div className ="Slider">
                        <div>
                            <h3 style={{textAlign: "center"}}>Amount of questions:</h3>
                            <div style = {{display: 'flex', justifyContent: 'space-between'}}>
                                <p>5</p>
                                <p>20</p>
                            </div>
                            <div style = {{display: 'flex', justifyContent: 'center'}}>
                                <output>{sliderValue}</output>
                                <input
                                    type ="range"
                                    min = "5"
                                    max = "20"
                                    step = "1"
                                    value = {sliderValue}
                                    onChange = {handleSliderChange}
                                    style = {{width : '100%'}}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="Create Game button-container">
                        <Button
                            width="100%"
                            style={{marginTop: 110}}
                            onClick={() => createGame(gameMode)}
                        >
                            Create Game
                        </Button>
                    </div>
                    <div className="Back to main page button-container">
                        <Button
                            width="100%"
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
