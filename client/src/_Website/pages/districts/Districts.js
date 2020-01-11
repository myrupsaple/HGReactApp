import React from 'react';

import NavBar from '../../components/NavBar';
import gif from '../../_graphics/gifs/Districts.gif';

const Districts = () => {
    return (
        <div className="ui container">
            <NavBar />

            <h1 id="header">Districts and Tributes</h1>

            <img src={gif} alt="Michael Nike" />
        </div>
    );
};

export default Districts;