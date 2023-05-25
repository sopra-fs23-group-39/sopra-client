import {useHistory} from 'react-router-dom';
import {useState} from "react";
import {api, handleError} from "../../../helpers/api";
import { ThemeProvider } from '@mui/material/styles';
import theme from 'components/ui/customMui';
import PrimaryButton from 'components/ui/PrimaryButton';
import SecondaryButton from 'components/ui/SecondaryButton';
import {Box, FormControl, InputLabel, OutlinedInput, Typography} from '@mui/material';


const JoinGame = () => {
  const history = useHistory();
  const [toJoinId, setToJoinId] = useState(null);
  const doJoin = async () => {
    try{
      const requestBody = JSON.stringify(localStorage.getItem('id'));
      const response = await api.get(`game/${toJoinId}/settings`);
      if(response.data.isStarted === false){
        if(response.data.players.find(player => player.id == localStorage.getItem('id'))){
          alert(`You can't join a game that you're already in.`)
        }else if(response.data.gameFormat === "RAPID"){
            alert(`Rapid is a single player game mode only`)
        }else {
          await api.put(`/game/${toJoinId}`, requestBody);
          history.push(`/game/${toJoinId}`);
        }
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
          <Typography color={theme.palette.primary.light} sx={{fontSize: "2rem"}}>
            To join a game, please enter its ID:
          </Typography>
        </Box>
          <FormControl sx={{ m: 1, display:"flex", width:"30%" }} variant="outlined">
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
              onKeyDown = {(event) => {
                if(!/\d/.test(event.key) && event.target.value === '') {
                  event.preventDefault();
                }
              }}
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
          <PrimaryButton label="join game" onClick={() => doJoin()} disabled={!toJoinId}/>
          <SecondaryButton label="back" onClick={() => history.push("/main")}/>
      </Box>
    </ThemeProvider>
  );
}

export default JoinGame;