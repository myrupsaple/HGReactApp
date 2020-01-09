import React from 'react';

const Updates = () => {
    return(
        <div className="ui container">
            <h3 id="header">Site Updates</h3>
            <h5>November 25</h5>
            <ol>
                <li>Created site pages and set up routes</li>
                <li>Added some content through the Districts page</li>
            </ol>
            <h5>November 26</h5>
            <ol>
                <li>Added content to Donate/Watch page</li>
                <li>Added Rules page under 'About' tab</li>
            </ol>
            <h5>November 27</h5>
            <ol>
                <li>Added some temporary decorations to the home page</li>
                <li>Experimented a bit with <a href="/rocket">backgrounds</a>.</li>
            </ol>
            <h5>November 29-January 8</h5>
            <ol>
                <li>Took a break to work and learn new stuff</li>
            </ol>
            <h5>January 9</h5>
            <ol>
                <li>Migrated the entire site onto React</li>
                <li>Set up the API to handle login and user identification</li>
            </ol>
        </div>
    );
};

export default Updates;