import {useEffect, useState} from 'react'; //api,
import {Spinner} from 'components/ui/Spinner';
import {Button} from 'components/ui/Button';
import {useHistory, useParams} from 'react-router-dom';
import "styles/views/Game.scss";
import {Stomp} from "@stomp/stompjs";
import SockJS from "sockjs-client";
import {api, handleError} from "../../helpers/api";
import {useDispatch} from "react-redux";
import {setGameStompClient, setGameId} from "../../gameSlice";

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

  const startGame = async () => {
    if(gameStompClient && gameStompClient.connected){
        gameStompClient.send(`/app/game/${gameId}`, {}, "START");
        setDisabled(true);
        setIsStarted(true);
    } else {
        //idk put error and kick or smth
    }
  };

  const quickTest = async () => {
    if(gameStompClient && gameStompClient.connected){
        console.log("send?")
    } else {
        //idk put error and kick or smth
    }
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await api.get(`/game/${gameId}/settings`);
        // setGame(response.data);
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

    const socket = new SockJS(`http:localhost:8080/game/${gameId}`);

    //const socket = new SockJS(`http://sopra-fs23-group-39-server.oa.r.appspot.com/game/${gameId}`);

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
      console.log("before sending CONNECT");
      gameStompClient.send(`/app/game/${gameId}`, {}, "SUBSCRIBE");
      console.log("after sending CONNECT");
    });

  }, [dispatch, gameId]);

  let content = <Spinner/>;

  if (gameId) {
    content = (
      <div className="game container">
        <div className="game form">
          <div className="game elements">
            <h1 style={{textAlign: "center"}}> WAITING ROOM </h1>
            <div className="game content">
              <div className="game column">
                <h2>Game settings:</h2>
                <p>Game ID: <span>{gameId}</span></p>
                <p>Format: <span>{gameFormat}</span></p>
                <p>Theme: <span>{gameMode}</span></p>
                <p>Number of questions: <span>{questionAmount}</span></p>
                <p>Time per question: <span>{timer}</span> seconds</p>
              </div>
              <div className="game column">
                <div className="game participants">
                  <h2>Participants:</h2>
                  {playerList ? (
                    <div>
                      <p key={playerList[0].id}><span>Host:</span> {playerList[0].username}</p>
                      {playerList.slice(1).map((player) => (
                          <p key={player.id}><span>Player:</span> {player.username}</p>
                      ))}
                    </div>
                  ) : (
                    <p>Loading player list...</p>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="game buttons">
            <Button
              width="100%"
              onClick={() => startGame()}
              //do not put !==, != is intentional since one of them is a string, the other isn't, but as long as the number is equal it should return true.
              style={{ display: (!playerList || playerList[0].id != localStorage.getItem('id')) ? 'none' : 'block' }}
              disabled = {disabled}
            >
              START GAME
            </Button>
            <Button
              width="100%"
              style={{marginTop: 20}}
              onClick={() => history.push('/main')}
            >
              QUIT
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
        {content}
    </div>
  );
}

export default Game;
