import React from 'react';

import Back from '../../../../components/Back';

import img from '../files/map-2019.jpg';

const RulesMap = () => {
    return (
        <div>
            <Back />
            <img src={img} alt="Map" />
        </div>
    );
};

export default RulesMap;