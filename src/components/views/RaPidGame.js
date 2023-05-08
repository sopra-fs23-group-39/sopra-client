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

const RaPidGame = () => {



    // use react-router-dom's hook to access the history
    const history = useHistory();
    const [playerList, setPlayerList] = useState(null);
    // const [game, setGame] = useState(null);
    const [gameMode, setGameMode] = useState(null);
    const [questionAmount, setAmountOfQuestions] = useState(null);
    const [timer, setTimer] = useState(null);
    //const [gameStompClient, setGameStompClientLocal] = useState(null)
    const [disabled, setDisabled] = useState(false);

    // define a state variable (using the state hook).
    // if this variable changes, the component will re-render, but the variable will
    // keep its value throughout render cycles.
    // a component can have as many state variables as you like.
    // more information can be found under https://reactjs.org/docs/hooks-state.html
    //const [hostId, setHostId] = useState(null);

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


    });

    let content = <Spinner/>;

    if (gameId) {
        content = (
            <div className="game container">
                <div className="game form">
                <h2> Waiting Room </h2>
                <div>Game ID: {gameId}
                    <div>Theme: {gameMode}</div>
                    <div>Game time: {timer}</div>
                </div>
                {/*<div>
                     <h2>Player:</h2>
                </div>*/}
                <Button
                    width="100%"
                    onClick={() => startGame()}
                    //do not put !==, != is intentional since one of them is a string, the other isn't, but as long as the number is equal it should return true.
                    //style={{ display: (!playerList || playerList[0].id != localStorage.getItem('id')) ? 'none' : 'block' }}
                    style = {{marginTop:20}}
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

export default RaPidGame;


