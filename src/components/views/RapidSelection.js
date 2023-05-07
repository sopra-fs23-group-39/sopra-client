import {api, handleError} from 'helpers/api';
import {Button} from 'components/ui/Button';
import {useHistory} from 'react-router-dom';
import BaseContainer from "components/ui/BaseContainer";
import "styles/views/Main.scss";
import {useState} from "react";

const GameSelection = () => {
    const color = "#DEB522";
    const history = useHistory();
    const [gameMode, setGameMode] = useState("POSTER");
    const [TimerValue, setTimerValue] = useState(5);
    const [disabled, setDisabled] = useState(false);
    const [gameFormat] = useState("CUSTOM");
    const [buttonColors, setButtonColors] = useState({
        but1: color,
        but2: color,
        but3: color,
        but4: color
    });


    const createGame = async (gameMode) => {
        try {
            console.log(gameMode)
            const hostId = localStorage.getItem('id');
            console.log(hostId);
            const requestBody = JSON.stringify({hostId, gameMode: gameMode, questionAmount: 50, timer: TimerValue, gameFormat: gameFormat});
            const response = await api.post('/game', requestBody);
            console.log(response.data);
            const gameId = response.data.gameId;
            history.push(`/gamerapid/${gameId}`);
            console.log('request to:', response.request.responseURL);
            console.log('status code:', response.status);
            console.log('status text:', response.statusText);
            console.log('requested data:', response.data);

        } catch (error) {
            console.error(`Something went wrong while creating the game: \n${handleError(error)}`);
            console.error("Details:", error);
            alert("Something went wrong while creating the game! See the console for details.");
        }
    }

    function handleMode(mode, buttonId) {
        setDisabled(true);
        setGameMode(mode);
        setButtonColors({
            ...buttonColors,
            [buttonId]: "yellow"
        });
    }


    const handleTimerChange = (event) =>{
        setTimerValue(event.target.value);
    };


    return (
        <BaseContainer>
            <div className="main container" style={{display: "flex", justifyContent: "center", alignItems: "center", height: "100%", width: "100%"}}>
                <div className="main form">
                    <h1 style={{textAlign: "center"}}>The Movie Monster</h1>
                    <h3 style={{textAlign: "center", marginTop: 40}}>Game theme:</h3>
                    {/*<div className="Movie Trailers button-container">*/}
                    {/*    <Button*/}
                    {/*        disabled={disabled}*/}
                    {/*        width="100%"*/}
                    {/*        style={{marginTop: 10, backgroundColor: buttonColors.but1}}*/}
                    {/*        onClick={() => handleMode("TRAILER", "but1")}*/}
                    {/*    >*/}
                    {/*        Movie Trailers*/}
                    {/*    </Button>*/}
                    {/*</div>*/}
                    <div className="Movie Posters button-container">
                        <Button
                            disabled={disabled}
                            width="100%"
                            style={{marginTop: 20, backgroundColor: buttonColors.but2}}
                            onClick={() => handleMode("POSTER", "but2")}
                        >
                            Movie Scenes
                        </Button>
                    </div>
                    <div className="Actors button-container">
                        <Button
                            disabled={disabled}
                            width="100%"
                            style={{marginTop: 20, backgroundColor: buttonColors.but3}}
                            onClick={() => handleMode("ACTOR", "but3")}
                        >
                            Actors' Pictures
                        </Button>
                    </div>
                    <div className="mixed button-container">
                        <Button
                            disabled={disabled}
                            width="100%"
                            style={{marginTop: 20, marginBottom: 20, backgroundColor: buttonColors.but4}}
                            onClick={() => handleMode("MIXED", "but4")}
                        >
                            Mixed
                        </Button>
                    </div>
                    <div className ="Time Selection Slider">
                        <div>
                            <h3 style={{textAlign: "center", marginTop: 10, marginBottom: 0}}>Timer (length of game):</h3>
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
                            onClick={() => createGame(gameMode)}
                        >
                            CREATE GAME
                        </Button>
                    </div>
                    <div className="Back to main page button-container">
                        <Button
                            width="100%"
                            style = {{marginTop:0}}
                            onClick={() => history.push('/main')}
                        >
                            CANCEL
                        </Button>
                    </div>
                </div>
            </div>
        </BaseContainer>
    );
}

export default GameSelection;
