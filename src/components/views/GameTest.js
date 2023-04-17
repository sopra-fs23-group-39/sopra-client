import React, { useEffect, useState } from 'react';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';

function GameTest() {
    const [question, setQuestion] = useState({});
    //let stompClient;

    const socket = new SockJS('http://localhost:8080/ws');
    let stompClient = Stomp.over(socket);

    useEffect(() => {

        stompClient.connect({}, () => {
            console.log('WebSocket connection established.');
            stompClient.subscribe('/topic/messages', (question) => {
                //console.log('Received response:', response);
                // console.log('Received response json:', response);
                const parsedQuestion = JSON.parse(question);

                //console.log('Received message:', response.body);
                setQuestion({...parsedQuestion}
                );
                console.log(parsedQuestion.body);
                //console.log(question);
            });
        });

        return () => {
            stompClient.disconnect();
        };
    });  // [stompClient]

    const sendMessage = () => {
        if (stompClient) {
            stompClient.send('/app/sendMessage', {}, 'Hello from frontend!');
        } else {
            console.log('stompClient is not initialized yet.');
        }
    };

    return (
        <div>
            <button onClick={sendMessage}>Send message</button>
            <p>Question: {question.body.questionText}</p>
            <p>Link: {question.body.questionLink}</p>
        </div>
    );
}

export default GameTest;



