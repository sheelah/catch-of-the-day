/*
  StorePicker
  This will let us make <StorePicker/>
*/
import React from 'react';
import { History } from 'react-router';
import h from '../helpers';

const StorePicker = React.createClass({
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

export default StorePicker;