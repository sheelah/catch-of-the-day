/*
  App
 */
import React from 'react';
// React Catalyst for two-way data binding
import Catalyst from 'react-catalyst';
// Firebase
import Rebase from 're-base';
var base = Rebase.createClass('https://torrid-inferno-7394.firebaseio.com/');

// Import components
import Fish from './Fish';
import AddFishForm from './AddFishForm';
import Header from './Header';
import Inventory from './Inventory';
import Order from './Order';

// Import sample fish data
import sampleFishes from '../sample-fishes';

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
      fishes: sampleFishes
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

export default App;