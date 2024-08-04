import React from 'react';
import { Link } from 'react-router-dom';
import './Heading.css';

const Header = () => {
  return (
    <div className="header-container">
      <h1 className="header-title">
        <Link to="/" className="header-link">FlyWeight Polls</Link>
      </h1>
    </div>
  );
};

export default Header;
