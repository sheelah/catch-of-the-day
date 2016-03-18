/*
  Fish
  <Fish />
 */
import React from 'react';
import autobind from 'autobind-decorator';
import h from '../helpers';

@autobind
class Fish extends React.Component {

  onAddToOrderClick() {
    this.props.addToOrder(this.props.index);
  }

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
}

export default Fish;