import React, { useEffect, useState, useRef } from 'react';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import 'styles/views/Question.scss'
import {Button} from "../ui/Button";
import {useHistory, useParams} from "react-router-dom";

function Question() {
    const color = "#DEB522";
    const [question, setQuestion] = useState({});
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


    useEffect(() => {
        const socket = new SockJS(`http://localhost:8080/game/${gameId}/question`);
        // const socket = new SockJS(`https://sopra-fs23-group-39-server.oa.r.appspot.com:8080/game/${gameId}/question`);
        let stompClient = Stomp.over(socket);

        stompClient.connect({}, () => {
            console.log('WebSocket connection established.');
            // "front address"
            stompClient.subscribe(`/topic/game/${gameId}/question`, (receivedQuestion) => {
                const parsedQuestion = JSON.parse(receivedQuestion.body);
                setQuestion(parsedQuestion);
                console.log("Object inside useEffect game/gameId/question (subscribe):")
                console.log(question);
            });
            // "back address"
            stompClient.send(`/app/game/${gameId}/question`, {}, 'Question received!');
        });

        return () => {
            stompClient.disconnect();
        };
    }, [gameId]);  // [] is needed here so that useEffect is called when the component is mounted (not after)


    const [stompClient, setStompClient] = useState(null);

    useEffect(() => {
        const socket = new SockJS(`http://localhost:8080/game/${gameId}/answer`);
        // const socket = new SockJS(`https://sopra-fs23-group-39-server.oa.r.appspot.com:8080/game/${gameId}/answer`);
        const client = Stomp.over(socket);

        client.connect({}, () => {
            console.log('WebSocket connection established.');
            setStompClient(client);
        });

        return () => {
            if (stompClient && stompClient.connected) {
                stompClient.disconnect();
            }
        };
    }, [gameId]);


    function handleClick(chosenAnswer, buttonId) {
        const header = { 'content-type': 'application/json' };
        const answerToSend = JSON.stringify({
            gameId,
            userId,
            answer: chosenAnswer,
            correctAnswer: question.correctAnswer,
            time: new Date()
        });
        setDisabled(true);
        setButtonColors({
            ...buttonColors,
            [buttonId]: "yellow"
        });

        stompClient.send(`/app/game/${gameId}/answer`, header, answerToSend)
        console.log("Answer is sent, object inside handleClick:");
        console.log(answerToSend)
    }


    //This hook is to make the correct answer green
    useEffect(() => {
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

        const timeoutId = setTimeout(() => {
            setDisabled(true);
            setButtonColors({
                ...buttonColors,
                [correctButtonId]: "green"
            });
        }, 20000);

        return () => clearTimeout(timeoutId);
    });


    //This hook is to automatically route to the next page
    useEffect(() => {
        timeoutRef.current = setTimeout(() => {
            history.push(`/game/${gameId}/standings`);
        }, 30000);

        // Clean up the timeout when the component unmounts
        return () => {
            clearTimeout(timeoutRef.current);
        };
    }, [history, gameId]);


    return (
        <div className="dashboard container">
            <div className="dashboard form">
                <h1 style={{textAlign: "center", color: color, marginBottom: 10}}>Question</h1>
                <h2 style={{textAlign: "center", color: color, marginBottom: 10}}>{question.questionText}</h2>
                <img src={question.questionLink} className="image"  alt="MoviePicture"/>
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
            </div>
        </div>
    );
}

export default Question;



