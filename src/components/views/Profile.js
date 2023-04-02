import {useEffect, useState} from 'react';
import {useParams, useHistory} from "react-router-dom";
import {api, handleError} from "../../helpers/api";
import {Button} from "../ui/Button";
import PropTypes from "prop-types";
import 'styles/views/Profile.scss';
import {Spinner} from "../ui/Spinner";


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

const Profile = () => {
    const history = useHistory();
    const params = useParams();
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    // eslint-disable-next-line
    const [disabled, setDisabled] = useState(true);

    useEffect(() => {
        let userId = !!params.id ? parseInt(params.id) : -1;

        async function fetchData() {
            try {
                const response = await api.get(`/users/${userId}`);

                setUser(response.data);
                setIsLoading(false)
                setDisabled(sessionStorage.getItem('token') !== response.data.token)

                console.log('request to:', response.request.responseURL);
                console.log('status code:', response.status);
                console.log('status text:', response.statusText);
                console.log('requested data:', response.data);
                console.log(response);

            } catch (error) {
                console.error(`Something went wrong while fetching the user: \n${handleError(error)}`);
                console.error("Details:", error);
                alert("Something went wrong while fetching the user! See the console for details.");
            }
        }

        fetchData();
    }, [params.id]);

    const goChangeCredentials = async () => {
        try {
            history.push(`/changes/${user.id}`)
        } catch (error) {
            alert(`Something went wrong during returning to ChangeCredentials page: \n${handleError(error)}`);
        }
    };

    const goBack = async () => {
        try {
            history.push('/main')
        } catch (error) {
            alert(`Something went wrong during returning to Main page: \n${handleError(error)}`);
        }
    };

    return (
        <div>
            {isLoading ? <Spinner/> :
                <div className="dashboard container">
                    <div className="dashboard form">
                        <div className="dashboard title">Profile</div>
                        <FormField
                            label="username:"
                            value={user.username}
                        />
                        <FormField
                            label="status:"
                            value={user.status}
                        />
                        <FormField
                            label="current rank:"
                            value={user.rank}
                        />
                        <FormField
                            label="total number of games:"
                            value={user.numberGames}
                        />
                        <FormField
                            label="total number of points:"
                            value={user.totalPoints}
                        />
                        <div className="dashboard button-container">
                            <Button
                                width="100%"
                                onClick={() => goChangeCredentials(user)}>
                                CHANGE CREDENTIALS
                            </Button>
                            <Button
                                width="100%"
                                onClick={() => goBack()}>
                                BACK
                            </Button>
                        </div>
                    </div>
                </div>
            }
        </div>
    );
};

export default Profile;