var React = require('react');
var ReactDOM = require('react-dom');
var CSSTransitionGroup = require('react-addons-css-transition-group');

var ReactRouter = require('react-router');
var Router = ReactRouter.Router;
var Route = ReactRouter.Route;
var History = ReactRouter.History;
// Set up pushState for clean URLs and preserve history
var createBrowserHistory = require('history/lib/createBrowserHistory');

var h = require('./helpers');

// Firebase
var Rebase = require('re-base');
var base = Rebase.createClass('https://torrid-inferno-7394.firebaseio.com/');

// React Catalyst for two-way data binding
var Catalyst = require('react-catalyst');

/*
  App
 */
var App = React.createClass({
  mixins: [Catalyst.LinkedStateMixin],
  getInitialState() {
    return {
      fishes: {},
      order: {}
    };
  },
  componentDidMount() {
    base.syncState(this.props.params.storeId + '/fishes', {
      context: this,
      state: 'fishes'
    });

    // Restore order from localStorage
    const localStorageRef = localStorage.getItem('order-' + this.props.params.storeId);
    if (localStorageRef) {
      this.setState({
        order: JSON.parse(localStorageRef)
      });
    }
  },
  componentWillUpdate(nextProps, nextState) {
    localStorage.setItem('order-' + this.props.params.storeId, JSON.stringify(nextState.order));
  },
  addFish(fish) {
    const timestamp = (new Date()).getTime();
    // Update state object
    const fishes = Object.assign({}, this.state.fishes, {['fish-' + timestamp]: fish});
    // Set the state by passing object of what has changed
    this.setState({fishes});
  },
  removeFish(index) {
    if (confirm("Are you sure you want to remove this fish?")) {
      const fishes = Object.assign({}, this.state.fishes, {[index]: null});
      this.setState({fishes});
    }
  },
  loadSamples() {
    this.setState({
      fishes: require('./sample-fishes')
    });
  },
  renderFish(key) {
    return (
      <Fish key={key} index={key} details={this.state.fishes[key]} addToOrder={this.addToOrder} />
    );
  },
  addToOrder(index) {
    const quantity = this.state.order[index] + 1 || 1;
    const order = Object.assign({}, this.state.order, {[index]: quantity});
    // Set the state by passing object of what has changed
    this.setState({order});
  },
  removeFromOrder(index) {
    const order = Object.assign({}, this.state.order);
    delete order[index];
    this.setState({order});
  },
  render() {
    return (
      <div className="catch-of-the-day">
        <div className="menu">
          <Header tagline="Fresh Seafood Market" />
          <ul className="list-of-fishes">
            {Object.keys(this.state.fishes).map(this.renderFish)}
          </ul>
        </div>
        <Order fishes={this.state.fishes} order={this.state.order} removeFromOrder={this.removeFromOrder} />
        <Inventory fishes={this.state.fishes} addFish={this.addFish} removeFish={this.removeFish} loadSamples={this.loadSamples} linkState={this.linkState} />
      </div>
    )
  }
});

/*
  Fish
  <Fish />
 */
var Fish = React.createClass({
  onAddToOrderClick() {
    this.props.addToOrder(this.props.index);
  },
  render() {
    const {name, price, status, desc, image} = this.props.details;
    const isAvailable = (status === 'available' ? true: false);
    const buttonText = (isAvailable ? 'Add to Order': 'Sold Out!');
    return (
      <li className="menu-fish">
        <img src={image} alt={name} />
        <h3 className="fish-name">{name}
          <span className="price">{h.formatPrice(price)}</span>
        </h3>
        <p>{desc}</p>
        <button onClick={this.onAddToOrderClick} disabled={!isAvailable}>{buttonText}</button>
      </li>
    );
  }

});

/*
  Add Fish Form
  <AddFishForm />
 */
var AddFishForm = React.createClass({
  createFish(event) {
    // Stop form from submitting
    event.preventDefault();
    // Take data from the form and create an object
    const fish = {
      name: this.refs.name.value,
      price: this.refs.price.value,
      status: this.refs.status.value,
      desc: this.refs.desc.value,
      image: this.refs.image.value
    };
    // Add the fish to the App State
    // Calls addFish method of <App />
    this.props.addFish(fish);
    this.refs.fishForm.reset();
  },
  render() {
    return (
      <form className="fish-edit" ref="fishForm" onSubmit={this.createFish}>
        <input type="text" ref="name" placeholder="Fish Name" />
        <input type="text" ref="price" placeholder="Fish Price" />
        <select ref="status">
          <option value="available">Fresh!</option>
          <option value="unavailable">Sold Out!</option>
        </select>
        <textarea type="text" ref="desc" placeholder="Desc"></textarea>
        <input type="text" ref="image" placeholder="URL to image" />
        <button type="submit">+ Add Item</button>
      </form>
    );
  }
});

