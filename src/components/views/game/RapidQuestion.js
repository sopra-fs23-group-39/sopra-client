import React, {useEffect, useState, useRef} from 'react';
import SockJS from 'sockjs-client';
import {Stomp} from "@stomp/stompjs";
import 'styles/Question.scss'
import {Button, Box, Typography, LinearProgress, Grid} from '@mui/material';
import 'styles/Box.scss';
import 'styles/Button.scss';
import theme from 'components/ui/customMui';
import {ThemeProvider} from '@mui/material/styles';
import {useHistory, useParams} from "react-router-dom";
import {api, handleError} from "../../../helpers/api";

const RapidQuestion = () => {

  const color = "$accent";
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
  const [timer, setTimer] = useState(null);
  const [otherTimer, setOtherTimer] = useState(null);
  const [buttonClicked, setButtonClicked] = useState(false);
  const [gameDataFetched, setGameDataFetched] = useState(false);
  const [answerStompClient, setAnswerStompClient] = useState(null);
  const chosenButtonId = useRef(null);
  const [hostConnected, setHostConnected] = useState(false);
  const [displayTimer, setDisplayTimer] = useState(60);
  const [questionStompClient, setQuestionStompClient] = useState(null);
  const [timerMax, setTimerMax] = useState(50);
  const websocketURL = process.env.NODE_ENV === 'development'
      ? process.env.REACT_APP_WEBSOCKET_URL_DEV
      : process.env.REACT_APP_WEBSOCKET_URL_PROD;


  useEffect(() => {
    //const socket = new SockJS(`http://localhost:8080/gamerapid/${gameId}/question`);
    // const socket = new SockJS(`http://sopra-fs23-group-39-server.oa.r.appspot.com/gamerapid/${gameId}/question`);
    const socket = new SockJS(`${websocketURL}/gamerapid/${gameId}/question`);


    const questionStompClient = Stomp.over(() => socket);

    questionStompClient.connect({}, () => {
    console.log('WebSocket connection established.');
    setQuestionStompClient(questionStompClient);
    // "front address"
    questionStompClient.subscribe(`/topic/gamerapid/${gameId}/question`, (receivedQuestion) => {
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
      questionStompClient.send(`/app/gamerapid/${gameId}/question`, {}, 'NEWQUESTION');
    });
    socket.onclose= () => {
      questionStompClient.send(`/app/gamerapid/${gameId}/question/disconnect`, {}, '');
    }
    return () => {
      questionStompClient.disconnect();
    };

  }, []);  // [] is needed here so that useEffect is called when the component is mounted (not after)

  useEffect(() => {
    //const socket = new SockJS(`http://localhost:8080/gamerapid/${gameId}/answer`);

    //const socket = new SockJS(`http://sopra-fs23-group-39-server.oa.r.appspot.com/gamerapid/${gameId}/answer`);
    const socket = new SockJS(`${websocketURL}/gamerapid/${gameId}/answer`);
    const client = Stomp.over(() => socket);

    client.connect({}, () => {
      console.log('WebSocket connection established.');
      setAnswerStompClient(client);
    });

    return () => {
      if (answerStompClient?.connected) {
        answerStompClient.disconnect();
      }
    };
  }, [gameId]);


  function handleClick(chosenAnswer, buttonId) {
    setButtonClicked(true);
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

    answerStompClient.send(`/app/gamerapid/${gameId}/answer`, header, answerToSend)
    questionStompClient.send(`/app/gamerapid/${gameId}/question`, {},'NEWQUESTION')
    console.log("Answer is sent, object inside handleClick:");
    console.log(answerToSend)
  }


  useEffect(() => {
    async function fetchData() {
      try {
        console.log(gameId);
        const response = await api.get(`/game/${gameId}/settings`);
        console.log(response.data)
        setGameMode(response.data.gameMode)
        setTimer(response.data.timer * 1000);
        setOtherTimer(response.data.timer * 1000);
        console.log(response.data.timer);
        console.log(timer);
        setDisplayTimer(response.data.timer);
        setGameDataFetched(true);
        setTimerMax(response.data.timer);
      } catch (error) {
        console.error(`Something went wrong while fetching the game settings: \n${handleError(error)}`);
        console.error(error);
        alert(`Something went wrong while fetching the game settings: \n${handleError(error)}`);
      }
    }

    fetchData();
  },[gameId]);

  const normalise = (value) => ((timerMax-(value))*100)/timerMax;


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
    return () => {
      clearInterval(intervalId);
    };
  },[hostConnected]);

  useEffect(()=> {
    if(!gameDataFetched){
      return;
    }
    setDisplayTimer(timer);
    timeoutRef.current = setTimeout(() => {
      console.log(timer);
      console.log(disabled)
      console.log("were we here?")
      console.log(chosenButtonId);
      history.push(`/game/${gameId}/winner`)
    },timer);
    return () => {
      clearTimeout(timeoutRef.current);
    };
  }, [gameDataFetched]);

  let imageDisplay = null;

  if (gameMode === "ACTOR" || gameMode === "MIXED"){
    imageDisplay = (
      <div style={{display: "flex", justifyContent: "center", alignItems: "center", height: "365px"}}>
        <img src={question.questionLink} className="image" alt="MoviePicture" style={{width: "340px", height: "365px", objectFit: "cover", objectPosition: "center top", margin: "auto"}}/>
      </div>
    );
  } else if (gameMode === "MOVIE" || gameMode === "SHOW"){
    imageDisplay = (
      <div style={{display: "flex", justifyContent: "center", alignItems: "center", height: "365px"}}>
        <img src={question.questionLink} className="image" alt="MoviePicture" style={{height: "365px", objectFit: "cover", objectPosition: "center top", margin: "auto"}}/>
      </div>
    );
  }

  window.addEventListener('beforeunload', (event) => {
    history.push(`/main`);
  })
  window.addEventListener('popstate', (event) => {
    history.push(`/main`);
  })

  return (
    <div>
      <ThemeProvider theme={theme}>
        <Box
          sx={{ backgroundColor: 'rgba(0, 0, 0, 0.8)',pt: '5%',p:'2%',pb:'2%', width: '100%'}}
        > {hostConnected ? (
          <div>
            <Typography
              variant="h4"
              align="center"
              gutterBottom color={theme.palette.primary.light}
              sx={{ px: ['10px', '20px'] }}>
              {question.questionText}
            </Typography>
            <Typography
              variant="h5"
              align="center"
              gutterBottom
              color={theme.palette.primary.light}
              sx={{px: ['10px', '20px'],}}
            >
              {displayTimer}
            <LinearProgress
              variant="determinate"
              color="inherit"
              value={normalise(displayTimer)}
            />
            </Typography>
            {imageDisplay}
            <div className="dashboard button-container">
              <Grid container spacing={2} color="inherit">
                <Grid item xs={6}><Button
                  sx={{
                    width : "100%",
                    height: "100%",
                    color: theme.palette.primary.light,
                    backgroundColor: buttonColors.but1,
                  }}
                  variant="outlined"
                  disabled={disabled}
                  onClick={() => handleClick(question.answer1, 'but1')}
                >
                  {question.answer1}
                </Button></Grid>
                <Grid item xs={6}><Button
                  sx={{
                    width: "100%",
                    height: "100%",
                    color: theme.palette.primary.light,
                    backgroundColor: buttonColors.but2,
                  }}
                  variant="outlined"
                  disabled={disabled}
                  onClick={() => handleClick(question.answer2, 'but2')}
                >
                  {question.answer2}
                </Button></Grid>
              </Grid>
              <Grid container spacing={2} color="inherit">
                <Grid item xs={6}>
                  <Button
                    sx={{
                      width: "100%",
                      height: "100%",
                      color: theme.palette.primary.light,
                      backgroundColor: buttonColors.but3,
                    }}
                    variant="outlined"
                    disabled={disabled}
                    onClick={() => handleClick(question.answer3, 'but3')}
                  >
                    {question.answer3}
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Button
                    sx={{
                      width:"100%",
                      height:"100%",
                      color: theme.palette.primary.light,
                      backgroundColor: buttonColors.but4,
                    }}
                    variant="outlined"
                    disabled={disabled}
                    onClick={() => handleClick(question.answer4, 'but4')}
                  >
                    {question.answer4}
                  </Button>
                </Grid>
              </Grid>
            </div>
          </div>
        ) : (
          <h1 style={{
            textAlign: 'center',
            color: color,
            marginBottom: '10px',
          }}
          >
            Waiting for players...
          </h1>
        )}
        </Box>
      </ThemeProvider>
    </div>
  );
}

export default RapidQuestion;
