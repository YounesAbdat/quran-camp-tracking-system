import React from 'react';
import logo from '../../public/logo.png';

const Header = () => (
  <header style={{ background: '#800000', padding: '1rem', display: 'flex', alignItems: 'center' }}>
    <img src={logo} alt="Logo" style={{ height: 60, marginRight: 16 }} />
    <h1 style={{ color: 'white' }}>Quran Camp Tracking System</h1>
  </header>
);

export default Header;
