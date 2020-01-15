import React from 'react';

import NavBar from '../../components/NavBar';
import Back from '../../../components/Back';

const NotFound = () => {
    return (
        <>
            <NavBar />
            <div className="ui container">
                <h3>404 Not Found.</h3>
                Sorry, the requested page was not found.
                <Back />
            </div>
        </>
    );
};

export default NotFound;