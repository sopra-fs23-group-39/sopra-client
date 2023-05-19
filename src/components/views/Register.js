import React, {useState} from 'react';
import {api, handleError} from 'helpers/api';
import User from 'models/User';
import {useHistory} from 'react-router-dom';
import 'styles/views/Login.scss';
import PropTypes from "prop-types";
import theme from 'styles/mui/customMui';
import { ThemeProvider} from '@mui/material/styles';
import 'styles/mui/Box.scss';
import 'styles/mui/Button.scss';
import {Box, Button, FormControl, InputAdornment, InputLabel, IconButton, OutlinedInput } from '@mui/material';
import {Visibility, VisibilityOff} from '@mui/icons-material'
import { PrimaryButton, SecondaryButton } from 'styles/mui/PrimaryButton';
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

const Register = props => {
    const history = useHistory();
    const [password, setPassword] = useState(null);
    const [username, setUsername] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const handleClickShowPassword = () => {
        setShowPassword((show) => !show);
    }
    const handleMouseDownPassword = (event) => {
        event.preventDefault();
      }
  
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
                <FormControl sx={{ m: 1, width: '60ch' }} variant="outlined">
                    <InputLabel
                        htmlFor="outlined-adornment-password"
                        sx={{ color: theme.palette.primary.light }}
                    >
                        Password
                    </InputLabel>
                    <OutlinedInput
                        id="outlined-adornment-password"
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={p => setPassword(p.target.value)}
                        sx={{
                            '& fieldset': {
                              borderColor: theme.palette.primary.light,
                            },
                            '& input': {
                              color: theme.palette.primary.light,
                            },
                          }}
                        endAdornment={
                        <InputAdornment position="end">
                            <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPassword}
                            onMouseDown={handleMouseDownPassword}
                            edge="end"
                            sx={{ color: theme.palette.primary.light }}
                            >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                        </InputAdornment>
                        }
                        margin='dense'
                        label="Password"
                        onKeyPress={(event) => {
                            if (event.key === " ") {
                                event.preventDefault();
                            }
                        }}
                    />
                </FormControl>
                  <Box className= "custom">      
                    <Button 
                        sx={{
                            margin: 1,
                            backgroundColor: theme.palette.primary.main,
                            color: theme.palette.primary.text,
                            opacity: !username || !password ? 0.5 : 1,
                            "&:disabled": { 
                                color: theme.palette.primary.text,
                                backgroundColor: theme.palette.primary.main,
                                opacity: 0.5
                            }
                        }}
                        variant="contained"
                        width="100%"
                        disabled={!username || !password}
                        onClick={() => doRegister()}
                        >
                        Register
                    </Button>
                    <Button 
                        sx={{
                            margin: 1,
                            color: theme.palette.primary.main,
                            borderColor: theme.palette.primary.main
                        }}
                        variant="outlined"
                        width="100%"
                        size='small'
                        onClick={() => history.push("/login")}
                    >
                        Back
                    </Button>
                </Box>
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
                        label="Password"
                        value={password}
                        onChange={n => setPassword(n)}
                    />
                    <div className="login button-container">
                        <Button
                            disabled={!username || !password}
                            width="100%"
                            onClick={() => doRegister()}
                        >
                            Register
                        </Button>
                    </div>
                    <div className="login button-container">
                        <Button
                            width="100%"
                            onClick={() => history.push("/login")}
                        >
                            Back
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
export default Register;