import React, {useEffect, useState} from 'react'; //api,
import {Spinner} from 'components/ui/Spinner';
import {useHistory, useParams} from 'react-router-dom';
import {Stomp} from "@stomp/stompjs";
import SockJS from "sockjs-client";
import {api, handleError} from "../../../helpers/api";
import {useDispatch} from "react-redux";
import {setGameStompClient, setGameId} from "../../../gameSlice";
import PrimaryButton from 'components/ui/PrimaryButton';
import SecondaryButton from 'components/ui/SecondaryButton';
import theme from 'components/ui/customMui';
import "styles/ResponsiveUI.scss";
import { Box, Typography } from '@mui/material';
import customChip from "../../ui/CustomChip";
import CustomChip from "../../ui/CustomChip";

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
        <Box className="outer" sx={{display: "flex", flexDirection: "row", justifyContent: 'center', width:'100%', marginBottom:"1%" }}>
          <Box sx={{display: "flex", flexDirection: "column", textAlign: "left", width: "30%", pr:"2.5%"}}>
            <Typography variant='h7' color={theme.palette.primary.light} sx={{display: "flex", flexDirection:"column", fontSize: '2rem', marginBottom: 2}}>
              Game:
            </Typography>
              <Typography color={theme.palette.primary.light} sx={{display: "flex", flexDirection:"column", fontSize: '1.1rem'}}>
                <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'left',
                    }}
                >
                  <div>
                    Game ID:
                  </div>
                  <div>
                    <CustomChip
                        label={gameId}
                        color={theme.palette.primary.light}
                        sx={{
                          borderColor: theme.palette.primary.light,
                          width: '100px',
                          color: theme.palette.primary.light,
                          borderRadius: '4px',
                          borderWidth: '1px',
                          fontSize: '1rem',
                          py: '0px',
                          px: '0px',
                        }}
                    />
                  </div>
                </div>
                <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginTop: '10px'
                    }}
                >
                  <div>
                    Format:
                  </div>
                  <div>
                    <CustomChip
                        label={gameFormat}
                        color={theme.palette.primary.light}
                        sx={{
                          borderColor: theme.palette.primary.light,
                          width: '100px',
                          color: theme.palette.primary.light,
                          borderRadius: '4px',
                          borderWidth: '1px',
                          fontSize: '1rem',
                          py: '0px',
                          px: '0px',
                        }}
                    />
                  </div>
                </div>
                <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginTop: '10px'
                    }}
                >
                  <div>
                    Theme:
                  </div>
                  <div>
                    <CustomChip
                        label={gameMode}
                        color={theme.palette.primary.light}
                        sx={{
                          borderColor: theme.palette.primary.light,
                          width: '100px',
                          color: theme.palette.primary.light,
                          borderRadius: '4px',
                          borderWidth: '1px',
                          fontSize: '1rem',
                          py: '0px',
                          px: '0px',
                        }}
                    />
                  </div>
                </div>
                <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginTop: '10px'
                    }}
                >
                  <div>
                    Number of questions:
                  </div>
                  <div>
                    <CustomChip
                        label={questionAmount}
                        color={theme.palette.primary.light}
                        sx={{
                          borderColor: theme.palette.primary.light,
                          width: '100px',
                          color: theme.palette.primary.light,
                          borderRadius: '4px',
                          borderWidth: '1px',
                          fontSize: '1rem',
                          py: '0px',
                          px: '0px',
                        }}
                    />
                  </div>
                </div>
                <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginTop: '10px'
                    }}
                >
                  <div>
                    Seconds per question:
                  </div>
                  <div>
                    <CustomChip
                        label={timer}
                        color={theme.palette.primary.light}
                        sx={{
                          borderColor: theme.palette.primary.light,
                          width: '100px',
                          color: theme.palette.primary.light,
                          borderRadius: '4px',
                          borderWidth: '1px',
                          fontSize: '1rem',
                          py: '0px',
                          px: '0px',
                        }}
                    />
                  </div>
                </div>
              </Typography>
          </Box>
            <Box sx={{display: "flex", flexDirection: "column", textAlign: "left", mindWidth:"4%" ,width:"4%"}}></Box>
          <Box sx={{display: "flex", flexDirection: "column", textAlign: "left", width: "30%", pl:"2.5%"}}>
            <Typography variant='h7' color={theme.palette.primary.light} sx={{display: "flex", flexDirection:"column", fontSize: '2rem', marginBottom: 2}} >
              Participants:
            </Typography>
              <Typography color={theme.palette.primary.light} sx={{display: "flex", flexDirection:"column", fontSize: '1.1rem'}} >
              {playerList ? (
                <Box color={theme.palette.primary.light} sx={{display:"flex", flexDirection: "column"}}>
                  <div key={playerList[0].id} style={{display: "flex", justifyContent: 'space-between'}}><span>Host:</span> {playerList[0].username}</div>
                  {playerList.slice(1).map((player) => (
                      <div key={player.id} style={{display: "flex", justifyContent: 'space-between'}}><span>Player:</span> {player.username}</div>
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
