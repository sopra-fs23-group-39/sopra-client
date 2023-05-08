import React, {useEffect, useState, useRef} from 'react';
import SockJS from 'sockjs-client';
import {Stomp} from "@stomp/stompjs";
import 'styles/views/Question.scss'
import {Button} from "../ui/Button";
import {useHistory, useParams} from "react-router-dom";
import {api, handleError} from "../../helpers/api";
import {host} from "sockjs-client/lib/location";

const RapidQuestion = () => {

    const color = "#DEB522";
    const [question, setQuestion] = useState({});
    const [gameMode, setGameMode] = useState(null);
    const [disabled, setDisabled] = useState(false);
    const userId = localStorage.getItem("id");
    const [buttonColors, setButtonColors] = useState({
        but1: color,
        but2: color,
        but3: color,
        but4: color
    });
    const {gameId} = useParams();
    const history = useHistory();
    const timeoutRef = useRef(null);
    const unmountTimeOutRef = useRef(null);
    const [timer, setTimer] = useState(null);
    const [otherTimer, setOtherTimer] = useState(null);
    const [buttonClicked, setButtonClicked] = useState(false);
    const [gameDataFetched, setGameDataFetched] = useState(false);
    const [answerStompClient, setAnswerStompClient] = useState(null);
    //const [chosenButtonId, setChosenButtonId] = useState(null);
    const chosenButtonId = useRef(null);
    const [hostId, setHostId] = useState(null);
    const [hostConnected, setHostConnected] = useState(false);
    const [displayTimer, setDisplayTimer] = useState(60);


    useEffect(() => {
        //const socket = new SockJS(`http://localhost:8080/game/${gameId}/question`);
        const socket = new SockJS(`http://sopra-fs23-group-39-server.oa.r.appspot.com/game/${gameId}/question`);
        let questionStompClient = Stomp.over(() => socket);

        questionStompClient.connect({}, () => {
            console.log('WebSocket connection established.');
            // "front address"
            questionStompClient.subscribe(`/topic/game/${gameId}/question`, (receivedQuestion) => {
                if(receivedQuestion.body === "Waiting for players..."){
                    console.log("waiting for players");
                } else {
                    console.log(receivedQuestion);
                    const parsedQuestion = JSON.parse(receivedQuestion.body);
                    setQuestion(parsedQuestion);
                    console.log(question);
                    setHostConnected(true);

                }
            });
            // "back address"
            questionStompClient.send(`/app/game/${gameId}/question`, {}, 'Question received!');
        });
        socket.onclose= () => {
            questionStompClient.send(`/app/game/${gameId}/question/disconnect`, {}, '');
        }
        return () => {
            questionStompClient.disconnect();
        };

    }, []);  // [] is needed here so that useEffect is called when the component is mounted (not after)

    /*useEffect(() => {
        if(hostId != localStorage.getItem('id')){
            const socket = new SockJS(`http://localhost:8080/game/${gameId}/question/non-host`);
            let nonHostStompClient = Stomp.over(() => socket);
            nonHostStompClient.connect({}, () => {
                console.log('WebSocket connection established.');
                // "front address"
                nonHostStompClient.subscribe(`/topic/game/${gameId}/question/non-host`, (message) => {
                    if(message.body == "HOSTREADY"){
                        console.log("host ready")
                        setHostConnected(true);
                        nonHostStompClient.send(`/app/game/${gameId}/question/non-host`, {}, 'ready now');
                    }
                    if(hostConnected && message.body != "HOSTREADY"){
                        console.log("getting question as host is here now")
                        const parsedQuestion = JSON.parse(message.body);
                        setQuestion(parsedQuestion);
                        console.log("Object inside useEffect game/gameId/question/non-host (subscribe):")
                        console.log(question);
                        nonHostStompClient.send(`/app/game/${gameId}/question/non-host`, {}, 'Question received!');
                    }
                });
                // "back address"
            });
        }
    },[gameDataFetched,hostConnected])*/



    useEffect(() => {
        // const socket = new SockJS(`http://localhost:8080/game/${gameId}/answer`);

        const socket = new SockJS(`http://sopra-fs23-group-39-server.oa.r.appspot.com/game/${gameId}/answer`);
        const client = Stomp.over(() => socket);

        client.connect({}, () => {
            console.log('WebSocket connection established.');
            setAnswerStompClient(client);
        });

        return () => {
            if (answerStompClient && answerStompClient.connected) {
                answerStompClient.disconnect();
            }
        };
    }, [gameId]);


    function handleClick(chosenAnswer, buttonId) {
        setButtonClicked(true);
        //setChosenButtonId(buttonId);
        chosenButtonId.current = buttonId;
        const header = {'content-type': 'application/json'};
        const answerToSend = JSON.stringify({
            gameId,
            userId,
            usersAnswer: chosenAnswer,
            correctAnswer: question.correctAnswer,
            time: new Date(),
            questionTime: question.creationTime
        });
        setDisabled(true);
        setButtonColors({
            ...buttonColors,
            [buttonId]: "yellow"
        });

        answerStompClient.send(`/app/game/${gameId}/answer`, header, answerToSend)
        console.log("Answer is sent, object inside handleClick:");
        console.log(answerToSend)
    }


    //This hook is to make the correct answer green


    useEffect(() => {
        async function fetchData() {
            try {
                const response = await api.get(`/game/${gameId}/settings`);
                console.log(response.data)
                setGameMode(response.data.gameMode)
                setTimer(response.data.timer * 1000);
                setOtherTimer(response.data.timer * 1000);
                setHostId(response.data.hostId);
                console.log(response.data.timer);
                console.log(timer);
                setGameDataFetched(true);
            } catch (error) {
                console.error(`Something went wrong while fetching the game settings: \n${handleError(error)}`);
                console.error(error);
                alert(`Something went wrong while fetching the game settings: \n${handleError(error)}`);
            }
        }

        fetchData();
    },[gameId]);



    useEffect(()=>{
        if(!gameDataFetched){
            return;
        }
        let correctButtonId;
        if (question.correctAnswer === question.answer1) {
            correctButtonId = "but1";
        } else if (question.correctAnswer === question.answer2) {
            correctButtonId = "but2";
        } else if (question.correctAnswer === question.answer3) {
            correctButtonId = "but3"
        } else if (question.correctAnswer === question.answer4) {
            correctButtonId = "but4";
        }
        timeoutRef.current = setTimeout(() => {
            console.log(timer);
            setDisabled(true);
            console.log(disabled)
            console.log("were we here?")
            console.log(chosenButtonId);
            if(chosenButtonId == null) {
                setButtonColors({
                    ...buttonColors,
                    [correctButtonId]: "green"
                });
            }
            setButtonColors({
                ...buttonColors,
                [chosenButtonId.current]: "red",
                [correctButtonId]: "green"
            });
            setDisplayTimer(5);
        }, timer);

        unmountTimeOutRef.current = setTimeout(() => {
            history.push(`/game/${gameId}/standings`);
        }, otherTimer + 1000);
        return () => {
            clearTimeout(timeoutRef.current);
        };
    },[gameDataFetched, timer, otherTimer, question]);

    useEffect( () => {
        if(disabled && !buttonClicked && answerStompClient){
            handleClick("DEFAULT", "but0");
        }

    }, [disabled, buttonClicked, chosenButtonId, hostConnected])
    useEffect(()=> {
        setDisplayTimer(timer/1000);
        const intervalId = setInterval (() => {
            setDisplayTimer(displayTimer => displayTimer -1);
        }, 1000);
        unmountTimeOutRef.current = setTimeout(() => {
            history.push(`/game/${gameId}/standings`);
        }, timer + 5000);
        return () => {
            clearInterval(intervalId);
            clearTimeout(unmountTimeOutRef.current);
        };
    },[hostConnected])







        // Clean up the timeout when the component unmounts



    //This hook is to automatically route to the next page




    let imageDisplay = null;

    if (gameMode === "ACTOR" || gameMode === "MIXED"){
        imageDisplay = (
            <div style={{display: "flex", justifyContent: "center", alignItems: "center", height: "365px"}}>
                <img src={question.questionLink} className="image" alt="MoviePicture" style={{width: "340px", height: "365px", objectFit: "cover", objectPosition: "center top", margin: "auto"}}/>
            </div>
        );
    } else if (gameMode === "POSTER"){
        imageDisplay = (
            <div style={{display: "flex", justifyContent: "center", alignItems: "center", height: "365px"}}>
                <img src={question.questionLink} className="image" alt="MoviePicture" style={{height: "365px", objectFit: "cover", objectPosition: "center top", margin: "auto"}}/>
            </div>
        );
    }

    return (
        <div className="dashboard container">
            <div className="dashboard form">
                {hostConnected ? (
                    <div>
                        <h1 style={{textAlign: "center", color: color, marginBottom: 10}}>Question</h1>
                        <h2 style={{textAlign: "center", color: color, marginBottom: 10}}>{question.questionText}</h2>
                        <h3 style={{textAlign: "center", color: color, marginBottom: 10}}> Question timer: {displayTimer}</h3>
                    {imageDisplay}
                        <div className="dashboard button-container">
                    {/*<Button*/}
                    {/*    style={{marginTop: 10}}*/}
                    {/*    disabled={true}*/}
                    {/*    >*/}
                    {/*    {question.correctAnswer}*/}
                    {/*</Button>*/}
                        <Button
                        style={{backgroundColor: buttonColors.but1}}
                        width="100%"
                        disabled={disabled}
                        onClick={() => handleClick(question.answer1, "but1")}
                        >
                    {question.answer1}
                        </Button>
                        <Button
                        style={{backgroundColor: buttonColors.but2}}
                        width="100%"
                        disabled={disabled}
                        onClick={() => handleClick(question.answer2, "but2")}
                        >
                    {question.answer2}
                        </Button>
                        <Button
                        style={{backgroundColor: buttonColors.but3}}
                        width="100%"
                        disabled={disabled}
                        onClick={() => handleClick(question.answer3, "but3")}
                        >
                    {question.answer3}
                        </Button>
                        <Button
                        style={{backgroundColor: buttonColors.but4}}
                        width="100%"
                        disabled={disabled}
                        onClick={() => handleClick(question.answer4, "but4")}
                        >
                    {question.answer4}
                        </Button>
                        </div>
                    </div>) : (<h1 style={{textAlign: "center", color: color, marginBottom: 10}}>Waiting for players...</h1>)}

            </div>
        </div>
    );
}

export default RapidQuestion;
