import React from 'react';

import NavBar from '../components/NavBar';

import gif from '../_graphics/gifs/Watch.gif';

const Watch = () => {
    return(
        <>
            <NavBar />
            <div className="ui-container">
                <h1 id="header">Watch the Games</h1>

                <img src={gif} alt="Michael Youtube" />

                <h3>Want to Watch?</h3>
                <p>
                    We will be livestreaming the event from <a href='http://twitch.tv/ivhungergames'>Twitch</a>. Here, you'll be able
                    to view live commentary, game stats, and a live feed of what's happening
                    in the arena.
                </p>
            </div>
        </>
    );
};

export default Watch;