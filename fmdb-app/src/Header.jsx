import React from 'react';
import logo from "./assets/movieIcon.png";

function Header() {
    return (
        <header className="header">
            <img src={logo} alt="logo" className="logo"/>
            <h1>FMdb</h1>
            <button className="header-button">Log In</button>
        </header>
    );
}

export default Header;