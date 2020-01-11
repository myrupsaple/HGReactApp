import React from 'react';
import history from '../history';

const Back = () => {
    const text = `<Back`;
    return(
        <div>
            <button onClick={history.goBack} className="ui button primary">{text}</button>
        </div>
    );
};

export default Back;