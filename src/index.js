import React from "react";
import ReactDOM from "react-dom";
import "styles/index.scss";
import App from "App";
import { configureStore} from "@reduxjs/toolkit";
import { Provider  } from "react-redux";
import {gameSlice} from "./gameSlice";

/**
 * This is the entry point of your React application where the root element is in the public/index.html.
 * We call this a “root” DOM node because everything inside it will be managed by React DOM.
 * Applications built with just React usually have a single root DOM node.
 * More: https://reactjs.org/docs/rendering-elements.html
 */

const store = configureStore({
    reducer: gameSlice.reducer
});


ReactDOM.render(
    <Provider store= {store}>
        <App />
    </Provider>,
    document.getElementById("root"));
