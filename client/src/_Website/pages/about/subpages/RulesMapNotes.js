import React from 'react';
import { connect } from 'react-redux';

import { setNavBar } from '../../../../actions';
import Back from '../../../../components/Back';
import img from '../files/map-notes.pdf';

const RulesMapNotes = (props) => {
    props.setNavBar('none');
    return (
        <div>
            <Back />
            <img src={img} alt="Map Notes" />
        </div>
    );
};

export default connect(null, { setNavBar })(RulesMapNotes);