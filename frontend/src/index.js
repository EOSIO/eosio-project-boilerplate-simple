import React from 'react';
import ReactDOM from 'react-dom';

import {Provider} from 'react-redux';
import {createStore, applyMiddleware} from 'redux';
import reduxThunk from 'redux-thunk';
import reducers from './reducers';

import { Switch, Route, Router } from 'react-router';
import createBrowserHistory from 'history/createBrowserHistory';

import Home from './pages/Home';
import Main from './pages/Main';

const createStoreWithMiddleware = applyMiddleware(reduxThunk)(createStore);
const history = createBrowserHistory();

ReactDOM.render(
  <Provider store={createStoreWithMiddleware(reducers)}>
    <Router history={history}>

      <Switch>

        <Route exact path='/' component={ Home } />
        <Route exact path='/main' component={ Main } />
      
      </Switch>

    </Router>
  </Provider>
  ,document.getElementById('root')
);
