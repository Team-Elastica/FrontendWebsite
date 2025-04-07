import React from "react";
import "./assets/css/Hero.css";
import {ReactTyped} from "react-typed";

function Hero() {
    return (
        <div className="hero-container">
            <p className="first-line">Welcome to FMdb</p>
            <h1 className="second-line">Your Ultimate Media Database</h1>
            <div className="hero-typed">
                <h1 className="third-line">Search for your</h1>
                <ReactTyped
                    className="typed-text"
                    strings={["Movies", "TV Shows", "Games"]}
                    typeSpeed={100}
                    backSpeed={80}
                    loop
                />
            </div>
        </div>
    );
}

export default Hero;