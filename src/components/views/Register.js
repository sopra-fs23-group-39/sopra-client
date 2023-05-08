import React, {useState} from 'react';
import {api, handleError} from 'helpers/api';
import User from 'models/User';
import {useHistory} from 'react-router-dom';
//import {Button} from 'components/ui/Button';
import 'styles/views/Login.scss';
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import { Button, Container, FormControl, InputAdornment, InputLabel, IconButton, OutlinedInput } from '@mui/material';
import {Visibility, VisibilityOff} from '@mui/icons-material'


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
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const handleClickShowPassword = () => {
        setShowPassword((show) => !show);
        setPassword('');
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
        <BaseContainer>
            <div className="login container">
                <div className="login form">
                    <FormControl sx={{ m: 1, width: '60ch' }} variant="outlined">
                        <InputLabel htmlFor="outlined-username">Username</InputLabel>
                        <OutlinedInput
                            id="outlined-username"
                            label="Username"
                            value={username}
                            onChange={(un) => setUsername(un.target.value)}
                            margin="dense"
                        />
                    </FormControl>
                    <FormControl sx={{ m: 1, width: '60ch' }} variant="outlined">
                        <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
                        <OutlinedInput
                            id="outlined-adornment-password"
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={p => setPassword(p.target.value)}
                            endAdornment={
                            <InputAdornment position="end">
                                <IconButton
                                aria-label="toggle password visibility"
                                onClick={handleClickShowPassword}
                                onMouseDown={handleMouseDownPassword}
                                edge="end"
                                >
                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                            }
                            margin='dense'
                            label="Password"
                        />
                    </FormControl>
                    <div className="login button-container">
                        <Button
                            disabled={!username || !password}
                            width="100%"
                            onClick={() => doRegister()}
                            variant='contained'
                            
                        >
                            Register
                        </Button>
                    </div>
                    <div className="login button-container">
                        <Button
                            width="100%"
                            onClick={() => history.push("/login")}
                            variant='contained'
                        >
                            Back
                        </Button>
                    </div>
                </div>
            </div>
        </BaseContainer>
    );
};

/**
 * You can get access to the history object's properties via the withRouter.
 * withRouter will pass updated match, location, and history props to the wrapped component whenever it renders.
 */
export default Register;