import React from 'react';

const DevUpdatesText = () =>{
    return(
        <>
        <h1>Development Updates and Things to Look Out For</h1>
        <h5>Remember, if you run into any errors, please notify me by sending a screenshot and a description of how you got to the error. Thanks!</h5>

        <h4>January 17</h4>
        <ol>
            <li>Added functionality to create, edit, and delete tribute account information</li>
        </ol>
        <h4>January 16</h4>
        <ol>
            <li>Worked out some issues with the login service. Things seem to be stable for now</li>
        </ol>
        <h4>January 15</h4>
        <h5 className="coolor-text-red-darken-2">If you run into any authorization errors or are able to access pages when you shouldn't, please let me know!</h5>
        <ol>
            <li>Will mostly be working on server-side stuff today, so there probably won't be many noticeable changes</li>
            <li>Added some security measures so that users can only access pages if they are logged in and have the proper permission levels</li>
        </ol>
        <h4>January 14</h4>
        <h5 className="coolor-text-red-darken-2">Please test out the Modify Users page! All of the actions appear to work, 
        but there might be some edge cases that cause issues. Let me know if you notice anything that doesn't seem right (even if no errors appear)</h5>
        <ol>
            <li>Set up the app on a server to allow public access</li>
            <li>Users can now be created from the 'modify users' page</li>
            <li>Cleaned up the overall look of things a bit. Navbars now extend the length of the page</li>
            <li>Began working on the game status page. Currently, the clock counts down before 12pm and counts up after 12pm</li>
        </ol>
        <h4>January 13</h4>
        <ol>
            <li>Fixed an issue with the navbar preventing it from maintaining its color on certain pages</li>
            <li>Modify users now has working edit and delete features</li>
            <li>Updated the styling of the modify users page</li>
        </ol>
        <h4>January 11</h4>
        <ol>
            <li>Began working on the modify users page</li>
            <li>Currently, the only functionality is that the users list can be saved and rendered</li>
        </ol>
        <h4>January 10</h4>
        <ol>
            <li>Users will see a different dropdown menu ('___ tools') depending on their permissions</li>
            <li>Set up placeholders for the various pages</li>
        </ol>
        <h4>January 9</h4>
        <ol>
            <li>Fixed some bugs on the Google OAuth login</li>
            <li>Linked the website side to the App side of things</li>
        </ol>
        <h4>January 8</h4>
        <ol>
            <li>Migrated the entire site onto React</li>
            <li>Set up Google OAuth login system</li>
        </ol>
        </>
    );
}

export default DevUpdatesText;