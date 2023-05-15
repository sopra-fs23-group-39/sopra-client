import {useEffect, useState} from 'react';
import {api, handleError} from 'helpers/api';
//import {Button} from 'components/ui/Button';
import {useHistory} from 'react-router-dom';
import BaseContainer from "components/ui/BaseContainer";
import "styles/views/Main.scss";
import React from 'react';
import {useSelector} from "react-redux";
import {Box, Button} from '@mui/material';
import PrimaryButton from 'styles/mui/Button';
import SecondaryButton from 'styles/mui/SecondaryButton';


const Main = () => {
    const history = useHistory();
    const [currentId, setCurrentId] = useState(null);
    const gameStompClient = useSelector(state => state.gameStompClient);
    const gameId = useSelector(state => state.gameId);


    const logout = async () => {
        try {
            await api.post('/users/logout', localStorage.getItem('id'))
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
        if (gameStompClient && gameStompClient.connected){
            const playerId = localStorage.getItem('id');
            gameStompClient.send(`/app/game/${gameId}`, {}, `DISCONNECT ${playerId}`);
            gameStompClient.disconnect();
        }
    }, [gameId]);

    return (
        <Box className="box">
            <PrimaryButton label="create game" onClick={() => history.push('/game_selection')}/>
            <PrimaryButton label="join game" onClick={() => history.push("/join")}/>
            <PrimaryButton label="leaderboard" onClick={() => history.push("/leaderboard")}/>
            <PrimaryButton label="profile" onClick={() => history.push("/profile/" + currentId)}/>
            <Box className="row"  sx={{ marginTop: 5 }}>
                <SecondaryButton label="logout" onClick={() => logout()}/>
            </Box>
        </Box>
        /*<BaseContainer>
            <div className="main container">
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
                            onClick={() => history.push("/join")}
                        >
                            Join Game
                        </Button>
                    </div>
                    <div className="profile button-container">
                        <Button
                            width="100%"
                            style={{marginTop: 20}}
                            onClick={() => history.push("/leaderboard")}
                        >
                            Leaderboard
                        </Button>
                    </div>
                    <div className="profile button-container">
                        <Button
                            width="100%"
                            style={{marginTop: 20}}
                            onClick={() => history.push("/profile/" + currentId)}
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
    </BaseContainer>*/
    );
}

export default Main;