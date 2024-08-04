import React from 'react';
import { Link } from 'react-router-dom';

const Nav = () => {
  return (
    <nav>
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/vote">Vote</Link></li>
        <li><Link to="/create">Create Poll</Link></li>
      </ul>
    </nav>
  );
};

export default Nav;
