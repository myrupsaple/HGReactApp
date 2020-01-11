import React from 'react';
import Back from '../../../../components/Back';

const RulesList = () => {
    const link = "https://docs.google.com/document/d/e/2PACX-1vTcnkzZ9Xf1WjFFicwJ9X-NvX9ILtiyX__lr6lGtVejkX4aqL5fyAYjPje-NGZSBCVIPDSzP9UA8Emm/pub?embedded=true";
    return(
        <div>
            <Back />
            <iframe src={link} title="Rules List" width="1000" height="1500"></iframe>
        </div>
    );
};

export default RulesList;