import {useEffect, useState} from 'react'; //api,
import {Spinner} from 'components/ui/Spinner';
import {useHistory, useParams} from 'react-router-dom';
import "styles/views/Game.scss";
import {Stomp} from "@stomp/stompjs";
import SockJS from "sockjs-client";
import {api, handleError} from "../../helpers/api";
import {useDispatch} from "react-redux";
import {setGameStompClient, setGameId} from "../../gameSlice";
import PrimaryButton from 'styles/mui/PrimaryButton';
import SecondaryButton from 'styles/mui/SecondaryButton';
import theme from 'styles/mui/customMui';
import "styles/mui/ResponsiveUI.scss";
import { Box, Typography } from '@mui/material';

const Game = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [playerList, setPlayerList] = useState(null);
  const [gameMode, setGameMode] = useState(null);
  const [gameFormat, setGameFormat] = useState(null);
  const [questionAmount, setAmountOfQuestions] = useState(null);
  const [timer, setTimer] = useState(null);
  const [gameStompClient, setGameStompClientLocal] = useState(null)
  const [disabled, setDisabled] = useState(false);
  const [isStarted, setIsStarted] = useState(false);
  const {gameId} = useParams();
  const websocketURL = process.env.NODE_ENV === 'development'
      ? process.env.REACT_APP_WEBSOCKET_URL_DEV
      : process.env.REACT_APP_WEBSOCKET_URL_PROD;
  console.log(process.env.NODE_ENV);

  const startGame = async () => {
    if (gameStompClient?.connected) {
      gameStompClient.send(`/app/game/${gameId}`, {}, "START");
      setDisabled(true);
      setIsStarted(true);
    } else {
      //idk put error and kick or smth
    }
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await api.get(`/game/${gameId}/settings`);
        console.log(response.data)
        setGameMode(response.data.gameMode)
        setGameFormat(response.data.gameFormat)
        setAmountOfQuestions(response.data.questionAmount)
        setTimer(response.data.timer)
        setIsStarted(response.data.isStarted)
      } catch (error) {
        console.error(`Something went wrong while fetching the game settings: \n${handleError(error)}`);
        console.error(error);
        alert(`Something went wrong while fetching the game settings: \n${handleError(error)}`);
      }
    }

    fetchData();

    //const socket = new SockJS(`http:localhost:8080/game/${gameId}`);

    //const socket = new SockJS(`http://sopra-fs23-group-39-server.oa.r.appspot.com/game/${gameId}`);
    const socket = new SockJS(`${websocketURL}/game/${gameId}`);
    console.log(`${websocketURL}/game/${gameId}`);

    const gameStompClient = Stomp.over(() => socket);

    setGameStompClientLocal(gameStompClient);
    dispatch(setGameStompClient(gameStompClient));
    dispatch(setGameId(gameId));

    gameStompClient.connect({}, () => {
      gameStompClient.subscribe(`/topic/game/${gameId}`, (message) => {
        if(message.body == "game started."){
          history.push(`/game/${gameId}/question`);
        }
        console.log(message);
        const players = JSON.parse(message.body);
        setPlayerList(players);
        console.log("host id" + playerList[0].id);
        console.log(localStorage.getItem("id"));
      })
      gameStompClient.send(`/app/game/${gameId}`, {}, "SUBSCRIBE");

    });

  }, [dispatch, gameId]);

  let content = <Spinner/>;

  if (gameId) {
    content = (
      <Box className="box">
        <Box sx={{display: "flex", flexDirection: "row" }}>
          <Box sx={{display: "flex", flexDirection: "column", marginRight: "5%", textAlign: "left"}}>
            <Typography variant='h7' color={theme.palette.primary.light} sx={{display: "flex", flexDirection:"column", fontSize: 'calc(0.4rem + 2vw)', marginBottom: 2}}>
              Game:
            </Typography>
              <Typography color={theme.palette.primary.light} sx={{display: "flex", flexDirection:"column", fontSize: 'calc(0.3rem + 1vw)'}}>
                <div>Game ID: <span>{gameId}</span></div>
                <div>Format: <span>{gameFormat}</span></div>
                <div>Theme: <span>{gameMode}</span></div>
                <div>Number of questions: <span>{questionAmount}</span></div>
                <div>Time per question: <span>{timer}</span> seconds</div>
              </Typography>
          </Box>
          <Box sx={{display: "flex", flexDirection: "column", marginLeft:"5%", textAlign: "left"}}>
            <Typography variant='h7' color={theme.palette.primary.light} sx={{display: "flex", flexDirection:"column", fontSize: 'calc(0.4rem + 2vw)', marginBottom: 2}} >
              Participants:
            </Typography>
              <Typography color={theme.palette.primary.light} sx={{display: "flex", flexDirection:"column", fontSize: 'calc(0.3rem + 1vw)'}} >
              {playerList ? (
                <Box color={theme.palette.primary.light} sx={{display:"flex", flexDirection: "column"}}>
                  <div key={playerList[0].id}><span>Host:</span> {playerList[0].username}</div>
                  {playerList.slice(1).map((player) => (
                      <div key={player.id}><span>Player:</span> {player.username}</div>
                  ))}
                </Box>
                ) : (
                  <div>Loading player list...</div>
                )}
              </Typography>
          </Box>
        </Box>
        {
          (!playerList || playerList[0].id != localStorage.getItem('id')) ? (
            <PrimaryButton label="start game" onClick={() => startGame()} disabled = {true}/>
          ):(<PrimaryButton label="start game" onClick={() => startGame()} disabled = {disabled}/>)
        }
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

export default Game;
