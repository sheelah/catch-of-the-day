var React = require('react');
var ReactDOM = require('react-dom');
var CSSTransitionGroup = require('react-addons-css-transition-group');

var ReactRouter = require('react-router');
var Router = ReactRouter.Router;
var Route = ReactRouter.Route;
// Set up pushState for clean URLs and preserve history
var createBrowserHistory = require('history/lib/createBrowserHistory');

var h = require('./helpers');

// Firebase
var Rebase = require('re-base');
var base = Rebase.createClass('https://torrid-inferno-7394.firebaseio.com/');

/*
  Import Components
 */
 import App from './components/App';
 import NotFound from './components/NotFound';
 import StorePicker from './components/StorePicker';
 import Fish from './components/Fish';
 import AddFishForm from './components/AddFishForm';
 import Header from './components/Header';
 import Inventory from './components/Inventory';
 import Order from './components/Order';


/*
  Routes
*/
var routes = (
  <Router history={createBrowserHistory()} >
    <Route path="/" component={StorePicker} />
    <Route path="/store/:storeId" component={App} />
    <Route path="*" component={NotFound} />
  </Router>
);

ReactDOM.render(routes, document.getElementById('main'));
