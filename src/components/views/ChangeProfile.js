import {useEffect, useState} from 'react';
import {useParams, useHistory} from "react-router-dom";
import {api, handleError} from "../../helpers/api";
import {Button} from "../ui/Button";
import PropTypes from "prop-types";
import 'styles/views/ChangeProfile.scss';
import BaseContainer from "../ui/BaseContainer";
import User from "../../models/User";


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
    // const [username, setUsername] = useState(null);
    // const [password, setPassword] = useState(null);
    // const [repeatPassword, setRepeatPassword] = useState(null);
    const params = useParams();

    const id = params.id ? parseInt(params.id) : -1;

    useEffect(() => {

        async function fetchData() {
            try {
                const response = await api.get(`/users/${id}`);

                setUser(response.data);

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
    }, [id]);

    function handleUsernameChanged (event) {
        const {name, value} = event.target
        setUser(prevUser => ({
            ...prevUser,
            [name]: value
        }))
    }

    const doSaveUsername = async (user) => {
        try {
            const requestBody = JSON.stringify({...user});
            await api.put(`/users/${params.id}`, requestBody);
            console.log(requestBody)

        } catch (error) {
            alert(`Something went wrong during saving a new username: \n${handleError(error)}`);
        }
    };

    function handlePasswordChanged (event) {
        const {name, value} = event.target
        setUser(prevUser => ({
            ...prevUser,
            [name]: value
        }))
    }

    const doSavePassword = async (user) => {
        try {
            const requestBody = JSON.stringify({...user});
            await api.put(`/users/${id}`, requestBody);
            console.log(requestBody)

        } catch (error) {
            alert(`Something went wrong during saving a new password: \n${handleError(error)}`);
        }
    };

    const goBack = async () => {
        try {
            history.push(`/profile/${id}`)
        } catch (error) {
            alert(`Something went wrong during returning to the previous page: \n${handleError(error)}`);
        }
    };

    return (
        <BaseContainer>
            <div className="dashboard container">
                <div className="dashboard form">
                    <h1 style={{textAlign: "center", color: "#DEB522", marginBottom: 100}}>Profile</h1>
                    <label className="dashboard label">
                        change username
                    </label>
                    <input
                        type="username"
                        className="dashboard input"
                        placeholder="enter new username here..."
                        onChange={handleUsernameChanged}
                        name="username"
                        value={user.username}
                    />
                    <div className="dashboard button-container">
                        <Button
                            onClick={() => doSaveUsername(user)}>
                            SAVE USERNAME
                        </Button>
                    </div>
                    <label className="dashboard label">
                        change password
                    </label>
                    <input
                        type="password"
                        className="dashboard input"
                        placeholder="enter new password here..."
                        onChange={handlePasswordChanged}
                        value={user.password}
                        name="password"
                    />
                    {/*<input*/}
                    {/*    type="repeatPassword"*/}
                    {/*    className="dashboard input"*/}
                    {/*    placeholder="confirm new password here..."*/}
                    {/*    onChange={un => setRepeatPassword(un)}*/}
                    {/*    value={user.repeatPassword}*/}
                    {/*    name="repeatPassword"*/}
                    {/*/>*/}
                    <div className="dashboard button-container">
                        <Button
                            onClick={() => doSavePassword(user)}>
                            SAVE PASSWORD
                        </Button>
                        <Button
                            style={{marginTop: 250}}
                            onClick={() => goBack()}>
                            BACK
                        </Button>
                    </div>
                </div>
            </div>
        </BaseContainer>
    );
};

export default ChangeProfile;
