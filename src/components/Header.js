import React from 'react';
import { Link } from 'gatsby';

import Container from 'components/Container';

const Header = () => {
  function clearFeatureGroup() {
    const fg = this.fgRef.current.leafletElement;
    fg.clearLayers();
  }

  return (
    <header>
      <Container type="content">
        <p>Covid-19 Map</p>
        <ul>
          <li>
            <Link to="/" onClick={clearFeatureGroup}>Home</Link>
          </li>
          <li>
            <Link to="/page-2/">Page 2</Link>
          </li>
          <li>
            <Link to="/us-map/" onClick={clearFeatureGroup}>California</Link>
          </li>
        </ul>
      </Container>
    </header>
  );
};

export default Header;
