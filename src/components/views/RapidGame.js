import {useEffect, useState} from 'react'; //api,
import {Spinner} from 'components/ui/Spinner';
import {Button} from 'components/ui/Button';
import {useHistory, useParams} from 'react-router-dom';
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import "styles/views/Game.scss";
import {api, handleError} from "../../helpers/api";
import PrimaryButton from 'styles/mui/PrimaryButton';
import SecondaryButton from 'styles/mui/SecondaryButton';
import theme from 'styles/mui/customMui';
import "styles/mui/ResponsiveUI.scss";
import { ThemeProvider} from '@mui/material/styles';
import { Box, Typography } from '@mui/material';


const Player = ({user}) => (
    <div className="player container">
        <div className="player username">{user.username}</div>
        <div className="player name">{user.name}</div>
        <div className="player id">id: {user.id}</div>
    </div>
);

Player.propTypes = {
    user: PropTypes.object
};

const RapidGame = () => {



    // use react-router-dom's hook to access the history
    const history = useHistory();
    const [playerList, setPlayerList] = useState(null);
    // const [game, setGame] = useState(null);
    const [gameMode, setGameMode] = useState(null);
    const [questionAmount, setAmountOfQuestions] = useState(null);
    const [timer, setTimer] = useState(null);
    //const [gameStompClient, setGameStompClientLocal] = useState(null)
    const [disabled, setDisabled] = useState(false);
    const [gameFormat, setGameFormat] = useState(null);

    // define a state variable (using the state hook).
    // if this variable changes, the component will re-render, but the variable will
    // keep its value throughout render cycles.
    // a component can have as many state variables as you like.
    // more information can be found under https://reactjs.org/docs/hooks-state.html
    //const [hostId, setHostId] = useState(null);

    const {gameId} = useParams();
    const startGame = async () => {
            console.log("Before historypush");
            history.push(`/gamerapid/${gameId}/question`);
            console.log("After historypush");
            setDisabled(true);
    };

    useEffect(() => {
        async function fetchData() {
            console.log('Inside useEffect, beginning')
            try {
                const response = await api.get(`/game/${gameId}/settings`);
                // setGame(response.data);
                console.log(response.data)
                setGameMode(response.data.gameMode)
                setAmountOfQuestions(response.data.questionAmount)
                setTimer(response.data.timer)
                setGameFormat(response.data.gameFormat)
            } catch (error) {
                console.error(`Something went wrong while fetching the game settings: \n${handleError(error)}`);
                console.error(error);
                alert(`Something went wrong while fetching the game settings: \n${handleError(error)}`);
            }
        }

        fetchData();
    });

    let content = <Spinner/>;

    if (gameId) {
        content = (
          <Box className="box">
            <Typography sx={{display: "flex", flexDirection:"column", fontSize: 'calc(1.5rem + 2vw)'}} variant="h3" align="center" gutterBottom color={theme.palette.primary.light}>
                 Waiting Room
            </Typography>
            <Box sx={{display: "flex", flexDirection: "row" }}>
              <Box sx={{display: "flex", flexDirection: "column", marginRight: "5%", textAlign: "left"}}>
                <Typography variant='h5' color={theme.palette.primary.light} sx={{display: "flex", flexDirection:"column", fontSize: 'calc(0.4rem + 2vw)'}}>
                  Game Settings:
                </Typography>
                  <Typography color={theme.palette.primary.light} sx={{display: "flex", flexDirection:"column", fontSize: 'calc(0.3rem + 1vw)'}}>
                    <p>Game ID: <span>{gameId}</span></p>
                    <p>Format: <span>{gameFormat}</span></p>
                    <p>Theme: <span>{gameMode}</span></p>
                    <p>GameTime: <span>{timer}</span> seconds</p>
                  </Typography>
              </Box>
            </Box>
            <PrimaryButton label="start game" onClick={() => startGame()} disabled = {disabled}/>
            <SecondaryButton label="quit" onClick={() => history.push('/main')}/>
          </Box>
        );
      }

      return (
        <div>
            {content}
        </div>
      );
    }

export default RapidGame;


