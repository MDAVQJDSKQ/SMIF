import React from 'react';
import { Link } from 'react-router-dom';

function Navigation() {
  return (
    <nav>
      <ul>
        <li><Link to="/">FMP Visualizer</Link></li>
        <li><Link to="/scraper">FMP Scraper</Link></li>
        <li><Link to="/sliding">Sliding Correlation</Link></li>
        <li><Link to="/transcript">Transcript Analyzer</Link></li>
      </ul>
    </nav>
  );
}

export default Navigation;
