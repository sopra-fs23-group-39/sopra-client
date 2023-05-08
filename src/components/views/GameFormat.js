import {Button} from 'components/ui/Button';
import {useHistory} from 'react-router-dom';
import BaseContainer from "components/ui/BaseContainer";
import "styles/views/Main.scss";
import {api, handleError} from "../../helpers/api";
import {useState} from "react";

const GameFormat = () => {
    const history = useHistory();
    const [gameMode] = useState("MIXED");
    const [TimerValue] = useState(5);
    const [sliderValue] = useState(2);
    const [gameFormat, setGameFormat] = useState("BLITZ");

    const selectBlitz = async () => {
        try {
            setGameFormat("Blitz")
            console.log(gameFormat)
            const hostId = localStorage.getItem('id');
            const requestBody = JSON.stringify({hostId, gameMode: gameMode, questionAmount: sliderValue, timer: TimerValue, gameFormat: gameFormat});
            const response = await api.post('/game', requestBody);
            const gameId = response.data.gameId;
            history.push(`/game/${gameId}`);
            console.log('requested data:', response.data);
        } catch (error) {
            console.error(`Something went wrong while creating the game: \n${handleError(error)}`);
            console.error("Details:", error);
            alert("Something went wrong while creating the game! See the console for details.");
        }
    }

    const selectRapid = async () => {
            try {
                setGameFormat("Rapid")
                console.log(gameFormat)
                const hostId = localStorage.getItem('id');
                const requestBody = JSON.stringify({hostId, gameMode: gameMode, questionAmount: sliderValue, timer: TimerValue, gameFormat: gameFormat});
                const response = await api.post('/game', requestBody);
                const gameId = response.data.gameId;
                history.push(`/rapid_selection`);
                console.log('requested data:', response.data);
            } catch (error) {
                console.error(`Something went wrong while creating the game: \n${handleError(error)}`);
                console.error("Details:", error);
                alert("Something went wrong while creating the game! See the console for details.");
            }
    }
    return (
        <BaseContainer>
            <div className="main container" style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
                width: "100%"
            }}>
                <div className="main form">
                    <h1 style={{textAlign: "center"}}>The Movie Monster</h1>
                    <h3 style={{textAlign: "center", marginTop: 40}}>Select a Game Mode:</h3>
                    <div className="Create Game button-container">
                        <Button
                            width="100%"
                            style={{marginTop: 40}}
                            onClick={() => history.push("/game_selection")}
                        >
                            Custom
                        </Button>
                    </div>
                    <div className="Create Game button-container">
                        <Button
                            width="100%"
                            style={{marginTop: 40}}
                            onClick={() => selectBlitz()}
                        >
                            Blitz
                        </Button>
                    </div>
                    <div className="Create Game button-container">
                        <Button
                            width="100%"
                            style={{marginTop: 40}}
                            onClick={() => selectRapid()}
                        >
                            Rapid
                        </Button>
                    </div>
                    <div className="Back to main page button-container">
                        <Button
                            width="100%"
                            style={{marginTop: 250}}
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

export default GameFormat;