/*
  Header
  <Header />
*/
var Header = React.createClass({
  render() {
    const {tagline} = this.props;
    return (
      <header className="top">
        <h1>Catch
          <span className="ofThe">
            <span className="of">of</span>
            <span className="the">the</span>
          </span>day
        </h1>
        <h3 className="tagline"><span>{tagline}</span></h3>
      </header>
    )
  }
});

/*
  Order
  <Order />
*/
var Order = React.createClass({
  renderOrder(index) {
    const {order, fishes} = this.props;
    const fish = fishes[index];
    const count = order[index];
    const removeButton = <button onClick={this.props.removeFromOrder.bind(null, index)}>&times;</button>

    if (!fish) {
      return <li key={index}>Sorry, fish no longer available! {removeButton}</li>
    }
    return (
      <li key={index}>
        <span>
          <CSSTransitionGroup
            className="count"
            component="span"
            transitionName="count"
            transitionEnterTimeout={250}
            transitionLeaveTimeout={250}>
            <span key={count}>{count}</span>
          </CSSTransitionGroup>
          lbs {fish.name} {removeButton}
        </span>
        <span className="price">{h.formatPrice(count * fish.price)}</span>
      </li>
    )
  },
  render() {
    const {order, fishes} = this.props;
    const orderIds = Object.keys(order);
    const total = orderIds.reduce((prevTotal, index) => {
      const fish = fishes[index];
      const count = order[index];
      const isAvailable = fish && fish.status === 'available';
      if (fish && isAvailable) {
        return prevTotal + (count * parseInt(fish.price) || 0);
      }
      return prevTotal;
    }, 0);
    return (
      <div className="order-wrap">
        <h2 className="order-title">Your Order</h2>
        <CSSTransitionGroup
          className="order"
          component="ul"
          transitionName="order"
          transitionEnterTimeout={500}
          transitionLeaveTimeout={500}>
          {orderIds.map(this.renderOrder)}
          <li className="total">
            <strong>Total:</strong>
            {h.formatPrice(total)}
          </li>
        </CSSTransitionGroup>
      </div>
    )
  }
});

/*
  Inventory
  <Inventory />
*/
var Inventory = React.createClass({
  renderInventory(index) {
    // Trigger state update from a form field update
    return (
      <div className="fish-edit" key={index}>
        <input type="text" valueLink={this.props.linkState('fishes.' + index + '.name')} />
        <input type="text" valueLink={this.props.linkState('fishes.' + index + '.price')} />
        <select valueLink={this.props.linkState('fishes.' + index + '.status')}>
          <option value="available">Fresh!</option>
          <option value="unavailable">Sold Out!</option>
        </select>
        <textarea type="text" valueLink={this.props.linkState('fishes.' + index + '.desc')}></textarea>
      <input type="text" valueLink={this.props.linkState('fishes.' + index + '.image')} />
      <button onClick={this.props.removeFish.bind(null, index)}>Remove Fish</button>
      </div>
    );
  },
  render() {
    return (
      <div>
        <h2>Inventory</h2>
        {Object.keys(this.props.fishes).map(this.renderInventory)}
        <AddFishForm {...this.props} />
        <button onClick={this.props.loadSamples}>Load Sample Fishes</button>
      </div>
    )
  }
});

/*
  StorePicker
  This will let us make <StorePicker/>
*/
var StorePicker = React.createClass({
  mixins: [History],
  goToStore(event) {
    event.preventDefault();
    // Get data from input
    let storeId = this.refs.storeId.value;
    this.history.pushState(null, '/store/' + storeId);
    // Transition from <StorePicker /> to <App />
  },
  render() {
    return (
      <form className="store-selector" onSubmit={this.goToStore}>
        <h2>Please Enter a Store</h2>
        <input type="text" ref="storeId" defaultValue={h.getFunName()} required />
        <input type="submit" />
      </form>
    )
  }
});

/*
  Routes
*/
var routes = (
  <Router history={createBrowserHistory()} >
    <Route path="/" component={StorePicker} />
    <Route path="/store/:storeId" component={App} />
  </Router>
);

ReactDOM.render(routes, document.getElementById('main'));
