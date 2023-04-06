import {Button} from 'components/ui/Button';
import {useHistory} from 'react-router-dom';
import BaseContainer from "components/ui/BaseContainer";
import "styles/views/Leaderboard.scss";

const Leaderboard = () => {
    const history = useHistory();

    return (
        <BaseContainer>
            <div className="leaderboard container">
                <div className="leaderboard form">
                    <h1 style={{textAlign: "center"}}>The Movie Monster</h1>
                    <div className="leaderboard button-container">
                        <Button
                            width="100%"
                            style={{marginTop: 350}}
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

export default Leaderboard;
