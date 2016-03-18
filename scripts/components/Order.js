/*
  Order
  <Order />
*/
import React from 'react';
import CSSTransitionGroup from 'react-addons-css-transition-group';
import h from '../helpers';

var Order = React.createClass({
  propTypes: {
    order: React.PropTypes.object.isRequired,
    fishes: React.PropTypes.object.isRequired,
    removeFromOrder: React.PropTypes.func.isRequired
  },
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

export default Order;