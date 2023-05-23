import {api, handleError} from 'helpers/api';
import {useHistory} from 'react-router-dom';
import {useState} from "react";
import { ThemeProvider } from '@mui/material/styles';
import theme from 'styles/mui/customMui';
import {Box, Slider, Typography} from '@mui/material';
import PrimaryButton from 'styles/mui/PrimaryButton';
import SecondaryButton from 'styles/mui/SecondaryButton';
import SplitButton from 'styles/mui/SplitButton';
import "styles/mui/ResponsiveUI.scss";

const RapidSelection = () => {
  const color = "$accent";
  const history = useHistory();
  const options = ["SHOW", "MOVIE", "ACTOR", "MIXED"]
  const [gameMode, setGameMode] = useState("MOVIE");
  const [QuestionAmount, setQuestionAmount] = useState(100)
  const [timerValue, setTimerValue] = useState(5);
  const [disabled, setDisabled] = useState(false);
  const [gameFormat, setGameFormat] = useState("RAPID");
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
      setQuestionAmount(5)
      console.log('Before API call')
      const requestBody = JSON.stringify({hostId, gameMode: gameMode, questionAmount: QuestionAmount, timer: timerValue, gameFormat: gameFormat});
      const response = await api.post('/game', requestBody);
      console.log(response.data);
      const gameId = response.data.gameId;
      console.log(gameId);
      history.push(`/gamerapid/${gameId}`);
      console.log('After API call');
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

  const handleSplitButtonChange = (index) => {
    setGameMode(options[index]);
    handleMode(options[index], `but${index + 1}`);
  };

  const handleTimerChange = (event) =>{
    setTimerValue(event.target.value);
  };


  return (
    <ThemeProvider theme={theme}>
      <Box className="box">
        <Typography color={theme.palette.primary.light} sx={{fontSize: "calc(1vw + 0.8vh)"}} className="center">Game theme:</Typography>
        <Box className="row">
          <SplitButton options={options} onSelect={handleSplitButtonChange} selectedIndex={options.indexOf(gameMode)} />
        </Box>
        <Typography color={theme.palette.primary.light} sx={{fontSize: "calc(1vw + 0.8vh)"}} className="center">Timer (length of game):</Typography>
        <Box className="row">
          <Slider
            className="slider"
            aria-label="Questions"
            defaultValue={5}
            //getAriaValueText={valuetext}
            valueLabelDisplay="auto"
            step={5}
            marks
            min={5}
            max={60}
            onChange={handleTimerChange}
          />
        </Box>
        <PrimaryButton className="primary-button" label="create game" onClick={() => createGame(gameMode)} />
        <SecondaryButton className="secondary-button" label="cancel" onClick={() => history.push('/main')} />
      </Box>
    </ThemeProvider>
  );
}

export default RapidSelection;
