import {api, handleError} from 'helpers/api';
import {useHistory} from 'react-router-dom';
import {useState} from "react";
import {Box, Slider, Typography } from '@mui/material';
import * as React from 'react';
import SplitButton from 'styles/mui/SplitButton';
import theme from 'styles/mui/customMui';
import {ThemeProvider} from '@mui/material/styles';
import PrimaryButton from 'styles/mui/PrimaryButton';
import SecondaryButton from 'styles/mui/SecondaryButton';
import "styles/mui/ResponsiveUI.scss";

const GameSelection = () => {
  const options = ["SHOW", "MOVIE", "ACTOR", "TRAILER", "MIXED"]
  const history = useHistory();
  const [timerValue, setTimerValue] = useState(5);
  const [sliderValue, setSliderValue] = useState(5);
  const [gameMode, setGameMode] = useState("MOVIE");
  const [gameFormat, setGameFormat] = useState('CUSTOM');

  const createGame = async () => {
    try {
      console.log(gameMode)
      const hostId = localStorage.getItem('id');
      console.log(hostId);
      const requestBody = JSON.stringify({hostId, gameMode: gameMode, questionAmount: sliderValue, timer: timerValue, gameFormat: gameFormat});
      const response = await api.post('/game', requestBody);
      console.log(response.data);
      const gameId = response.data.gameId;
      history.push(`/game/${gameId}`);
      console.log('request to:', response.request.responseURL);
      console.log('status code:', response.status);
      console.log('status text:', response.statusText);
      console.log('requested data:', response.data);

    } catch (error) {
      console.error(`Something went wrong while creating the game: \n${handleError(error)}`);
      console.error("Details:", error);
      alert("Something went wrong while creating the game! See the console for details.");
    }
  };

  const handleSliderChange = (event) => {
    setSliderValue(event.target.value);
  };

  const handleTimerChange = (event) =>{
    setTimerValue(event.target.value);
  };

  const handleSplitButtonChange = (index) => {
    setGameMode(options[index]);
  };

  return (
    <ThemeProvider theme={theme}>
      <Box className="box">
        <Typography color={theme.palette.primary.light} sx={{fontSize: "calc(1vw + 0.8vh)"}} className="center">Game theme:</Typography>
        <Box className="row">
          <SplitButton options={options} onSelect={handleSplitButtonChange} selectedIndex={options.indexOf(gameMode)} />
        </Box>
        <Typography color={theme.palette.primary.light} sx={{fontSize: "calc(1vw + 0.8vh)"}} className="center">Number of questions:</Typography>
        <Box className="row">
          <Slider
            className="slider"
            aria-label="Questions"
            defaultValue={5}
            valueLabelDisplay="auto"
            step={1}
            marks
            min={5}
            max={20}
            onChange={handleSliderChange}
          />
        </Box>
        <Typography color={theme.palette.primary.light} sx={{fontSize: "calc(1vw + 0.8vh)"}} className="center">Timer (seconds per question):</Typography>
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
};

export default GameSelection;
