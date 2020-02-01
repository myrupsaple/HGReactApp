import React from 'react';
import { connect } from 'react-redux';

import { setNavBar } from '../../actions';
import './pageStyle.css';

const AppHome = (props) => {
    props.setNavBar('app');
    return(
        <>
            <h2>
                Welcome to the Hunger Games App!
            </h2>
            <h5 className="coolor-text-red-darken-2">Please note that you must be logged in to access the app's features {'\n'} {'\n'} {'\n'} .</h5>
            <h4 className="coolor-text-blue-darken-3">A note to the beta testing team:</h4>
            <h5>
            I'd greatly appreciate any feedback you can provide as I release
            new features on this app. If you run into any errors, please screenshot
            the message and send it to me, summarizing as best as possible the actions you
            took that led to the error. It'll help me out a lot as I work out
            any bugs in the system.
            </h5>
            <h5>
            Feel free to do whatever you want on here. Just don't delete any of the real users'
            accounts or change their permissions/email. If you do they won't be able to
            log in until I reset it manually. And don't delete my account please.
            I haven't added any protections against people doing that.
            </h5>
            <h6>
            Legend for the menu bar:
            </h6>
            <p>
                * not yet been implemented. 
            </p>
            <p>
                ^ in progress. 
            </p>
            <p>
                + functionally complete, for the most part.
            </p>
            <p>
                - progress paused
            </p>
        </>
    );
};

export default connect(null, { setNavBar })(AppHome);