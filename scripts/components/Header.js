/*
  Header
  <Header />
*/
import React from 'react';

// Stateless functional component
const Header = ({tagline}) => (
  <header className="top">
    <h1>Catch
      <span className="ofThe">
        <span className="of">of</span>
        <span className="the">the</span>
      </span>day
    </h1>
    <h3 className="tagline"><span>{tagline}</span></h3>
  </header>
);

Header.propTypes = {
  tagline: React.PropTypes.string.isRequired
};

export default Header;