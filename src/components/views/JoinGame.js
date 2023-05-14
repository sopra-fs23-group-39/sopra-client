import {Button} from 'components/ui/Button';
import {useHistory} from 'react-router-dom';
import BaseContainer from "components/ui/BaseContainer";
import "styles/views/Join.scss";
import {useState} from "react";
import {api, handleError} from "../../helpers/api";


const JoinGame = () => {
    const history = useHistory();
    const [toJoinId, setToJoinId] = useState(null);
    const [isStarted, setIsStarted] = useState(null)
    const doJoin = async () => {
        try{
            const requestBody = JSON.stringify(localStorage.getItem('id'));
            const response = await api.get(`game/{toJoinId}/settings`);
            if(response.data.isStarted === false){
                await api.put(`/game/${toJoinId}`, requestBody);
                history.push(`/game/${toJoinId}`);
            }
            else{
                alert(`Game has already started`);
            }

        } catch (error) {
            alert(`Something went wrong trying to join the game: \n${handleError(error)}`);
        }
    }

    return (
        <BaseContainer>
            <div className="join container">
                <div className="join form">
                    <h1 style={{textAlign: "center"}}>The Movie Monster</h1>
                    <div className="gameIdInputField">
                        <input
                            onKeyDown = {(event) => {
                                if(!/[0-9]/.test(event.key)) {
                                    event.preventDefault();
                                }
                        }}
                            type="text"
                            className="gameIdInputField"
                            placeholder="enter a game ID"
                            onChange={(event) => setToJoinId(event.target.value)}
                            value={toJoinId}
                            name="Game ID"
                        />
                    </div>
                    <div className="join button-container">
                        <Button
                            disabled={!toJoinId}
                            width="100%"
                            style={{marginTop: 350}}
                            onClick={() => doJoin()}
                        >
                            join game
                        </Button>
                    </div>
                    <div className="join button-container">
                        <Button
                            width="100%"
                            onClick={() => history.push("/main")}
                        >
                            Back
                        </Button>
                    </div>
                </div>
            </div>
        </BaseContainer>
    );
}

export default JoinGame;