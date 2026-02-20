import React from 'react';
import { Link, useLocation } from 'react-router-dom';

function Navbar() {
  const location = useLocation();

  return (
    <nav style={styles.nav}>
      <div style={styles.logo}>
        🎯 <span style={styles.logoText}>ApplyTrack</span>
      </div>
      <div style={styles.links}>
        <Link
          to="/"
          style={{
            ...styles.link,
            ...(location.pathname === '/' ? styles.activeLink : {})
          }}
        >
          🏠 Dashboard
        </Link>
        <Link
          to="/board"
          style={{
            ...styles.link,
            ...(location.pathname === '/board' ? styles.activeLink : {})
          }}
        >
          📋 Board
        </Link>
        <Link
          to="/analytics"
          style={{
            ...styles.link,
            ...(location.pathname === '/analytics' ? styles.activeLink : {})
          }}
        >
          📊 Analytics
        </Link>
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0 40px',
    height: '65px',
    background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
    boxShadow: '0 2px 20px rgba(0,0,0,0.3)',
    position: 'sticky',
    top: 0,
    zIndex: 999,
  },
  logo: {
    fontSize: '22px',
    fontWeight: 'bold',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  logoText: {
    background: 'linear-gradient(90deg, #e94560, #4361ee)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    fontSize: '24px',
    fontWeight: '800',
  },
  links: {
    display: 'flex',
    gap: '8px',
  },
  link: {
    color: '#aaa',
    textDecoration: 'none',
    fontSize: '14px',
    fontWeight: '600',
    padding: '8px 16px',
    borderRadius: '8px',
    transition: 'all 0.2s',
  },
  activeLink: {
    color: 'white',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderBottom: '2px solid #e94560',
  },
};

export default Navbar;