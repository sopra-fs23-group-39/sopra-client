import React, {useEffect, useState} from 'react';
import {useParams, useHistory} from "react-router-dom";
import {api, handleError} from "../../../helpers/api";
import User from "../../../models/User";
import {Box, Button, FormControl, InputAdornment, InputLabel, IconButton, OutlinedInput, Typography} from '@mui/material';
import {Visibility, VisibilityOff} from '@mui/icons-material'
import theme from 'components/ui/customMui';
import {ThemeProvider} from '@mui/material/styles';
import 'styles/Box.scss';
import 'styles/Button.scss';
import PrimaryButton from "../../ui/PrimaryButton";

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
        alert("Something went wrong while fetching the user!");
      }
    }

    fetchData();
  }, [id]);

  const saveNewCredentials = async (user) => {
    try {
      const requestBody = JSON.stringify({...user});
      await api.put(`/users/${params.id}`, requestBody);
      console.log(requestBody)
      // history.push("/profile/" + user.id)
      alert("Your credentials were updated!");
    } catch (error) {
      alert(`Your credentials were not changed: \n${handleError(error)}`);
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
      <Box sx={{ mt: 10, backgroundColor: 'rgba(0, 0, 0, 0.8)', pt: '20px'}}>
        <Typography variant="h4" align="center" gutterBottom color={theme.palette.primary.light}>
          Change identifying details for your account
        </Typography>
        <FormControl sx={{m: 1, width: '60ch', mt: 10}} variant="outlined">
          <InputLabel htmlFor="outlined-adornment-username" position="top" sx={{ color: theme.palette.primary.light }}>Change Username</InputLabel>
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
            sx={{
              '& fieldset': {
                borderColor: theme.palette.primary.light,
              },
              '& input': {
                color: theme.palette.primary.light,
              },
            }}
            name="username"
            margin="dense"
          />
        </FormControl>
        <FormControl sx={{m: 1, width: '60ch', mt: 10}} variant="outlined">
          <InputLabel htmlFor="outlined-adornment-password" sx={{ color: theme.palette.primary.light }}>Change Password</InputLabel>
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
                  sx={{ color: 'primary.light' }}
                >
                  {showPassword ? <VisibilityOff/> : <Visibility/>}
                </IconButton>
              </InputAdornment>
            }
            margin='dense'
            label="Change Password"
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
        <PrimaryButton label="save new credentials" onClick={() => saveNewCredentials(user)}/>
        <Box className="custom" color="primary">
          <Button
            sx={{
              margin: 1,
              color: theme.palette.primary.light,
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
