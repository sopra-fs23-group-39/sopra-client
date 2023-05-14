import React, {useEffect, useState} from 'react';
import {useParams, useHistory} from "react-router-dom";
import {api, handleError} from "../../helpers/api";
import PropTypes from "prop-types";
import 'styles/views/ChangeProfile.scss';
import User from "../../models/User";
import {Box} from '@mui/material';
import {Button, FormControl, InputAdornment, InputLabel, IconButton, OutlinedInput, Typography} from '@mui/material';
import {Visibility, VisibilityOff} from '@mui/icons-material'
import theme from 'styles/mui/customMui';
import {ThemeProvider} from '@mui/material/styles';
import 'styles/mui/Box.scss';
import 'styles/mui/Button.scss';


const FormField = props => {
    return (
        <div className="dashboard field">
            <label className="dashboard label">
                {props.label}
            </label>
            <input
                type={props.type}
                className="dashboard input"
                placeholder="enter here.."
                disabled={props.disabled}
                value={props.value}
                onChange={e => props.onChange(e.target.value)}
            />
        </div>
    );
};

FormField.propTypes = {
    label: PropTypes.string,
    value: PropTypes.string,
    type: PropTypes.string,
    disabled: PropTypes.bool,
    onChange: PropTypes.func
};

const ChangeProfile = () => {
    const history = useHistory();
    const [user, setUser] = useState(new User());
    const params = useParams();
    const id = params.id ? parseInt(params.id) : -1;
    const [showPassword, setShowPassword] = useState(false);

    const handleClickShowPassword = () => {
        setShowPassword((show) => !show);
    }

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    }

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await api.get(`/users/${id}`);
                setUser(response.data);
            } catch (error) {
                console.error(`Something went wrong while fetching the user: \n${handleError(error)}`);
                console.error("Details:", error);
                alert("Something went wrong while fetching the user! See the console for details.");
            }
        }

        fetchData();
    }, [id]);

    const saveNewCredentials = async (user) => {
        try {
            const requestBody = JSON.stringify({...user});
            await api.put(`/users/${params.id}`, requestBody);
            console.log(requestBody)
            history.push("/profile/" + user.id)
        } catch (error) {
            alert(`Username and Password are not allowed to be empty: \n${handleError(error)}`);
        }
    };

    function handleUsernameChanged(event) {
        const {name, value} = event.target;

        setUser(prevUser => ({
            ...prevUser,
            [name]: value
        }));
    }

    function handlePasswordChanged(event) {
        const {name, value} = event.target;

        setUser(prevUser => ({
            ...prevUser,
            [name]: value
        }));
    }

    const goBack = async () => {
        try {
            history.push(`/profile/${id}`)
        } catch (error) {
            alert(`Something went wrong during returning to the previous page: \n${handleError(error)}`);
        }
    };

    return (
        <ThemeProvider theme={theme}>
            <Box color="primary.main" sx={{mt: 10}}>
                <Typography variant="h4" align="center" gutterBottom color={theme.palette.grey[700]}>
                    Change identifying details for your account
                </Typography>
                <FormControl sx={{m: 1, width: '60ch', mt: 10}} variant="outlined">
                    <InputLabel htmlFor="outlined-adornment-username" position="top">Change Username</InputLabel>
                    <OutlinedInput
                        id="outlined-adornment-username"
                        label="Change Username"
                        type="username"
                        placeholder="enter new username here..."
                        onChange={handleUsernameChanged}
                        onKeyPress={(event) => {
                            if (event.key === " ") {
                                event.preventDefault();
                            }
                        }}
                        name="username"
                        margin="dense"
                    />
                </FormControl>
                <FormControl sx={{m: 1, width: '60ch', mt: 10}} variant="outlined">
                    <InputLabel htmlFor="outlined-adornment-password">Change Password</InputLabel>
                    <OutlinedInput
                        id="outlined-adornment-password"
                        placeholder="enter new password here..."
                        onChange={handlePasswordChanged}
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        endAdornment={
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={handleClickShowPassword}
                                    onMouseDown={handleMouseDownPassword}
                                    edge="end"
                                >
                                    {showPassword ? <VisibilityOff/> : <Visibility/>}
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
                <Box color="primary" sx={{display: 'flex', justifyContent: 'center'}}>
                    <Button
                        sx={{
                            margin: 1,
                            width: '41ch',
                            color: theme.palette.grey[700],
                            borderColor: theme.palette.grey[700],
                        }}
                        variant="outlined"
                        width="100%"
                        size='large'
                        onClick={() => saveNewCredentials(user)}
                    >
                        Save New Credentials
                    </Button>
                </Box>
                <Box className="custom" color="primary">
                    <Button
                        sx={{
                            margin: 1,
                            color: theme.palette.grey[700],
                            borderColor: theme.palette.grey[700],
                        }}
                        variant="outlined"
                        width="100%"
                        size='large'
                        onClick={() => goBack()}>
                        Back
                    </Button>
                </Box>
            </Box>
        </ThemeProvider>
    )
}

export default ChangeProfile;
