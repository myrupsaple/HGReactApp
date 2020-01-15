import React from 'react';

import NavBar from '../components/NavBar';

import gif from '../_graphics/gifs/Under-Construction.gif';

const Home = () => {
    return(
        <>
            <NavBar />
            <div className="ui-container">
                <div className="background" id="bg1">
                    <h3 className="bg-text" id="bgt1">The Hunger Games.</h3>
                </div>


                <div className="content" id="content1">
                    <h2 id="header">Under Construction</h2>

                    <img src={gif} alt="Dunder Mifflin Logo"/>
                </div>


                <div className="background" id="bg2">
                    <h3 className="bg-text" id="bgt2">App Coming Soon.</h3>
                </div>
            </div>  
        </>
    );
};

export default Home;