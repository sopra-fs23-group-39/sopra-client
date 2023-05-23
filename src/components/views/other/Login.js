import React, {useState} from 'react';
import {api, handleError} from 'helpers/api';
import User from 'models/User';
import {useHistory} from 'react-router-dom';
import {Box, FormControl, InputLabel, OutlinedInput } from '@mui/material';
import {ThemeProvider} from '@mui/material/styles';
import 'styles/Button.scss';
import PasswordInput from 'components/ui/PasswordInput';
import PrimaryButton from 'components/ui/PrimaryButton';
import SecondaryButton from 'components/ui/SecondaryButton';
import theme from 'components/ui/customMui';
import "styles/ResponsiveUI.scss";

/*
It is possible to add multiple components inside a single file,
however be sure not to clutter your files with an endless amount!
As a rule of thumb, use one file per component and only add small,
specific components that belong to the main one in the same file.
 */

const Login = () => {
  const history = useHistory();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  const doLogin = async () => {
    try {
      const requestBody = JSON.stringify({username, password});
      const response = await api.post('/login', requestBody);
      const user = new User(response.data);
      // Store the token into the local storage.
      localStorage.setItem('id', user.id);
      // Login successfully worked --> navigate to the route /game in the GameRouter
      history.push(`/main`);
    } catch (error) {
      alert(`Something went wrong during the login: \n${handleError(error)}`);
    }
  };

  const goToRegistration = async () => {
    history.push(`/register`)
  }

  return (
    <ThemeProvider theme={theme}>
      <Box className="box">
        <FormControl sx={{ m: 1, display:"flex", width:"90%" }} variant="outlined">
          <InputLabel
            htmlFor="outlined-username"
            sx={{ color: theme.palette.primary.light }}
          >
            Username
          </InputLabel>
          <OutlinedInput
            id="outlined-username"
            label="Username"
            value={username}
            onChange={(un) => setUsername(un.target.value)}
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
        <PasswordInput
          label="Password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
        {/*<Box className= "custom" color="primary">  */}
          <PrimaryButton label="login" disabled={!username || !password} onClick={() => doLogin()} />
          <SecondaryButton label="register" onClick={() => goToRegistration()} />
        {/*</Box>*/}
      </Box>
    </ThemeProvider>
  );
};

/**
 * You can get access to the history object's properties via the withRouter.
 * withRouter will pass updated match, location, and history props to the wrapped component whenever it renders.
 */
export default Login;
