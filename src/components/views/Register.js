import React, {useState} from 'react';
import {api, handleError} from 'helpers/api';
import User from 'models/User';
import {useHistory} from 'react-router-dom';
import 'styles/views/Login.scss';
import theme from 'styles/mui/customMui';
import { ThemeProvider} from '@mui/material/styles';
import 'styles/mui/Box.scss';
import 'styles/mui/Button.scss';
import {Box, FormControl, InputLabel, OutlinedInput } from '@mui/material';
import {PrimaryButton} from 'styles/mui/PrimaryButton';
import PasswordInput from 'styles/mui/PasswordInput';
import SecondaryButton from 'styles/mui/SecondaryButton';
/*
It is possible to add multiple components inside a single file,
however be sure not to clutter your files with an endless amount!
As a rule of thumb, use one file per component and only add small,
specific components that belong to the main one in the same file.
 */

const Register = props => {
  const history = useHistory();
  const [password, setPassword] = useState(null);
  const [username, setUsername] = useState(null);

  const doRegister = async () => {
    try {
      const requestBody = JSON.stringify({username, password});
      const response = await api.post('/users', requestBody);
      // Get the returned user and update a new object.
      const user = new User(response.data);
      // Store the token into the local storage.
      localStorage.setItem('id', user.id);
      // Register successfully worked --> navigate to the route /game in the GameRouter
      history.push(`/main`);
    } catch (error) {
      alert(`Something went wrong during the registration: \n${handleError(error)}`);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Box className="box">
        <FormControl sx={{ m: 1, width: '90%' }} variant="outlined">
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
            onKeyPress={(event) => {
              if (event.key === " ") {
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
        <PasswordInput
          label="Password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
        <Box className= "custom">
          <PrimaryButton label="register" onClick={() => doRegister()} disabled={!username || !password} />
          <SecondaryButton label="back" onClick={() => history.push("/login")} />
        </Box>
      </Box>
    </ThemeProvider>
  );
};

/**
 * You can get access to the history object's properties via the withRouter.
 * withRouter will pass updated match, location, and history props to the wrapped component whenever it renders.
 */
export default Register;