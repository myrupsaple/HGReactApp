import React from 'react';
import NavBar from '../components/NavBar';

const Updates = () => {
    return(
        <div className="ui container">
            <NavBar />

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
            <h5>November 29-January 7</h5>
            <ol>
                <li>Took a break to work and learn new stuff</li>
            </ol>
            <h5>January 8</h5>
            <ol>
                <li>Migrated the entire site onto React</li>
                <li>Set up the API to handle login and user identification</li>
            </ol>
            <h5>January 9</h5>
            <ol>
                <li>Fixed some bugs on the Google OAuth component</li>
                <li>Set up connection to the App side (from the website side)</li>
            </ol>
            <h5>January 10</h5>
            <ol>
                <li>Added customization of display for users based on permissions</li>
                <li>Added routes to the App side</li>
                <li>Added template pages to the App side</li>
            </ol>
            <h5>January 11</h5>
            <ol>
                <li>Began implementation of modify users page</li>
                <li>The list of users can be stored and rendered out</li>
            </ol>
            <h5>January 13</h5>
            <ol>
                <li>Fixed the navbar color bug</li>
                <li>Finished implementing user edit/delete features</li>
                <li>Also added some styling to make things look nicer</li>
            </ol>
        </div>
    );
};

export default Updates;