/*
  Inventory
  <Inventory />
*/
import React from 'react';
import autobind from 'autobind-decorator';
import AddFishForm from './AddFishForm';

@autobind
class Inventory extends React.Component {

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
  }

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
}

Inventory.propTypes = {
  linkState: React.PropTypes.func.isRequired,
  fishes: React.PropTypes.object.isRequired,
  removeFish: React.PropTypes.func.isRequired,
  loadSamples: React.PropTypes.func.isRequired,
  addFish: React.PropTypes.func
};

export default Inventory;