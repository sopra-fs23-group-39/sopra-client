import {Redirect, Route} from "react-router-dom";
import Main from "components/views/Main";
import PropTypes from 'prop-types';

const MainRouter = props => {
  /**
   * "this.props.base" is "/app" because as been passed as a prop in the parent of GameRouter, i.e., App.js
   */
  return (
    <div style={{display: 'flex', flexDirection: 'column'}}>
      <Route exact path={`${props.base}`}>
        <Main />
      </Route>
      <Route exact path={`${props.base}`}>
        <Redirect to={`${props.base}`}/>
      </Route>
    </div>
  );
};
/*
* Don't forget to export your component!
 */

MainRouter.propTypes = {
    base: PropTypes.string
}

export default MainRouter;