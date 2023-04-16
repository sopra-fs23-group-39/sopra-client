import {useEffect, useState} from 'react'; //api,
import { api, handleError} from 'helpers/api'; //api,
import {Spinner} from 'components/ui/Spinner';
import {Button} from 'components/ui/Button';
import {useHistory, useParams} from 'react-router-dom';
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import "styles/views/Game.scss";

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
  /*useEffect(() => {
    async function connectWithSmallDelay() {
      await new Promise(resolve => setTimeout(resolve, 500));
      const socket = new WebSocket(`ws://localhost:8080/game/${gameId}`);
      socket.addEventListener("open", () =>{
        console.log("Connection to waiting room successful");
      });
      socket.onmessage = function(event) {
        const socketPlayerList = JSON.parse(event.data);
        socket.send("Hello server");
        setPlayerList(socketPlayerList);
      }

      socket.addEventListener("close", () => {
        console.log("WebSocket connection closed.");
      });

      socket.addEventListener("error", (event) => {
        console.error("WebSocket error:", event);
      });
      return () => {
        socket.close();
      }
    }
    connectWithSmallDelay();

  })*/


  /*const logout = () => {
    localStorage.removeItem('token');
    history.push('/login');
  }*/

  // the effect hook can be used to react to change in your component.
  // in this case, the effect hook is only run once, the first time the component is mounted
  // this can be achieved by leaving the second argument an empty array.
  // for more information on the effect hook, please see https://reactjs.org/docs/hooks-effect.html
  useEffect(() => {
    // effect callbacks are synchronous to prevent race conditions. So we put the async function inside:
    async function fetchData() {
      try {
        const response = await api.get(`/game/${gameId}`);
        setPlayerList(response.data);
        console.log(response.data);

      } catch (error) {
        console.error(`Something went wrong while fetching the game info: \n${handleError(error)}`);
        console.error("Details:", error);
        alert("Something went wrong while fetching the game info! See the console for details.");
      }
    }

    fetchData();
  }, [gameId]);

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
