import React from 'react';
import { connect } from 'react-redux';

import { setNavBar } from '../../../../actions';
import Back from '../../../../components/Back';

const RulesMap = (props) => {
    props.setNavBar('none');
    return (
        <div>
            <Back />
            <img src="https://i.imgur.com/KWwmvXg.jpg" alt="Map" />
        </div>
    );
};

export default connect(null, { setNavBar })(RulesMap);