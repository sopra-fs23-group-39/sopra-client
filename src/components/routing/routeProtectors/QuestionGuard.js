import {Redirect} from "react-router-dom";
import PropTypes from "prop-types";
import {api, handleError} from "../../../helpers/api";
import {useEffect, useState} from "react";


export const QuestionGuard = props => {
  const { gameId } = props.match.params;
  const [players, setPlayers] = useState(null);
  const userId = parseInt(localStorage.getItem('id'));
  const [isInGame, setIsInGame] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const storage = window.localStorage;
  console.log(storage);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await api.get(`/game/${gameId}`);
        console.log(response.data);
        setPlayers(response.data);
        setIsLoading(false);

      } catch (error) {
        console.error(`Something went wrong while fetching the game players: \n${handleError(error)}`);
        console.error(error);
        alert(`Something went wrong while fetching the game players: \n${handleError(error)}`);
      }
    }

    fetchData();

  }, [gameId]);

  console.log(players);

  useEffect(() => {
    if (players && players.map(player => player.id).includes(userId)) {
      setIsInGame(true);
    }
  }, [players, userId]);

  console.log(isInGame);

  if (isLoading) {
    return <div></div>;
  }

  if (isInGame) {
    return props.children;
  } else {
    return <Redirect to="/main" />;
  }
};

QuestionGuard.propTypes = {
  children: PropTypes.node
};