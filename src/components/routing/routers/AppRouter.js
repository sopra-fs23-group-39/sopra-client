import {BrowserRouter, Redirect, Route, Switch} from "react-router-dom";
import {MainGuard} from "components/routing/routeProtectors/MainGuard";
import {LoginGuard} from "components/routing/routeProtectors/LoginGuard";
import Main from "../../views/other/Main";
import Login from "components/views/other/Login";
import Register from "components/views/other/Register";
import Profile from "components/views/other/Profile";
import ChangeProfile from "../../views/other/ChangeProfile";
import GameSelection from "components/views/game/GameSelection";
import JoinGame from "components/views/game/JoinGame";
import Game from "../../views/game/Game";
import Leaderboard from "components/views/other/Leaderboard";
import Question from "../../views/game/Question";
import {ChangeProfileGuard} from "../routeProtectors/ChangeProfileGuard";
import {QuestionGuard} from "../routeProtectors/QuestionGuard";
import Standings from "../../views/game/Standings";
import Winner from "components/views/game/Winner";
import GameFormat from "../../views/game/GameFormat";
import RapidSelection from "../../views/game/RapidSelection"
import RapidGame from "../../views/game/RapidGame"
import RapidQuestion from "../../views/game/RapidQuestion"


const AppRouter = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/">
          <Redirect to="/main"/>
        </Route>
        <Route exact path="/main">
          <MainGuard>
            <Main />
          </MainGuard>
        </Route>
        <Route exact path="/login">
          <LoginGuard>
            <Login />
          </LoginGuard>
        </Route>
        <Route exact path="/register">
          <LoginGuard>
            <Register />
          </LoginGuard>
        </Route>
        <Route exact path="/profile/:id">
          <MainGuard>
            <Profile />
          </MainGuard>
        </Route>
        <Route exact path="/changes/:id" render={(props) => (
          <ChangeProfileGuard {...props}>
            <ChangeProfile />
          </ChangeProfileGuard>
        )} />
        <Route exact path="/join">
          <MainGuard>
            <JoinGame />
          </MainGuard>
        </Route>
        <Route exact path="/leaderboard">
          <MainGuard>
            <Leaderboard />
          </MainGuard>
        </Route>
        <Route exact path="/game_format">
          <MainGuard>
            <GameFormat />
          </MainGuard>
        </Route>
        <Route exact path="/game_selection">
          <MainGuard>
            <GameSelection />
          </MainGuard>
        </Route>
        <Route exact path="/game/:gameId" render={(props) => (
          <QuestionGuard {...props}>
            <Game />
          </QuestionGuard>
        )} />
        <Route exact path="/game/:gameId/question" render={(props) => (
          <QuestionGuard {...props}>
            <Question />
          </QuestionGuard>
        )} />
        <Route exact path="/game/:gameId/standings" render={(props) => (
          <QuestionGuard {...props}>
            <Standings />
          </QuestionGuard>
        )} />>
        <Route exact path='/game/:gameId/winner' render={(props) => (
          <QuestionGuard {...props}>
            <Winner />
          </QuestionGuard>
        )} />>
        <Route exact path='/rapid_selection'>
          <MainGuard>
            <RapidSelection />
          </MainGuard>
        </Route>
        <Route exact path='/gamerapid/:gameId' render={(props) => (
          <QuestionGuard {...props}>
            <RapidGame />
          </QuestionGuard>
        )} />
        <Route exact path ='/gamerapid/:gameId/question' render={(props) => (
          <QuestionGuard {...props}>
            <RapidQuestion />
          </QuestionGuard>
          )} />
        <Redirect to="/main" />
      </Switch>
    </BrowserRouter>
  );
};

export default AppRouter;
