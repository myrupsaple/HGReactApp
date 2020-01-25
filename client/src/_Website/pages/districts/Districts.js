import React from 'react';
import { connect } from 'react-redux';

import { setNavBar } from '../../../actions';

const Districts = (props) => {
    props.setNavBar('web');
    return (
        <>
            <h1 id="header">Districts and Tributes</h1>
            <img src="https://i.imgur.com/g8bwmIp.gif" alt="Michael Nike" />
        </>
    );
};

export default connect(null, { setNavBar })(Districts);