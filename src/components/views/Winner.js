import 'styles/views/Winner.scss';
import {useHistory, useParams} from 'react-router-dom';
import React, {useEffect, useState} from "react";
import {api, handleError} from 'helpers/api';
import {ThemeProvider} from "@mui/material/styles";
import theme from "../../styles/mui/customMui";
import {Box, Typography} from "@mui/material";
import {Spinner} from "../ui/Spinner";
import PrimaryButton from "../../styles/mui/PrimaryButton";


const Winner = () => {
  const {gameId} = useParams();
  const history = useHistory();
  const [winner, setWinner] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchWinner() {
      try {
        const response = await api.get(`/game/${gameId}/winner`);
        setWinner(response.data);
        setIsLoading(false);
      } catch (error) {
        alert(`Something went wrong while fetching the winner: \n${handleError(error)}`);
      }
    }

    fetchWinner();

  }, [gameId]);

  const goToMain = async () => {
    try {
      history.push('/main')
    } catch (error) {
      alert(`Something went wrong during returning to Main page: \n${handleError(error)}`);
    }
  };

  return (
    <div>
      {isLoading ? <Spinner/> :
        <ThemeProvider theme={theme}>
          <Box sx={{mt: 10, backgroundColor: 'rgba(0, 0, 0, 0.8)', pt: '20px'}}>
            <Typography variant="h4" align="center" gutterBottom color={theme.palette.primary.light}
                        sx={{px: '20px'}}>
              The Winner is {winner.username} with {winner.totalPointsCurrentGame} points!
            </Typography>
            <div className="main button-container">
              <Box sx={{mt: 10, mb:2}}>
                <PrimaryButton label="go back to main page" onClick={() => goToMain()}/>
              </Box>
            </div>
          </Box>
        </ThemeProvider>}
    </div>
  )
}

export default Winner;
