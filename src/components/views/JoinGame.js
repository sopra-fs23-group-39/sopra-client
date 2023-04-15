import {Button} from 'components/ui/Button';
import {useHistory} from 'react-router-dom';
import BaseContainer from "components/ui/BaseContainer";
import "styles/views/Join.scss";


const JoinGame = () => {
    const history = useHistory();

    return (
        <BaseContainer>
            <div className="join container">
                <div className="join form">
                    <h1 style={{textAlign: "center"}}>The Movie Monster</h1>
                    <div className="join button-container">
                        <Button
                            width="100%"
                            style={{marginTop: 350}}
                            onClick={() => history.push("/waiting_room_participant")}
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
