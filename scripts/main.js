import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route } from 'react-router';
// Set up pushState for clean URLs and preserve history
import { createHistory } from 'history';

/*
  Import Components
 */
import App from './components/App';
import StorePicker from './components/StorePicker';
import NotFound from './components/NotFound';

/*
  Routes
*/
const routes = (
  <Router history={createHistory()} >
    <Route path="/" component={StorePicker} />
    <Route path="/store/:storeId" component={App} />
    <Route path="*" component={NotFound} />
  </Router>
);

ReactDOM.render(routes, document.getElementById('main'));
