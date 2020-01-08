import React from 'react';
import { Link } from 'react-router-dom';
import GoogleAuth from './GoogleAuth';

const NavBar = () => {
    return(
        <div className="ui secondary menu">
            <Link to="/" className="item">
                Home
            </Link>
            <div className="ui dropdown item">
                About
                <i className="dropdown icon"></i>
                <div className="menu">
                    <div className="item">About Hunger Games</div>
                    <div className="item">About InterVarsity</div>
                </div>
            </div>
            <a className="item">
                Districts
            </a>
            <a className="item">
                Donate
            </a>
            <a className="item">
                Watch
            </a>
            <a className="item">
                Log In
            </a>
            <a className="item">
                Updates
            </a>
            <div className="right menu">
                <GoogleAuth />
            </div>
        </div>
    );
};

export default NavBar;