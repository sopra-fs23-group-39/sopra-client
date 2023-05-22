import React, {useEffect, useState} from 'react';
import {useParams, useHistory} from "react-router-dom";
import {api, handleError} from "../../helpers/api";
import 'styles/views/Profile.scss';
import {Box} from '@mui/material';
import {Button, Typography} from '@mui/material';
import theme from 'styles/mui/customMui';
import {ThemeProvider} from '@mui/material/styles';
import 'styles/mui/Box.scss';
import 'styles/mui/Button.scss';
import {Spinner} from "../ui/Spinner";
import Chip from '@mui/material/Chip';

const Profile = () => {
    const history = useHistory();
    const params = useParams();
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {

        async function fetchData() {
            try {
                const response = await api.get(`/users/${params.id}`);
                setUser(response.data);
                setIsLoading(false);
            } catch (error) {
                alert("Something went wrong while fetching the user! See the console for details.");
            }
        }

        fetchData();
    }, [params.id]);

    const goChangeCredentials = async () => {
        try {
            history.push(`/changes/${params.id}`)
        } catch (error) {
            alert(`Something went wrong during going to ChangeCredentials page: \n${handleError(error)}`);
        }
    };

    const goBack = async () => {
        try {
            history.push('/main')
        } catch (error) {
            alert(`Something went wrong during returning to Main page: \n${handleError(error)}`);
        }
    };

    const CustomChip = (props) => {
        const {color, label, ...rest} = props;
        return (
            <Chip
                label={label}
                variant="outlined"
                size="large"
                sx={{
                    borderColor: color,
                    width: '200px',
                    color: color,
                    borderRadius: '4px',
                    fontSize: '1rem',
                    py: 1,
                    px: 2,
                    ...rest.sx,
                }}
                {...rest}
            />
        );
    };

    return (
        <div>
            {isLoading ? <Spinner/> :
                <ThemeProvider theme={theme}>
                    <Box sx={{backgroundColor: 'rgba(0, 0, 0, 0.8)', width: '500px', pt: '20px'}}>
                        <Typography variant="h4" align="center" gutterBottom color={theme.palette.primary.light}>
                            Profile
                        </Typography>
                        <Box color="primary"
                             sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2}}>
                            <Box sx={{flex: '0 0 auto'}}>
                                <Typography variant="subtitle1" color={theme.palette.primary.light}>
                                    Username
                                </Typography>
                            </Box>
                            <Box sx={{flex: '0 0 auto'}}>
                                <CustomChip label={user.username} color={theme.palette.primary.light}/>
                            </Box>
                        </Box>
                        <Box color="primary"
                             sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2}}>
                            <Box sx={{flexGrow: 1}}>
                                <Typography variant="subtitle1" color={theme.palette.primary.light}>
                                    Number of games
                                </Typography>
                            </Box>
                            <Box sx={{flex: '0 0 auto'}}>
                                <CustomChip label={user.numberGames} color={theme.palette.primary.light}/>
                            </Box>
                        </Box>
                        <Box color="primary"
                             sx={{mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2}}>
                            <Box sx={{flexGrow: 1}}>
                                <Typography variant="subtitle1" color={theme.palette.primary.light}>
                                    Custom Rank
                                </Typography>
                            </Box>
                            <Box sx={{flex: '0 0 auto'}}>
                                <CustomChip label={user.userRank} color={theme.palette.primary.light}/>
                            </Box>
                        </Box>
                        <Box color="primary"
                             sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2}}>
                            <Box sx={{flexGrow: 1}}>
                                <Typography variant="subtitle1" color={theme.palette.primary.light}>
                                    Total amount of Custom points
                                </Typography>
                            </Box>
                            <Box sx={{flex: '0 0 auto'}}>
                                <CustomChip label={user.totalPointsAllGames} color={theme.palette.primary.light}/>
                            </Box>
                        </Box>
                        <Box color="primary"
                             sx={{mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2}}>
                            <Box sx={{flexGrow: 1}}>
                                <Typography variant="subtitle1" color={theme.palette.primary.light}>
                                    Blitz Rank
                                </Typography>
                            </Box>
                            <Box sx={{flex: '0 0 auto'}}>
                                <CustomChip label={user.blitzRank} color={theme.palette.primary.light}/>
                            </Box>
                        </Box>
                        <Box color="primary"
                             sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2}}>
                            <Box sx={{flexGrow: 1}}>
                                <Typography variant="subtitle1" color={theme.palette.primary.light}>
                                    Total amount of Blitz points
                                </Typography>
                            </Box>
                            <Box sx={{flex: '0 0 auto'}}>
                                <CustomChip label={user.totalBlitzPointsAllGames} color={theme.palette.primary.light}/>
                            </Box>
                        </Box>
                        <Box color="primary"
                             sx={{mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2}}>
                            <Box sx={{flexGrow: 1}}>
                                <Typography variant="subtitle1" color={theme.palette.primary.light}>
                                    Rapid Rank
                                </Typography>
                            </Box>
                            <Box sx={{flex: '0 0 auto'}}>
                                <CustomChip label={user.rapidRank} color={theme.palette.primary.light}/>
                            </Box>
                        </Box>
                        <Box color="primary"
                             sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2}}>
                            <Box sx={{flexGrow: 1}}>
                                <Typography variant="subtitle1" color={theme.palette.primary.light}>
                                    Total amount of Rapid points
                                </Typography>
                            </Box>
                            <Box sx={{flex: '0 0 auto'}}>
                                <CustomChip label={user.totalRapidPointsAllGames} color={theme.palette.primary.light}/>
                            </Box>
                        </Box>
                        <Box className="custom" color="primary">
                            <Button
                                disabled={String(user.id) !== localStorage.getItem('id')}
                                sx={{
                                    mt: 1,
                                    color: theme.palette.primary.light,
                                }}
                                variant="outlined"
                                width="100%"
                                size='large'
                                onClick={() => goChangeCredentials()}>
                                Change Credentials
                            </Button>
                        </Box>
                        <Box className="custom" color="primary">
                            <Button
                                sx={{
                                    mb: 2,
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
                </ThemeProvider>}
        </div>
    )
};

export default Profile;
