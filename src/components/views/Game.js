import {useEffect, useState} from 'react'; //api,
import {Spinner} from 'components/ui/Spinner';
import {Button} from 'components/ui/Button';
import {useHistory, useParams} from 'react-router-dom';
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import "styles/views/Game.scss";
import {Stomp} from "@stomp/stompjs";
import SockJS from "sockjs-client";

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


  // define a state variable (using the state hook).
  // if this variable changes, the component will re-render, but the variable will
  // keep its value throughout render cycles.
  // a component can have as many state variables as you like.
  // more information can be found under https://reactjs.org/docs/hooks-state.html
  //const [hostId, setHostId] = useState(null);

  const {gameId} = useParams();
  useEffect(() => {
    const socket = new SockJS(`http:localhost:8080/game/${gameId}`);
    const stompClient = Stomp.over(socket);

    stompClient.connect({}, ()=> {
      stompClient.subscribe(`/topic/game/${gameId}`, (message) =>{
        const players = JSON.parse(message.body);
        setPlayerList(players);
      });
      stompClient.send(`/app/game/${gameId}`, {}, '');
    });
    return () => {
      stompClient.disconnect();
    };
  },[gameId]);


  let content = <Spinner/>;

  if (gameId) {
    content = (
      <div className="game">
        <h1> Game ID: {gameId} </h1>
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
          onClick={() => history.push('/main')}
        >
          Back
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
