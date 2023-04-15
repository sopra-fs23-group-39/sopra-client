import {useEffect, useState} from 'react';
import {api, handleError} from 'helpers/api';
import {Button} from 'components/ui/Button';
import {useHistory} from 'react-router-dom';
import BaseContainer from "components/ui/BaseContainer";
import "styles/views/WaitingRoom.scss";

const WaitingRoomOwner = () => {
    const history = useHistory();
    const [users, setUsers] = useState(null);


    useEffect(() => {
        async function fetchData() {
            try {
                const response = await api.get('/users');
                setUsers(response.data);
            } catch (error) {
                console.error(`Something went wrong while fetching the users: \n${handleError(error)}`);
                console.error("Details:", error);
                alert("Something went wrong while fetching the users! See the console for details.");
            }
        }

        fetchData();
    }, []);

    return (
        <BaseContainer>
            <div className="waiting_room container">
                <div className="waiting_room form">
                    <h1 style={{textAlign: "center"}}>Waiting Room</h1>
                    <div className="start game button-container">
                        <Button
                            width="100%"
                            style={{marginTop: 350}}
                            onClick={() => console.log("start game")}
                        >
                            start game
                        </Button>
                        <Button
                            width="100%"
                            style={{marginTop: 20}}
                            onClick={() => history.push('/main')}
                        >
                            Leave
                        </Button>
                    </div>
                </div>
            </div>
        </BaseContainer>
    );
}

export default WaitingRoomOwner;
