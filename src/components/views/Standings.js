import BaseContainer from "components/ui/BaseContainer";
import {useHistory, useParams} from 'react-router-dom';
import { useEffect, useState, useRef } from "react";
import {api, handleError} from 'helpers/api';
import 'styles/views/Standings.scss'

function Standings() {
    const {gameId} = useParams();
    const history = useHistory();
    const [currentRanking, setCurrentRanking] = useState([]);
    const [totalRanking, setTotalRanking] = useState([]);

    const timeoutRef = useRef(null);
    const [questionAmount, setQuestionAmount] = useState();
    const [currentRound, setCurrentRound] = useState();

    useEffect(() => {
        async function fetchCurrentRanking() {
            try {
                const response = await api.get(`/game/${gameId}/currentRanking`);
                setCurrentRanking(response.data);
                console.log("Fetched currentRanking:");
                console.log(response.data);
            } catch (error) {
                alert(`Something went wrong while fetching the current ranking: \n${handleError(error)}`);
            }
        }

        fetchCurrentRanking();

    }, []);

    useEffect(() => {
        async function fetchTotalRanking() {
            try {
                const response = await api.get(`/game/${gameId}/totalRanking`);
                setTotalRanking(response.data);
                /*console.log("Fetched totalRanking:");
                console.log(response.data);*/
            } catch (error) {
                alert(`Something went wrong while fetching the total ranking: \n${handleError(error)}`);
            }
        }

        fetchTotalRanking();

    }, []);

    useEffect(() => {
        async function fetchData() {
            try {
            const response = await api.get(`/game/${gameId}/settings`);
            setQuestionAmount(response.data.questionAmount);
            setCurrentRound(response.data.currentRound);
            console.log(response.data.currentRound);
            console.log(response.data.questionAmount);
            /*console.log('request to:', response.request.responseURL);
            console.log('status code:', response.status);
            console.log('status text:', response.statusText);
            console.log('requested data:', response.data);
            console.log("Game settings:")
            console.log(response);*/

        } catch (error) {
            console.error(`Something went wrong while fetching the game settings: \n${handleError(error)}`);
            console.error("Details:", error);
            alert("Something went wrong while fetching the game settings! See the console for details.");
        }
    }

    fetchData();
}, []);

    useEffect(async () => {
        try {
            const response = await api.get(`/game/${gameId}/settings`);
            if (response.data.questionAmount === response.data.currentRound) {
                timeoutRef.current = setTimeout(() => {
                    history.push(`/game/${gameId}/winner`);
                }, 6000);
            } else {
                timeoutRef.current = setTimeout(() => {
                    history.push(`/game/${gameId}/question`);
                }, 6000);
            }
        } catch (error) {
            alert(`Something went wrong during game navigation: \n${handleError(error)}`);
        }

        // return () => {
        //     clearTimeout(timeoutRef.current);
        // };
    }, [history, gameId]);

    return (
        <BaseContainer>
            <div className="correct Answer">
                <h1>Standings:</h1>
             </div>
             <div className="This rounds ranking">
                <h1>This round's ranking:</h1>
                <ol>
                    {currentRanking.map((player) => (
                      <li key={player.id}>
                        {player.username} - {player.currentPoints}
                      </li>
                    ))}
                </ol>
            </div>
            <div className="Total Ranking">
                <h1>Total ranking:</h1>
                <ol>
                    {totalRanking.map((player) => (
                      <li key={player.id}>
                          {player.username} - {player.totalPointsCurrentGame}
                      </li>
                    ))}
                </ol>
            </div>
        </BaseContainer>
    );
}

export default Standings;