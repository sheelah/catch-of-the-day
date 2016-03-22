/*
  Inventory
  <Inventory />
*/
import React from 'react';
import autobind from 'autobind-decorator';
import AddFishForm from './AddFishForm';
import config from '../config';
import Firebase from 'firebase';
const ref = new Firebase(config.firebaseUrl);

@autobind
class Inventory extends React.Component {

  constructor() {
    super(); // Need this to set state
    this.state = {
      uid: '',
      owner: ''
    };
  }

  componentWillMount() {
    // Check for login token in local storage
    const token = localStorage.getItem('token');
    if (token) {
      // Send token to Firebase
      ref.authWithCustomToken(token, this.authHandler);
    }
  }

  authenticate(provider) {
    ref.authWithOAuthPopup(provider, this.authHandler);
  }

  authHandler(err, authData) {
    if (err) {
      console.log(err);
      return;
    }

    // Save login token in the browser so it persists across reloads
    localStorage.setItem('token', authData.token);

    const storeRef = ref.child(this.props.params.storeId);
    storeRef.on('value', (snapshot) => {
      let data = snapshot.val() || {};

      // Claim it as user's store if no owner is set
      if (!data.owner) {
        storeRef.set({
          owner: authData.uid
        });
      }

      // Update state with new store owner and user
      this.setState({
        uid: authData.uid,
        owner: data.owner || authData.uid
      });
    });
  }

  logoutHandler() {
    // Log user out of Firebase
    ref.unauth();
    // Remove local storage token
    localStorage.removeItem('token');
    this.setState({
      uid: null
    });
  }

  renderLogin() {
    return (
      <nav className="login">
        <h2>Inventory</h2>
        <p>Sign in to manage your store's inventory</p>
        <button className="github" onClick={this.authenticate.bind(this, 'github')}>Log In with Github</button>
        <button className="facebook" onClick={this.authenticate.bind(this, 'facebook')}>Log In with Facebook</button>
        <button className="twitter" onClick={this.authenticate.bind(this, 'twitter')}>Log In with Twitter</button>
      </nav>
    );
  }

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
    const logoutButton = <button onClick={this.logoutHandler}>Log Out</button>;
    // First check if user isn't logged in
    if (!this.state.uid) {
      return (
        <div>
          {this.renderLogin()}</div>
      )
    }

    // Check if user doesn't own current store
    if (this.state.uid !== this.state.owner) {
      return (
        <div>
          <p>Sorry, you aren't the owner of the store.</p>
          {logoutButton}
        </div>
      );
    }
    return (
      <div>
        <h2>Inventory</h2>
        {logoutButton}
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