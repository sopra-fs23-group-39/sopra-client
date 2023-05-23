import {useEffect, useState} from 'react';
import {api, handleError} from 'helpers/api';
import {useHistory} from 'react-router-dom';
import "styles/views/Main.scss";
import {useSelector} from "react-redux";
import {Box} from '@mui/material';
import PrimaryButton from 'styles/mui/PrimaryButton';
import SecondaryButton from 'styles/mui/SecondaryButton';


const Main = () => {
  const history = useHistory();
  const [currentId, setCurrentId] = useState(null);
  const gameStompClient = useSelector(state => state.gameStompClient);
  const gameId = useSelector(state => state.gameId);

  const logout = async () => {
    try {
      await api.put('/users/logout', localStorage.getItem('id'))
      localStorage.removeItem('id');
      history.push('/login');
    } catch (error) {
      localStorage.removeItem('id');
      history.push('/login');
      alert(`Something went wrong during logout: \n${handleError(error)}`);
    }
  }

  useEffect(() => {
    try {
      setCurrentId(localStorage.getItem("id"))
      api.put('/game/resetIfBackOnMain', localStorage.getItem('id'));

    } catch (error) {
      alert(`Something went wrong while getting the user id: \n${handleError(error)}`);
    }
    console.log(gameStompClient);
    if (gameStompClient?.connected){
      const playerId = localStorage.getItem('id');
      gameStompClient.send(`/app/game/${gameId}`, {}, `DISCONNECT ${playerId}`);
      gameStompClient.disconnect();
    }
  }, [gameId]);

  return (
    <Box className="box">
      <PrimaryButton label="create game" onClick={() => history.push('/game_format')}/>
      <PrimaryButton label="join game" onClick={() => history.push("/join")}/>
      <PrimaryButton label="leaderboard" onClick={() => history.push("/leaderboard")}/>
      <PrimaryButton label="profile" onClick={() => history.push("/profile/" + currentId)}/>
      <Box className="row"  sx={{ marginTop: 5 }}>
        <SecondaryButton label="logout" onClick={() => logout()}/>
      </Box>
    </Box>
  );
}

export default Main;
