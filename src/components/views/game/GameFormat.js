import {useHistory} from 'react-router-dom';
import {api, handleError} from "../../../helpers/api";
import {useState} from "react";
import { Box, Button, Typography } from '@mui/material';
import theme from 'components/ui/customMui';
import { ThemeProvider} from '@mui/material/styles';
import PrimaryButton from 'components/ui/PrimaryButton';
import SecondaryButton from 'components/ui/SecondaryButton';
import "styles/ResponsiveUI.scss";


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
        <Typography color={theme.palette.primary.light} sx={{textAlign: "center", marginTop: 2, marginBottom: 2, fontSize: "calc(1vw + 0.9vh)"}}>Select a Game Mode:</Typography>
        <Box className="row">
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
            <h3>WARNING:</h3>
            <div>
              Refreshing or closing the page during the game will cause you to be removed from the game!
            </div>
          </div>
            )}
        </Box>
        <SecondaryButton label="cancel" onClick={() => history.push('/main')} />
      </Box>
    </ThemeProvider>
  );
}

export default GameFormat;
