import React from 'react';

import NavBar from '../../components/NavBar';
import gif from '../../_graphics/gifs/Districts.gif';

const Districts = () => {
    return (
        <>
            <NavBar />
            <div className="ui-container">
                <h1 id="header">Districts and Tributes</h1>
                <img src={gif} alt="Michael Nike" />
            </div>
        </>
    );
};

export default Districts;