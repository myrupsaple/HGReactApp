import React from 'react';
import gif from '../_graphics/gifs/Login.gif';

const LogIn = () => {
    return(
        <div className="container">
            <h1 id="header">Log In</h1>
            <h2 id="header">(Gamemakers, Mentors, Tributes, and Helpers)</h2>

            <img src={gif} alt="NO." />
        </div>
    );
};

export default LogIn;