import React, {useEffect, useState, useRef} from 'react';
import SockJS from 'sockjs-client';
import {Stomp} from "@stomp/stompjs";
import 'styles/views/Question.scss';
import {ButtonGroup,Button,Box,Typography,LinearProgress,Grid} from '@mui/material';
import 'styles/mui/Box.scss';
import 'styles/mui/Button.scss';
import theme from 'styles/mui/customMui';
import {ThemeProvider} from '@mui/material/styles';
import {useHistory, useParams} from "react-router-dom";
import {api, handleError} from "../../helpers/api";
import {host} from "sockjs-client/lib/location";
import "styles/views/VideoPlayer.scss";
import YouTube from "react-youtube";
import PrimaryButton from 'styles/mui/PrimaryButton';

const Question = () => {

  const color = "$accent";
  const color2 = "yellow";
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
  const[buttonOpacity, setButtonOpacity]=useState(1);
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
  const [timerMax, setTimerMax] = useState(60);

  const [playerState, setPlayerState] = useState(null);
  const [isMuted, setIsMuted] = useState(true);
  const playerRef = useRef(null);

  const normalise = (value) => ((timerMax-(value))*100)/timerMax;

  const opts = {
    playerVars: {
      autoplay: 1,
      mute: 1,
      showinfo: 0,
      modestbranding: 1,
      loop: 1,
      controls: 0,
      start: 20
    }
  }

  const onReady = (event) => {
    setPlayerState(YouTube.PlayerState.PLAYING);
    const player = playerRef.current.getInternalPlayer();
    setTimeout(() => {
      player.stopVideo();
      setPlayerState(YouTube.PlayerState.ENDED);
    }, timer); // Stop playback after x seconds
  }

  const handleMuteUnmuteClick = () => {
    console.log('Mute/unmute clicked');
    const player = playerRef.current.getInternalPlayer();
    if (isMuted) {
      player.unMute();
      setIsMuted(false);
    } else {
      player.mute();
      setIsMuted(true);
    }
  }

  const handleStateChange = (event) => {
    console.log('State changed:', event.data);
    setPlayerState(event.data);
  };

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
          console.log(receivedQuestion.body);
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

  useEffect(() => {
    //const socket = new SockJS(`http://localhost:8080/game/${gameId}/answer`);
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
      but1: color2,
      but2: color2,
      but3: color2,
      but4: color2,
      //[buttonId]: "blue"
    });
    setButtonOpacity(0.5);

    answerStompClient.send(`/app/game/${gameId}/answer`, header, answerToSend)
    console.log("Answer is sent, object inside handleClick:");
    console.log(answerToSend)
  }

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await api.get(`/game/${gameId}/settings`);
        console.log(response.data)
        setGameMode(response.data.gameMode)
        setTimer(response.data.timer * 1000 );
        setOtherTimer(response.data.timer * 1000);
        setHostId(response.data.hostId);
        setTimerMax(response.data.timer);
        console.log(response.data.timer);
        console.log(timer);
        setGameDataFetched(true);
        setButtonOpacity(1);
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
          but1: color2,
          but2: color2,
          but3: color2,
          but4: color2,
          [correctButtonId]: "green"
        });
      }
      setButtonColors({
        but1: color2,
        but2: color2,
        but3: color2,
        but4: color2,
        [chosenButtonId.current]: "red",
        [correctButtonId]: "green"
      });
      setButtonOpacity(0.5);
      setDisplayTimer(5);
      setTimerMax(4);
    }, timer);

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

  window.addEventListener('beforeunload', (event) => {
    history.push(`/main`);
  })

  let imageDisplay = null;

  if (gameMode === "ACTOR" || gameMode === "MIXED") {
    imageDisplay = (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "365px" }}>
        <img src={question.questionLink} className="image" alt="MoviePicture" style={{ width: "340px", height: "365px", objectFit: "cover", objectPosition: "center top", margin: "auto" }} />
      </div>
    );
  } else if (gameMode === "MOVIE" || gameMode === "SHOW") {
    imageDisplay = (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "90%", width: "100%" }}>
        <img src={question.questionLink} className="image" alt="MoviePicture" style={{ height: "365px", objectFit: "cover", objectPosition: "center top", margin: "auto" }} />
      </div>
    );
  } else if (gameMode === "TRAILER") {
    imageDisplay = (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "576px" }}>
        <div className="video-container">
          <div className="video-foreground">
            <YouTube videoId={question.questionLink} opts={opts} onStateChange={handleStateChange} onReady={onReady} ref={playerRef} />
          </div>
        </div>
      </div>
    );
  }


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
              QuestionTimer: {displayTimer}
              <LinearProgress
                variant="determinate"
                color="inherit"
                value={normalise(displayTimer)}
              />
            </Typography>
            {imageDisplay}
            {gameMode === 'TRAILER' ? (
              <div>
                <button onClick={handleMuteUnmuteClick}>
                  {isMuted ? 'Unmute' : 'Mute'}
                </button>
                </div>
              ) : null}
              <div className="dashboard button-container">
                <Grid container spacing={2} color="inherit">
                  <Grid item xs={6}><Button
                    sx={{
                      width : "100%",
                      height: "100%",
                      color: theme.palette.primary.light,
                      backgroundColor: buttonColors.but1,
                      opacity: chosenButtonId.current !== "but1" ? buttonOpacity : 0.75
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
                      opacity: chosenButtonId.current !== "but2" ? buttonOpacity : 0.75
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
                          opacity: chosenButtonId.current !== "but3" ? buttonOpacity : 0.75
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
                          opacity: chosenButtonId.current !== 'but4' ? buttonOpacity : 0.75
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

export default Question;
