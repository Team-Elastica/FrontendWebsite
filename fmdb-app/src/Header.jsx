import React from 'react';
import { useNavigate } from 'react-router-dom';
import logo from './assets/movieIcon.png';

function Header({ user, setUser }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    setUser(null);
    navigate('/');
  };

  return (
    <header className="header">
      <div className="header-left" onClick={() => navigate('/')}>
        <img src={logo} alt="logo" className="logo" />
        <h1>FMdb</h1>
      </div>
      <div className="header-right">
        {user && (
          <>
            <button
              className="header-button"
              onClick={() => navigate('/favorites')}
            >
              Favorites
            </button>
            <span className="user-email">{user.email}</span>
            <button className="header-button" onClick={handleLogout}>
              Log Out
            </button>
          </>
        )}
        {!user && (
          <button className="header-button" onClick={() => navigate('/login')}>
            Log In
          </button>
        )}
      </div>
    </header>
  );
}

export default Header;
