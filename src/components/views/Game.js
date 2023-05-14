import {useEffect, useState} from 'react'; //api,
import {Spinner} from 'components/ui/Spinner';
import {Button} from 'components/ui/Button';
import {useHistory, useParams} from 'react-router-dom';
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import "styles/views/Game.scss";
import {Stomp} from "@stomp/stompjs";
import SockJS from "sockjs-client";
import {api, handleError} from "../../helpers/api";
import  { useDispatch} from "react-redux";
import {setGameStompClient, setGameId} from "../../gameSlice";

const Player = ({user}) => (
    <div className="player container">
        <div className="player username">{user.username}</div>
        <div className="player name">{user.name}</div>
        <div className="player id">id: {user.id}</div>
    </div>
);

Player.propTypes = {
    user: PropTypes.object
};

const Game = () => {
    const dispatch = useDispatch();

    // use react-router-dom's hook to access the history
    const history = useHistory();
    const [playerList, setPlayerList] = useState(null);
    // const [game, setGame] = useState(null);
    const [gameMode, setGameMode] = useState(null);
    const [questionAmount, setAmountOfQuestions] = useState(null);
    const [timer, setTimer] = useState(null);
    const [gameStompClient, setGameStompClientLocal] = useState(null)
    const [disabled, setDisabled] = useState(false);

    // define a state variable (using the state hook).
    // if this variable changes, the component will re-render, but the variable will
    // keep its value throughout render cycles.
    // a component can have as many state variables as you like.
    // more information can be found under https://reactjs.org/docs/hooks-state.html
    //const [hostId, setHostId] = useState(null);

    const {gameId} = useParams();
    const startGame = async () => {
        if(gameStompClient && gameStompClient.connected){
            gameStompClient.send(`/app/game/${gameId}`, {}, "START");
            setDisabled(true);
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
                setAmountOfQuestions(response.data.questionAmount)
                setTimer(response.data.timer)
            } catch (error) {
                console.error(`Something went wrong while fetching the game settings: \n${handleError(error)}`);
                console.error(error);
                alert(`Something went wrong while fetching the game settings: \n${handleError(error)}`);
            }
        }

        fetchData();

         //const socket = new SockJS(`http:localhost:8080/game/${gameId}`);

        const socket = new SockJS(`http://sopra-fs23-group-39-server.oa.r.appspot.com/game/${gameId}`);


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
                console.log(localStorage.getItem("id"))
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
                <h2> Waiting Room </h2>
                <div>Game ID: {gameId}
                    <div>Theme: {gameMode}</div>
                    <div>Number of questions: {questionAmount}</div>
                    <div>Time to answer question: {timer}</div>
                </div>
                <div>
                    {playerList ? (
                        <div>
                            <h2>Host:</h2>
                            <p key={playerList[0].id}>{playerList[0].username}</p>
                            <h2>Players:</h2>
                            {playerList.slice(1).map((player) => (
                                <p key={player.id}>{player.username}</p>
                            ))}
                        </div>
                    ) : (
                        <p>Loading player list...</p>
                    )}
                </div>
                <Button
                    width="100%"
                    onClick={() => startGame()}
                    //do not put !==, != is intentional since one of them is a string, the other isn't, but as long as the number is equal it should return true.
                    style={{ display: (!playerList || playerList[0].id != localStorage.getItem('id')) ? 'none' : 'block' }}
                    disabled = {disabled}
                >
                    Start Game
                </Button>
                <Button
                    width="100%"
                    style={{marginTop: 20}}
                    onClick={() => history.push('/main')}
                >
                    Quit
                </Button>
            </div>
        </div>
        );
    }

    return (
        <BaseContainer>
            {content}
        </BaseContainer>
    );
}

export default Game;


