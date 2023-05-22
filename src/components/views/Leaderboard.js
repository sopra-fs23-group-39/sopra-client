import {useHistory} from 'react-router-dom';
import "styles/views/Leaderboard.scss";
import {api, handleError} from "../../helpers/api";
import React, {useEffect, useState} from "react";
import Player from "../ui/Player";
import theme from "../../styles/mui/customMui";
import {Button, Box, Typography} from "@mui/material";
import {ThemeProvider} from "@mui/material/styles";
import {Spinner} from "../ui/Spinner";
import ButtonGroup from '@mui/material/ButtonGroup';
import 'styles/mui/Box.scss';
import 'styles/mui/Button.scss';


const Leaderboard = () => {
    const history = useHistory();
    const [users, setUsers] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [gameFormat, setGameFormat] = useState("CUSTOM");

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await api.get('/users');
                setUsers(response.data);
                setIsLoading(false);
                customLeaderboard();
            } catch (error) {
                console.error(`Something went wrong while fetching the users: \n${handleError(error)}`);
                console.error("Details:", error);
                alert("Something went wrong while fetching the users! See the console for details.");
            }
        }
        fetchData();
    }, []);

    const customLeaderboard = async () => {
        users.sort((a, b) => (a.userRank - b.userRank));
        setGameFormat("CUSTOM")
    };

    const blitzLeaderboard = async () => {
        users.sort((a, b) => (a.blitzRank - b.blitzRank));
        setGameFormat("BLITZ")
    }

    const rapidLeaderboard = async () => {
        users.sort((a, b) => (a.rapidRank - b.rapidRank));
        setGameFormat("RAPID")
    }

    return (<div>
        {isLoading ? <Spinner/> : <ThemeProvider theme={theme}>
            <Box sx={{mt: 10, backgroundColor: 'rgba(0, 0, 0, 0.8)', pt: '20px'}}>
                <Typography variant="h4" align="center" gutterBottom color={theme.palette.primary.light}>
                    Leaderboard
                </Typography>
                <Box
                    sx={{
                        display: 'flex', flexDirection: 'column', alignItems: 'center', '& > *': {
                            m: 1,
                        },
                    }}
                >
                    <ButtonGroup variant="text" aria-label="text button group"
                                 sx={{mt: 2, '& button': {width: '100px'}}}>
                        <Button
                            onClick={() => customLeaderboard()}
                        >
                            Custom
                        </Button>
                        <Button
                            onClick={() => blitzLeaderboard()}
                        >
                            Blitz
                        </Button>
                        <Button
                            onClick={() => rapidLeaderboard()}
                        >
                            Rapid
                        </Button>
                    </ButtonGroup>
                </Box>
                <Box sx={{mt: 1, width: '100%', height: 400, marginRight: '2em', color: theme.palette.primary.light}}>
                    <Typography variant="h6" align="center" gutterBottom color={theme.palette.primary.light}>
                        {gameFormat}
                    </Typography>
                    <Typography>
                        {<hr style={{
                            width: '90%',
                            marginLeft: '2em',
                            borderTop: '0.2px',
                            borderColor: theme.palette.primary.light
                        }}/>}
                    </Typography>
                    <Box sx={{
                        width: '90%',
                        height: 400,
                        minWidth: 670,
                        color: theme.palette.primary.light,
                        overflow: 'auto',
                        marginRight: '2em',
                        marginLeft: '2em',

                        '&::-webkit-scrollbar': {
                            width: '12px',
                        },
                        '&::-webkit-scrollbar-thumb': {
                            backgroundColor: theme.palette.primary.light,
                            borderRadius: '6px',
                        },
                        '&::-webkit-scrollbar-track': {
                            backgroundColor: 'transparent',
                        },
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <Typography style={{ marginLeft: '2em', fontWeight: 'bold', minWidth: 155 }} variant="body1" color={theme.palette.primary.light}>
                                Rank
                            </Typography>
                            <Typography style={{ fontWeight: 'bold', minWidth: 155 }} variant="body1" color={theme.palette.primary.light}>
                                Points
                            </Typography>
                            <Typography style={{ fontWeight: 'bold', minWidth: 155 }} variant="body1" color={theme.palette.primary.light}>
                                Username
                            </Typography>
                        </div>
                        <Typography variant="body1" align="left" gutterBottom sx={{mt: 2}}>
                            {users.map(user => (<div key={user.id} style={{display: 'flex', alignItems: 'center'}}>
                                <span style={{marginLeft: '2em', minWidth: 155}}>
        {gameFormat === 'CUSTOM' ? `${user.userRank}` : gameFormat === 'BLITZ' ? `${user.blitzRank}` : gameFormat === 'RAPID' ? `${user.rapidRank}` : ''}
                                </span>
                                <span style={{minWidth: 155}}>
        {gameFormat === 'CUSTOM' ? `${user.totalPointsAllGames}` : gameFormat === 'BLITZ' ? `${user.totalBlitzPointsAllGames}` : gameFormat === 'RAPID' ? `${user.totalRapidPointsAllGames}` : ''}
                                </span>
                                <Player
                                    user={{
                                        ...user,
                                        username: user.username.length > 20 ? user.username.substring(0, 24) + '...' : user.username,
                                    }}
                                />
                            </div>))}
                        </Typography>
                    </Box>
                    <Typography align="left">
                        {<hr style={{
                            width: '90%',
                            marginLeft: '2em',
                            borderTop: '0.2px',
                            borderColor: theme.palette.primary.light
                        }}/>}
                    </Typography>
                </Box>); <Box className="custom" color="primary">
                <Button
                    sx={{
                        mt: 5, mb: 3, color: theme.palette.primary.light,
                    }}
                    variant="outlined"
                    width="100%"
                    size='large'
                    onClick={() => history.push("/main")}>
                    Back
                </Button>
            </Box>
            </Box>
        </ThemeProvider>}
    </div>)
}

export default Leaderboard;