import {useHistory, useParams} from 'react-router-dom';
import { useEffect, useState, useRef } from "react";
import {api, handleError} from 'helpers/api';
import 'styles/views/Standings.scss'
import theme from 'styles/mui/customMui';
import { ThemeProvider} from '@mui/material/styles';
import { Box, Typography, List, ListItem, ListItemText } from '@mui/material';
import "styles/mui/ResponsiveUI.scss";


function Standings() {
  const {gameId} = useParams();
  const history = useHistory();
  const [currentRanking, setCurrentRanking] = useState([]);
  const [totalRanking, setTotalRanking] = useState([]);

  const timeoutRef = useRef(null);

  useEffect(() => {
    async function fetchCurrentRanking() {
      try {
        const response = await api.get(`/game/${gameId}/currentRanking`);
        setCurrentRanking(response.data);
        console.log("Fetched currentRanking:");
        console.log(response.data);
      } catch (error) {
        alert(`Something went wrong while fetching the current ranking: \n${handleError(error)}`);
      }
    }

    fetchCurrentRanking();

  }, []);

  useEffect(() => {
    async function fetchTotalRanking() {
      try {
        const response = await api.get(`/game/${gameId}/totalRanking`);
        setTotalRanking(response.data);
        /*console.log("Fetched totalRanking:");
        console.log(response.data);*/
      } catch (error) {
        alert(`Something went wrong while fetching the total ranking: \n${handleError(error)}`);
      }
    }

    fetchTotalRanking();

  }, []);

  useEffect(async () => {
    try {
      const response = await api.get(`/game/${gameId}/settings`);
      if (response.data.questionAmount === response.data.currentRound) {
        timeoutRef.current = setTimeout(() => {
          history.push(`/game/${gameId}/winner`);
        }, 6000);
      } else {
        timeoutRef.current = setTimeout(() => {
          history.push(`/game/${gameId}/question`);
        }, 6000);
      }
    } catch (error) {
      alert(`Something went wrong during game navigation: \n${handleError(error)}`);
    }

  }, [history, gameId]);

  window.addEventListener('beforeunload', (event) => {
    history.push(`/main`);
  })

  return (
    <ThemeProvider theme={theme}>
      <Box className= "box"
        sx={{
          height: "100%",
          overflow: "auto",
          '&::-webkit-scrollbar': {
           width: '12px',
          },
          '&::-webkit-scrollbar-thumb': {
           backgroundColor: theme.palette.primary.light,
           borderRadius: '6px',
          },
          '&::-webkit-scrollbar-track': {
           backgroundColor: 'transparent',
        }}}
      >
        <Typography sx={{display: "flex", flexDirection:"column", fontSize: 'calc(1rem + 2vw)', paddingBottom:"5%"}} variant="h3" align="center" gutterBottom color={theme.palette.primary.light}>
          Standings
        </Typography>
        <Box sx={{display: "flex", flexDirection: "row" }}>
          <Box sx={{display: "flex", flexDirection: "column", marginRight: "5%", textAlign: "left"}}>
            <Typography variant='h5' color={theme.palette.primary.light} sx={{display: "flex", flexDirection:"column", fontSize: 'calc(0.3rem + 2vw)'}}>
              This round's ranking:
            </Typography>
            <List sx={{display: "flex", flexDirection:"column"}}>
              {currentRanking.map((player) => (
                <ListItem key={player.id} sx={{ fontSize: 'calc(0.3rem + 1vw)' }}>
                  <Typography component="span" color={theme.palette.primary.light}>
                    {player.username} - {player.currentPoints}
                  </Typography>
                </ListItem>
              ))}
            </List>
          </Box>
          <Box sx={{display: "flex", flexDirection: "column", marginLeft:"5%"}}>
            <Typography variant='h5' color={theme.palette.primary.light} sx={{display: "flex", flexDirection:"column", fontSize: 'calc(0.3rem + 2vw)'}} >
              Total ranking:
            </Typography>
            <Typography variant="body1" component="ol" color={theme.palette.primary.light} sx={{display: "flex", flexDirection:"column", fontSize: 'calc(0.4rem + 2vw)'}}>
              {totalRanking.map((player) => (
                <ListItem key={player.id}>
                  <ListItemText>
                    {player.username} - {player.totalPointsCurrentGame}
                  </ListItemText>
                </ListItem>
              ))}
            </Typography>
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default Standings;