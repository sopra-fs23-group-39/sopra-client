//import {Button} from 'components/ui/Button';
import {useHistory} from 'react-router-dom';
import BaseContainer from "components/ui/BaseContainer";
import "styles/views/Main.scss";
import {api, handleError} from "../../helpers/api";
import {useState} from "react";
import { Box, Button } from '@mui/material';
import theme from 'styles/mui/customMui';
import { ThemeProvider} from '@mui/material/styles';
import PrimaryButton from 'styles/mui/PrimaryButton';
import SecondaryButton from 'styles/mui/SecondaryButton';


const GameFormat = () => {
    const history = useHistory();
    const [gameMode] = useState("MIXED");
    const [TimerValue] = useState(5);
    const [sliderValue] = useState(5);
    const [showRules, setShowRules] = useState(false);

    const toggleRules = () => {
        setShowRules(!showRules);
      };

    async function selectGameFormat(gameFormat) {
        try {
            console.log(gameFormat)
            const hostId = localStorage.getItem('id');
            const requestBody = JSON.stringify({hostId, gameMode: gameMode, questionAmount: sliderValue, timer: TimerValue, gameFormat: gameFormat});
            const response = await api.post('/game', requestBody);
            const gameId = response.data.gameId;
            if (gameFormat === "RAPID"){
                history.push(`/rapid_selection`)
            }
            else{
                history.push(`/game/${gameId}`);
            }
            console.log('requested data:', response.data);
        } catch (error) {
            console.error(`Something went wrong while creating the game: \n${handleError(error)}`);
            console.error("Details:", error);
            alert("Something went wrong while creating the game! See the console for details.");
        }
    }



    return (
        <ThemeProvider theme={theme}>
            <Box className="box" sx={{ textAlign: 'center'}}>
                <h3 style={{textAlign: "center", marginTop: 40}}>Select a Game Mode:</h3>
                <Box className="row"/*sx={{ mb: ['4%', '10%'] }}*/>
                    <PrimaryButton label="custom" onClick={() => history.push("/game_selection")}/>
                    <PrimaryButton label="blitz" onClick={() => selectGameFormat("BLITZ")}/>
                    <PrimaryButton label="rapid" onClick={() => selectGameFormat("RAPID")}/>
                </Box>
                <Box sx={{ mb: ['10%', '20%'], maxWidth: ['90vw', '40vw'] }}>
                    <Button onClick={toggleRules}>Rules</Button>
                    {showRules && (
                       <div>
                       <h3>Custom:</h3>
                       <div>
                         One or more players try to guess a movie or actor name based on pictures or trailers. The host can set the Theme of the Game, how many questions there will be, and how much time the players get to answer each question. The player who guesses correctly the fastest gets the most points!
                       </div>
                       <h3>Blitz:</h3>
                       <div>
                         One or more players play with a preset amount of questions and a timer.
                       </div>
                       <h3>Rapid:</h3>
                       <div>
                         Single Player mode. One Player has to guess as fast as possible in a limited amount of time.
                       </div>
                     </div>
                     
                )}
                </Box>

                <SecondaryButton label="cancel" onClick={() => history.push('/main')} />
            </Box>
        </ThemeProvider>
        /*<BaseContainer>
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
                    <div>Custom</div>
                    <div>Blitz</div>
                    <div>Rapid</div>
                    </div>
                    <div className="Create Game button-container">
                        <Button
                            width="100%"
                            style={{marginTop: 40}}
                            onClick={() => selectGameFormat("BLITZ")}
                        >
                            Blitz
                        </Button>
                    </div>
                    <div className="Create Game button-container">
                        <Button
                            width="100%"
                            style={{marginTop: 40}}
                            onClick={() => selectGameFormat("RAPID")}
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
        </BaseContainer>*/
    );
}

export default GameFormat;
