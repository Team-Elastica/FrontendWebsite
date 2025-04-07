import React from 'react';
import { useNavigate } from 'react-router-dom';
import logo from "./assets/movieIcon.png";

function Header({ user }) {
  const navigate = useNavigate();

  return (
    <header className="header">
      <div className="header-left">
        <img src={logo} alt="logo" className="logo" />
        <h1>FMdb</h1>
      </div>
      <div className="header-right">
        {user ? (
          <span className="user-email">{user.email}</span>
        ) : (
          <button className="header-button" onClick={() => navigate('/login')}>
            Log In
          </button>
        )}
      </div>
    </header>
  );
}

export default Header;
