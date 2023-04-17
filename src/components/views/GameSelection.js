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
    const [TimerValue, setTimerValue] = useState(5);


    const createGame = async (gameMode) => {

        try {
            const hostId = localStorage.getItem('id');
            console.log(hostId);
            const requestBody = JSON.stringify({hostId, gameMode: gameMode, questionAmount: sliderValue, timer: TimerValue});
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

    const handleTimerChange = (event) =>{
        setTimerValue(event.target.value);
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
                            style={{marginTop: 20, marginBottom: 20}}
                            onClick={() => createGame('MIXED')}
                        >
                            Mixed
                        </Button>
                    </div>
                    <div className ="Slider">
                        <div>
                            <h3 style={{textAlign: "center",marginBottom: 0}}>Amount of questions:</h3>
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
                    <div className ="Time Selection Slider">
                        <div>
                            <h3 style={{textAlign: "center",marginTop: 10, marginBottom:0}}>Timer:</h3>
                            <div style = {{display: 'flex', justifyContent: 'space-between'}}>
                                 <p>5s</p>
                                 <p>60s</p>
                            </div>
                            <div style = {{display: 'flex', justifyContent: 'center'}}>
                                <output>{TimerValue}</output>
                                <input
                                    type ="range"
                                    min = "5"
                                    max = "60"
                                    step = "5"
                                    value = {TimerValue}
                                    onChange = {handleTimerChange}
                                    style = {{width : '100%'}}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="Create Game button-container">
                        <Button
                            width="100%"
                            style={{marginTop: 40}}
                            onClick={() => history.push('/waiting_room_owner')}
                        >
                            Create Game
                        </Button>
                    </div>
                    <div className="Back to main page button-container">
                        <Button
                            width="100%"
                            style = {{marginTop:0}}
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
