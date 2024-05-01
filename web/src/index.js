import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

import "./assets/scss/app.scss";

import {BrowserRouter} from 'react-router-dom';
import {createStore} from 'redux';
import {Provider} from "react-redux";
import reducer from './Reducers'

const store = createStore(reducer, {}, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());

ReactDOM.render(
    <Provider store={store}>
        <BrowserRouter>
            <App/>
        </BrowserRouter>
    </Provider>, document.getElementById('root')
);