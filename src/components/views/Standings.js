import BaseContainer from "components/ui/BaseContainer";
import {useHistory} from 'react-router-dom';
import { useEffect, useState } from "react";
import {api, handleError} from 'helpers/api';
import 'styles/views/Standings.scss'

const Standings = async () => {

    const lobbyId = localStorage.getItem("lobbyId");
    const gameId = lobbyId;
    const history = useHistory();
    const [currentRanking, setCurrentRanking] = useState([]);
    const [totalRanking, setTotalRanking] = useState([]);

    //const correctAnswer = await api.get(`/game/questions/${lobbyId}`);
    const correctAnswer = "Placeholder";
    
    const fetchCurrentRanking = async () => {
        try {
          const response = await api.get(`/lobbies/${lobbyId}/currentRanking`);
          setCurrentRanking(response.data.currentRanking);
        } catch (error) {
          alert(`Something went wrong while fetching the current ranking: \n${handleError(error)}`);
        }
      }
      

    const fetchTotalRanking = async () => {
        try {
          const response = await api.get(`/lobbies/${lobbyId}/totalRanking`);
          setTotalRanking(response.data.totalRanking);
        } catch (error) {
          alert(`Something went wrong while fetching the total ranking: \n${handleError(error)}`);
        }
      }

    useEffect(() => {
        fetchCurrentRanking();
        fetchTotalRanking();
    }, []);

    const response = await api.get(`/game/${gameId}/settings`);
    const { questionAmount, currentRound } = response.data;

    try {
        if (questionAmount !== currentRound) {
          setTimeout(() => {
            history.push(`/game/${gameId}/question`);
          }, 6000); // Wait for 6 seconds before routing to game question page
        } else {
          setTimeout(() => {
            history.push('/main');
          }, 6000); // Wait for 6 seconds before routing to main page
        }
      } catch (error) {
        alert(`Something went wrong during game navigation: \n${handleError(error)}`);
      }

    return (
        <BaseContainer>
            <div className="correct Answer">
                <h1>Solution:</h1>
                <p>The correct Answer is: {correctAnswer} </p>
             </div>
             <div className="This rounds ranking">
                <h1>This rounds ranking:</h1>
                <ul>
                    {currentRanking.map((player, index) => (
                        <ul>
                        .sort((a, b) => b.currentPoints - a.currentPoints)
                        .map((player, index) => (
                          <li key={index}>
                            {player.username} - {player.currentPoints}
                          </li>
                        ))}
                    </ul>
                    ))}
                </ul>
            </div>
            <div className="Total Ranking">
                <h1>Total Ranking:</h1>
                <ul>
                    {totalRanking.map((player, index) => (
                        <ul>
                        {totalRanking
                        .sort((a, b) => b.totalPoints - a.totalPoints)
                        .map((player, index) => (
                          <li key={index}>
                            {player.username} - {player.totalPoints}
                          </li>
                        ))}
                    </ul>
                    ))}
                </ul>
            </div>
        </BaseContainer>
            
    );
};

export default Standings;