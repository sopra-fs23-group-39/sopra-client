import {BrowserRouter, Redirect, Route, Switch} from "react-router-dom";
// import {GameGuard} from "components/routing/routeProtectors/GameGuard";
// import GameRouter from "components/routing/routers/GameRouter";
import {MainGuard} from "components/routing/routeProtectors/MainGuard";
import MainRouter from "components/routing/routers/MainRouter";
import {LoginGuard} from "components/routing/routeProtectors/LoginGuard";
import Login from "components/views/Login";
import Register from "components/views/Register";
import Profile from "components/views/Profile";
import ChangeProfile from "../../views/ChangeProfile";
import GameSelection from "components/views/GameSelection";
import JoinGame from "components/views/JoinGame";
import {GameSelectionGuard} from "components/routing/routeProtectors/GameSelectionGuard";
import Game from "../../views/Game";
import {JoinGameGuard} from "components/routing/routeProtectors/JoinGameGuard";
import {LeaderboardGuard} from "components/routing/routeProtectors/LeaderboardGuard";
import Leaderboard from "components/views/Leaderboard";
import Question from "../../views/Question";
import {WaitingRoomGuard} from "../routeProtectors/WaitingRoomGuard";
import WaitingRoomParticipant from "../../views/WaitingRoomParticipant";
import {ChangeProfileGuard} from "../routeProtectors/ChangeProfileGuard";
import {QuestionGuard} from "../routeProtectors/QuestionGuard";

/**
 * Main router of your application.
 * In the following class, different routes are rendered. In our case, there is a Login Route with matches the path "/login"
 * and another Router that matches the route "/game".
 * The main difference between these two routes is the following:
 * /login renders another component without any sub-route
 * /game renders a Router that contains other sub-routes that render in turn other react components
 * Documentation about routing in React: https://reacttraining.com/react-router/web/guides/quick-start
 */
const AppRouter = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/main">
          <MainGuard>
            <MainRouter base="/main"/>
          </MainGuard>
        </Route>
        <Route exact path="/login">
          <LoginGuard>
            <Login/>
          </LoginGuard>
        </Route>
        <Route exact path="/register">
            <LoginGuard>
                <Register />
            </LoginGuard>
        </Route>
        <Route exact path="/">
          <Redirect to="/main"/>
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
          <JoinGameGuard>
            <JoinGame/>
          </JoinGameGuard>
        </Route>
        <Route exact path="/waiting_room_participant">
          <WaitingRoomGuard>
            <WaitingRoomParticipant/>
          </WaitingRoomGuard>
        </Route>
        <Route exact path="/leaderboard">
          <LeaderboardGuard>
            <Leaderboard/>
          </LeaderboardGuard>
        </Route>
        <Route exact path="/game_selection">
          <GameSelectionGuard>
            <GameSelection/>
          </GameSelectionGuard>
        </Route>
        <Route exact path="/game/:gameId">
          <GameSelectionGuard>
            <Game/>
          </GameSelectionGuard>
        </Route>
        <Route exact path="/game/:gameId/question" render={(props) => (
            <QuestionGuard {...props}>
              <Question />
            </QuestionGuard>
        )} />
        <Route exact path='/game/:gameId/standings'>
          Standings
        </Route>
      </Switch>
    </BrowserRouter>
  );
};

export default AppRouter;
