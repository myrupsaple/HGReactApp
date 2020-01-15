import React from 'react';

import AppNavBar from '../components/AppNavBar';

const AppHome = () => {
    return(
        <>
            <AppNavBar />
            <div className="ui-container">
                <h3>
                    Welcome to the Hunger Games App!
                </h3>
                <h5>
                I'd greatly appreciate any feedback you can provide as I release
                new features on this app. If you run into any errors, please screenshot
                the message and send it to me, summarizing as best as possible the actions you
                took that led to the error. It'll help me out a lot as I work out
                any bugs in the system.
                </h5>
                <h5>
                Feel free to do whatever you want. Just don't delete any of the real users
                or change their permissions/email. If you do they won't be able to
                log in until I reset it manually. And don't delete my account please.
                I haven't added any protections against people doing that.
                </h5>
                <h6>
                Legend for the menu bar:
                </h6>
                <p>
                    Items in the menu with a * next to them have not yet been implemented. 
                </p>
                <p>
                    Items with a ^ next to them are in progress. 
                </p>
                <p>
                    Items with a + are just about complete
                </p>
            </div>
        </>
    );
};

export default AppHome;
