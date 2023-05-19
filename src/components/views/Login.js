import React, {useState} from 'react';
import {api, handleError} from 'helpers/api';
import User from 'models/User';
import {useHistory} from 'react-router-dom';
//import {Button} from 'components/ui/Button';
import 'styles/views/Login.scss';
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
//import {doRegistration} from "Register.js"
import { Box, TextField } from '@mui/material';
import {Button, Container, FormControl, InputAdornment, InputLabel, IconButton, OutlinedInput } from '@mui/material';
import {Visibility, VisibilityOff} from '@mui/icons-material'
import { ThemeProvider, useTheme } from '@mui/material/styles';

import 'styles/mui/Button.scss';
import PasswordInput from 'styles/mui/PasswordInput';
import PrimaryButton from 'styles/mui/PrimaryButton';
import SecondaryButton from 'styles/mui/SecondaryButton';
import theme from 'styles/mui/customMui';
import "styles/mui/ResponsiveUI.scss";



/*
It is possible to add multiple components inside a single file,
however be sure not to clutter your files with an endless amount!
As a rule of thumb, use one file per component and only add small,
specific components that belong to the main one in the same file.
 */
const FormField = props => {
  return (
    <div className="login field">
      <label className="login label">
        {props.label}
      </label>
      <input
        className="login input"
        placeholder="enter here.."
        value={props.value}
        onChange={e => props.onChange(e.target.value)}
      />
    </div>
  );
};

FormField.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func
};


const Login = props => {

  
  const history = useHistory();
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  const doLogin = async () => {
    try {
      const requestBody = JSON.stringify({username, password});
      
      
      const response = await api.post('/login', requestBody);



      // Check if userdata is the same like from an available user
      
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
        <FormControl sx={{ m: 1, width: '60ch' }} variant="outlined">
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
          <PrimaryButton label="login" onClick={() => doLogin()} />
          <SecondaryButton label="register" onClick={() => goToRegistration()} />
        {/*</Box>*/}
      </Box>
    </ThemeProvider>
    /*<BaseContainer>
      <div className="login container">
        <div className="login form">
          <FormField
            label="Username"
            value={username}
            onChange={un => setUsername(un)}
          />
         
          <FormField
            label="password"
            value={password}
            onChange= { p => setPassword(p)}
          />
          
          <div className="login button-container">
            <Button
              width="100%"
              onClick={() => doLogin()}
            >
              Login
            </Button>
          </div>
          <div className="login button-container">
            <Button
              width="100%"
              onClick={() => goToRegistration()}
            >
              Register
            </Button>
          </div>
        </div>
      </div>
    </BaseContainer>*/
  );
};

/**
 * You can get access to the history object's properties via the withRouter.
 * withRouter will pass updated match, location, and history props to the wrapped component whenever it renders.
 */
export default Login;
