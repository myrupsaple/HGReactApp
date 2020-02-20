import React from 'react';
import { connect } from 'react-redux';

import { setNavBar } from '../../actions';
import ShowComments from '../components/ShowComments';
import './pageStyle.css';

const AppHome = (props) => {
    props.setNavBar('app');
    return(
        <>
            <h2>
                Welcome to the Hunger Games App!
            </h2>
            <h5 className="coolor-text-red-darken-2">Please note that you must be logged in to access the app's features.</h5>
            <h5>
                The app is mostly finished. All of the core features for managing the game have been implemented. I may add features
                for messaging and location tracking if I have time later on. I'll also try to make things look a bit nicer
                before the app is actually used.
            </h5>
            <h3>
                Feel free to leave any comments or feature requests below
            </h3>
            <ShowComments/>
        </>
    );
};

export default connect(null, { setNavBar })(AppHome);