import React from 'react';

import NavBar from '../components/NavBar';

import gif from '../_graphics/gifs/Under-Construction.gif';

const Home = () => {
    const dark = 'coolor-text-green-darken-2'
    const light = 'coolor-text-green-accent-3';

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
                    <h3 className="bg-text" id="bgt2">
                        App coming <span className={dark}>S</span><span className={light}>p</span><span className={dark}>r</span><span className="coolor-text-green-accent-3">i</span><span className={dark}>n</span><span className="coolor-text-green-accent-3">g</span><span className={dark}> </span><span className={dark}>2</span><span className="coolor-text-green-accent-3">0</span><span className={dark}>2</span><span className="coolor-text-green-accent-3">0</span><span className={dark}>!</span>
                    </h3>
                </div>

                <h4>
                    App Beta Testers: Sign in on the top right with the Google account you provided during setup.
                    Once you sign in, you should see a welcome message with a dropdown menu. The dropdown menu
                    will have a button that allows you to access the app.
                </h4>
            </div>  
        </>
    );
};

export default Home;