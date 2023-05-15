import {api, handleError} from 'helpers/api';
//import {Button} from 'components/ui/Button';
import {useHistory} from 'react-router-dom';
import "styles/views/Main.scss";
import {useState} from "react";
import {Box, Container, FormControl, InputAdornment, InputLabel, IconButton, OutlinedInput, Slider } from '@mui/material';
import 'styles/mui/Box.scss';
import * as React from 'react';
import Button from '@mui/material/Button';
import SplitButton from 'styles/mui/SplitButton';
import theme from 'styles/mui/customMui';
import { ThemeProvider} from '@mui/material/styles';
import PrimaryButton from 'styles/mui/Button';
import SecondaryButton from 'styles/mui/SecondaryButton';

const GameSelection = () => {
    const optionsFormat = ["custom", "blitz", "rapid"];
    const optionsTheme = ["SHOW", "MOVIE", "ACTOR", "TRAILER", "MIXED"]
    const history = useHistory();
    const [questionAmount, setQuestionAmount] = useState(2);
    const [timerValue, setTimerValue] = useState(5);
    const color = "#DEB522";
    const [sliderValue, setSliderValue] = useState(5);
    const [gameMode, setGameMode] = useState("MOVIE");
    const [disabled, setDisabled] = useState(false);
    const [gameFormat, setGameFormat] = useState('CUSTOM');
    const [selectedOption, setSelectedOption] = useState(null);
    const [selectedOption2, setSelectedOption2] = useState(null);
    const [buttonColors, setButtonColors] = useState({
        but1: color,
        but2: color,
        but3: color,
        but4: color,
        but5: color
    });

    const handleCustom = () => {
        history.push('/game_custom');
    };
    
    const handleRapid = async () => {
        try {
          setGameFormat('Rapid');
          const hostId = localStorage.getItem('id');
          const requestBody = JSON.stringify({
            hostId,
            gameMode,
            questionAmount,
            timer: timerValue,
            gameFormat,
          });
          const response = await api.post('/game', requestBody);
          const gameId = response.data.gameId;
          history.push(`/rapid_selection/${gameId}`);
        } catch (error) {
          console.error(`Something went wrong while creating the game: \n${handleError(error)}`);
          console.error('Details:', error);
          alert('Something went wrong while creating the game! See the console for details.');
        }
    };
    
    const handleBlitz = async () => {
        try {
          setGameFormat('Blitz');
          const hostId = localStorage.getItem('id');
          const requestBody = JSON.stringify({
            hostId,
            gameMode,
            questionAmount,
            timer: timerValue,
            gameFormat,
          });
          const response = await api.post('/game', requestBody);
          const gameId = response.data.gameId;
          history.push(`/game/${gameId}`);
        } catch (error) {
          console.error(`Something went wrong while creating the game: \n${handleError(error)}`);
          console.error('Details:', error);
          alert('Something went wrong while creating the game! See the console for details.');
        }
    };
  
    const handleClickFormat = (selectedOption) => {
          console.log('Selected option:', selectedOption);
          if (selectedOption === 'blitz') {
              handleBlitz();
          } else if (selectedOption === 'rapid') {
              handleRapid();
          } else if (selectedOption === 'custom') {
              handleCustom();
          }
    };

 /*   const handleClickTheme = (selectedOption) => {
            console.log('Selected option:', selectedOption);
            if (selectedOption === 'tv show') {
                handleMode("SHOW", "but1");
            } else if (selectedOption === 'actors') {
                handleMode("ACTOR", "but3");
            } else if (selectedOption === 'movies') {
                handleMode("MOVIE", "but2");
            } else if (selectedOption === 'mixed') {
                handleMode("MIXED", "but4");
            };
    };*/

    const handleClickTheme = (selectedOption2) => {
        console.log('Selected option:', selectedOption2);
        if (selectedOption2 === 'tv show') {
            setGameMode("SHOW");
        } else if (selectedOption2 === 'actors') {
            setGameMode("ACTOR");
        } else if (selectedOption2 === 'movies') {
            setGameMode("MOVIE");
        } else if (selectedOption2 === 'mixed') {
            setGameMode("MIXED");
        };
};
    const createGame = async (gameMode) => {
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

    function handleMode(mode, buttonId) {
        //setDisabled(true);
        setGameMode(mode);
        /*setButtonColors({
            ...buttonColors,
            [buttonId]: "yellow"
        });*/
    };

    function handleFormat(format) {
        setGameFormat(format);
    }

    const handleSliderChange = (event) => {
        setSliderValue(event.target.value);
    };

    const handleTimerChange = (event) =>{
        setTimerValue(event.target.value);
    };


    return (
        <ThemeProvider theme={theme}>
            <Box className="box" sx={{ textAlign: 'center'}}>
                    <h3>Game format:</h3>
                    <Box className="row">
                        <PrimaryButton label="custom" onClick={() => handleCustom()}/>
                        <PrimaryButton label="blitz" onClick={() => handleBlitz()}/>
                        <PrimaryButton label="rapid" onClick={() => handleRapid()}/>
                        {/*<SplitButton options={optionsFormat} handleClick={handleClickFormat}/>*/}
                    </Box>
                    <h3 class="center"> Game theme:</h3>
                    <Box className="row">
                        <PrimaryButton label="tv series" onClick={() => handleMode("SHOW", "but1")}/>
                        <PrimaryButton label="movies" onClick={() => handleMode("MOVIE", "but2")}/>
                        <PrimaryButton label="actors" onClick={() => handleMode("ACTOR", "but3")}/>
                        <PrimaryButton label="trailer" onClick={() => handleMode("TRAILER", "but4")}/>
                        <PrimaryButton label="mixed" onClick={() => handleMode("MIXED", "but5")}/>
                        {/*<SplitButton options={optionsTheme} handleClick={handleClickTheme}/>*/}
                    </Box>
                <Box clasName="row">
                    <h3>Number of questions:</h3>
                    <Box className="row">
                        <Slider 
                            sx={{
                                color: theme.palette.primary.main,
                                maxWidth: 500
                            }}
                            aria-label='Questions'
                            defaultValue={5}
                            //getAriaValueText={valuetext}
                            valueLabelDisplay='auto'
                            step={1}
                            marks
                            min={5}
                            max={20}
                            onChange={handleSliderChange}
                        />
                    </Box>
                </Box>
                <h3>Timer (seconds per question):</h3>
                <Box className="row">
                    <Slider 
                        sx={{
                            color: theme.palette.primary.main,
                            maxWidth: 500
                        }}
                        aria-label='Questions'
                        defaultValue={5}
                        //getAriaValueText={valuetext}
                        valueLabelDisplay='auto'
                        step={1}
                        marks
                        min={5}
                        max={20}
                        onChange={handleTimerChange}
                    />
                </Box>
                <PrimaryButton label="create game" onClick={() => createGame(gameMode)} />
                <SecondaryButton label="cancel" onClick={() => history.push('/main')} />
            </Box>
        </ThemeProvider>
    );

};

export default GameSelection;
