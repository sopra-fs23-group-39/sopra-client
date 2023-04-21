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
    // use react-router-dom's hook to access the history
    const history = useHistory();
    const [playerList, setPlayerList] = useState(null);
    // const [game, setGame] = useState(null);
    const [gameMode, setGameMode] = useState(null);
    const [questionAmount, setAmountOfQuestions] = useState(null);

    // define a state variable (using the state hook).
    // if this variable changes, the component will re-render, but the variable will
    // keep its value throughout render cycles.
    // a component can have as many state variables as you like.
    // more information can be found under https://reactjs.org/docs/hooks-state.html
    //const [hostId, setHostId] = useState(null);

    const {gameId} = useParams();


    useEffect(() => {
        async function fetchData() {
            try {
                const response = await api.get(`/game/${gameId}/settings`);
                // setGame(response.data);
                console.log(response.data)
                setGameMode(response.data.gameMode)
                setAmountOfQuestions(response.data.questionAmount)


            } catch (error) {
                console.error(`Something went wrong while fetching the game settings: \n${handleError(error)}`);
                console.error(error);
                alert(`Something went wrong while fetching the game settings: \n${handleError(error)}`);
            }
        }

        fetchData();


        // const socket = new SockJS(`http:localhost:8080/game/${gameId}`);
        const socket = new SockJS(`http://sopra-fs23-group-39-server.oa.r.appspot.com:8080/game/${gameId}`, null, {
            transports: ['xhr-polling', 'jsonp-polling']
        });
        const stompClient = Stomp.over(() => socket);

        stompClient.connect({}, () => {
            stompClient.subscribe(`/topic/game/${gameId}`, (message) => {
                const players = JSON.parse(message.body);
                setPlayerList(players);
            })
            stompClient.send(`/app/game/${gameId}`, {}, '');
        });

        return () => {
            stompClient.disconnect();
        };


    }, [gameId]);

    let content = <Spinner/>;

    if (gameId) {
        content = (
            <div className="game">
                <h2> Waiting Room </h2>
                <div>Game ID: {gameId}
                    <div/>
                    <div>Theme: {gameMode}</div>
                    <div>Number of questions: {questionAmount}</div>
                    <div>Time to answer question: </div>
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
                    onClick={() => console.log("start game")}
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
        );
    }

    return (
        <BaseContainer className="game container">
            {content}
        </BaseContainer>
    );
}

export default Game;
