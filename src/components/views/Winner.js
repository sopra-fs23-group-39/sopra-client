import 'styles/views/Winner.scss';
import {useHistory, useParams} from 'react-router-dom';
import BaseContainer from 'components/ui/BaseContainer';
import { useEffect, useState, useRef } from "react";
import {api, handleError} from 'helpers/api';
import {Button} from 'components/ui/Button';


const Winner = () => {
    const {gameId} = useParams();
    const history = useHistory();
    const [winner, setWinner] = useState(null);


    useEffect(() => {
        async function fetchWinner() {
            try {
                const response = await api.get(`/game/${gameId}/winner`);
                setWinner(response.data);
                console.log("Fetched winner:");
                console.log(response.data);
            } catch (error) {
                alert(`Something went wrong while fetching the winner: \n${handleError(error)}`);
            }
        }

        fetchWinner();

    }, [gameId]);

    const goToMain = async () => {
        try {
            history.push('/main')
        } catch (error) {
            alert(`Something went wrong during returning to Main page: \n${handleError(error)}`);
        }
    };
    return (
        <BaseContainer>
            <div>
                {winner && (
                    <h1>
                        The Winner is {winner.username} with {winner.totalPointsCurrentGame} points!
                    </h1>
                 )}
            </div>
            <div className="main button-container">
            <Button
              width="100%"
              onClick={() => goToMain()}
            >
              Go to Main Page
            </Button>
          </div>
        </BaseContainer>
    );

}


export default Winner;

