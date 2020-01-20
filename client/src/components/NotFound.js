import React from 'react';

import { Button, Nav } from 'react-bootstrap';

const NotFound = () => {
    return (
        <>
            <div className="ui container">
                <h3>404 - Sorry, the requested page was not found.</h3>
                <div className="col-2" >
                    <Button as={Nav.Link} href="/" variant="danger">
                        Return Home
                    </Button>
                </div>
            </div>
        </>
    );
};

export default NotFound;