import {useEffect, useState} from 'react';
import {api, handleError} from 'helpers/api';
// import {Spinner} from 'components/ui/Spinner';
import {Button} from 'components/ui/Button';
import {useHistory} from 'react-router-dom';
import BaseContainer from "components/ui/BaseContainer";
// import PropTypes from "prop-types";
import "styles/views/Main.scss";

const Main = () => {
    const history = useHistory();
    const [users, setUsers] = useState(null);

    const logout = async () => {
        localStorage.removeItem('token');
        history.push('/login');
        /*
        try {
            // await api.post('/users/logout', localStorage.getItem('id'))
            localStorage.removeItem('id');
            history.push('/login');
        } catch (error) {
            localStorage.removeItem('id');
            history.push('/login');
            alert(`Something went wrong during logout: \n${handleError(error)}`);
        }
         */
    }

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
            <div className="profile container">
                <div className="main form">
                    <h1 style={{textAlign: "center"}}>The Movie Monster</h1>
                    <div className="profile button-container">
                        <Button
                            width="100%"
                            style={{marginTop: 80}}
                            onClick={() => history.push('/game_selection')}
                        >
                            Create Game
                        </Button>
                    </div>
                    <div className="profile button-container">
                        <Button
                            width="100%"
                            style={{marginTop: 20}}
                        >
                            Join Game
                        </Button>
                    </div>
                    <div className="profile button-container">
                        <Button
                            width="100%"
                            style={{marginTop: 20}}
                        >
                            Leaderboard
                        </Button>
                    </div>
                    <div className="profile button-container">
                        <Button
                            width="100%"
                            style={{marginTop: 20}}
                            onClick={() => history.push("/profile/" + users[0].id)}
                        >
                            Profile
                        </Button>
                    </div>
                    <div className="logout button-container">
                        <Button
                            width="100%"
                            style={{marginTop: 350}}
                            onClick={() => logout()}
                        >
                            Logout
                        </Button>
                    </div>
                </div>
            </div>
        </BaseContainer>
    );
}

export default Main;
