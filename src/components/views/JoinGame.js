//import {Button} from 'components/ui/Button';
import {useHistory} from 'react-router-dom';
import "styles/views/JoinGame.scss";
import {useState} from "react";
import {api, handleError} from "../../helpers/api";
import { ThemeProvider } from '@mui/material/styles';
import theme from 'styles/mui/customMui';
import PrimaryButton from 'styles/mui/PrimaryButton';
import SecondaryButton from 'styles/mui/SecondaryButton';
import {Box, FormControl, InputLabel, OutlinedInput} from '@mui/material';


const JoinGame = () => {
  const history = useHistory();
  const [toJoinId, setToJoinId] = useState(null);
  const [isStarted, setIsStarted] = useState(null)
  const doJoin = async () => {
        try{
            const requestBody = JSON.stringify(localStorage.getItem('id'));
            const response = await api.get(`game/${toJoinId}/settings`);
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
    <ThemeProvider theme={theme}>
      <Box className="box">
        <Box>
          <div>
            To join a game, please enter its ID:
          </div>
        </Box>
          <FormControl sx={{ m: 1, display:"flex", width:"90%" }} variant="outlined">
            <InputLabel
              htmlFor="outlined-join"
              sx={{ color: theme.palette.primary.light }}
            >
                Game ID
            </InputLabel>
            <OutlinedInput
              id="outlined-join"
              label="Game ID"
              value={toJoinId}
              onChange={(event) => setToJoinId(event.target.value)}
              margin="dense"
              sx={{
                '& fieldset': {
                  borderColor: theme.palette.primary.light,
                },
                '& input': {
                  color: theme.palette.primary.light,
                },
              }}
            />
          </FormControl>
          <PrimaryButton label="join game" onClick={() => doJoin()}/>
          <SecondaryButton label="back" onClick={() => history.push("/main")}/>
      </Box>
    </ThemeProvider>
    /*<div className="join container">
      <div className="join form">
        <div className="join elements">
          <h1 style={{textAlign: "center"}}>JOIN GAME</h1>
          <div className="join inputs">
            <p className="join text" >To join a game, please enter its ID:</p>
            <input
              className="join input"
              onKeyDown = {(event) => {
                if(!/[0-9]/.test(event.key) && event.target.value === '') {
                  event.preventDefault();
                }
              }}
              type="text"
              placeholder="enter a game ID"
              onChange={(event) => setToJoinId(event.target.value)}
              name="Game ID"
              value={toJoinId}
            />
          </div>
        </div>
        <div className="join buttons">
          <Button
              disabled={!toJoinId}
              width="100%"
              onClick={() => doJoin()}
          >
            JOIN GAME
          </Button>
          <Button
            style={{marginTop: 20}}
            width="100%"
            onClick={() => history.push("/main")}
          >
            BACK
          </Button>
        </div>
      </div>
    </div>*/
  );
}

export default JoinGame;