import {useHistory, useParams} from 'react-router-dom';
import {useEffect, useState, useRef} from "react";
import {api, handleError} from 'helpers/api';
import theme from 'components/ui/customMui';
import {ThemeProvider} from '@mui/material/styles';
import {Box, Typography} from '@mui/material';
import "styles/ResponsiveUI.scss";


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
  window.addEventListener('popstate', (event) => {
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
        <Box sx={{display: "flex", flexDirection: "row" }}>
          <Box sx={{display: "flex", flexDirection: "column", marginRight: "5%", textAlign: "left"}}>
            <Typography variant='h7' color={theme.palette.primary.light} sx={{display: "flex", flexDirection:"column", fontSize: 'calc(0.3rem + 2vw)', marginBottom: 2}}>
              This round's ranking:
            </Typography>
            <Typography color={theme.palette.primary.light} sx={{display: "flex", flexDirection:"column", fontSize: 'calc(0.3rem + 1vw)'}} >
              <Box color={theme.palette.primary.light} sx={{display:"flex", flexDirection: "column"}}>
                {currentRanking.map((player) => (
                  <div key={player.id}>{player.username}: <span>{player.currentPoints}</span></div>
                ))}
              </Box>
            </Typography>
          </Box>
          <Box sx={{display: "flex", flexDirection: "column", marginLeft:"5%", textAlign: "left"}}>
            <Typography variant='h7' color={theme.palette.primary.light} sx={{display: "flex", flexDirection:"column", fontSize: 'calc(0.3rem + 2vw)', marginBottom: 2}} >
              Total ranking:
            </Typography>
            <Typography color={theme.palette.primary.light} sx={{display: "flex", flexDirection:"column", fontSize: 'calc(0.3rem + 1vw)'}} >
              <Box color={theme.palette.primary.light} sx={{display:"flex", flexDirection: "column"}}>
                {totalRanking.map((player) => (
                  <div key={player.id}>{player.username}: <span>{player.totalPointsCurrentGame}</span></div>
                ))}
              </Box>
            </Typography>
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default Standings;