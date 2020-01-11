import React from 'react';

import Back from '../../../../components/Back';

import img from '../files/map-notes.pdf';

const RulesMapNotes = () => {
    return (
        <div>
            <Back />
            <img src={img} alt="Map Notes" />
        </div>
    );
};

export default RulesMapNotes;