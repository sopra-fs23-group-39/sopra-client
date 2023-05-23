import {useEffect, useState} from 'react'; //api,
import {Spinner} from 'components/ui/Spinner';
import {useHistory, useParams} from 'react-router-dom';
import "styles/views/Game.scss";
import {api, handleError} from "../../helpers/api";
import PrimaryButton from 'styles/mui/PrimaryButton';
import SecondaryButton from 'styles/mui/SecondaryButton';
import theme from 'styles/mui/customMui';
import "styles/mui/ResponsiveUI.scss";
import { Box, Typography } from '@mui/material';


const RapidGame = () => {
  // use react-router-dom's hook to access the history
  const history = useHistory();
  const [gameMode, setGameMode] = useState(null);
  const [timer, setTimer] = useState(null);
  const [disabled, setDisabled] = useState(false);
  const [gameFormat, setGameFormat] = useState(null);
  const {gameId} = useParams();

  const startGame = async () => {
    console.log("Before historypush");
    history.push(`/gamerapid/${gameId}/question`);
    console.log("After historypush");
    setDisabled(true);
  };

  useEffect(() => {
    async function fetchData() {
      console.log('Inside useEffect, beginning')
      try {
        const response = await api.get(`/game/${gameId}/settings`);
        console.log(response.data)
        setGameMode(response.data.gameMode)
        setTimer(response.data.timer)
        setGameFormat(response.data.gameFormat)
      } catch (error) {
        console.error(`Something went wrong while fetching the game settings: \n${handleError(error)}`);
        console.error(error);
        alert(`Something went wrong while fetching the game settings: \n${handleError(error)}`);
      }
    }

    fetchData();
  });

    let content = <Spinner/>;

    if (gameId) {
      content = (
        <Box className="box">
          <Box sx={{display: "flex", flexDirection: "row"}}>
            <Box sx={{display: "flex", flexDirection: "column", marginRight: "5%", textAlign: "left"}}>
              <Typography variant='h6' color={theme.palette.primary.light} sx={{display: "flex", flexDirection:"column", fontSize: 'calc(0.4rem + 2vw)'}}>
                Game:
              </Typography>
                <Typography color={theme.palette.primary.light} sx={{display: "flex", flexDirection:"column", fontSize: 'calc(0.3rem + 1vw)'}}>
                  <div>Game ID: <span>{gameId}</span></div>
                  <div>Format: <span>{gameFormat}</span></div>
                  <div>Theme: <span>{gameMode}</span></div>
                  <div>Total game time: <span>{timer}</span> seconds</div>
                </Typography>
            </Box>
          </Box>
          <PrimaryButton label="start game" onClick={() => startGame()} disabled = {disabled}/>
          <SecondaryButton label="quit" onClick={() => history.push('/main')}/>
        </Box>
      );
      }

  return (
    <div>
      {content}
    </div>
  );
}

export default RapidGame;


