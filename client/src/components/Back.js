import React from 'react';
import history from '../history';
import { Button } from 'react-bootstrap';

const Back = () => {
    const text = `<<Go Back<<`;
    return(
        <div>
            <Button variant="info" onClick={history.goBack} className="ui button primary">{text}</Button>
        </div>
    );
};

export default Back;