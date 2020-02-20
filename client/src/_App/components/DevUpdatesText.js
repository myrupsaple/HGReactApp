import React from 'react';

const DevUpdatesText = () =>{
    return(
        <>
        <h1>Development Updates and Things to Look Out For</h1>
        <h5>If you run into any errors, please notify me by sending a screenshot and a description of how you got to the error. Thanks!</h5>
        <h4>February 19</h4>
        <ol>
            <li>Finished up game status page including a scoreboard with basic information on all tributes</li>
            <li>Added life event viewing to the tribute dashboard page</li>
            <li>Created mentor dashboard with warnings when a mentor's tributes are close to losing a life or being eliminated</li>
        </ol>
        <h4>February 18</h4>
        <ol>
            <li>Completed server-side game event handling</li>
            <li>Game managment page now allows for direct tribute stat modification</li>
            <li>Added appropriate warnings when user attempts to add game events with a time that has already passed</li>
            <li>Tribute dashboard now displays personalized stats and allows for resource code submission</li>
        </ol>
        <h4>February 17</h4>
        <ol>
            <li>Global events can now be created, modified, and deleted from the game management page</li>
            <li>Added features to the game management page allowing game state to be modified</li>
            <li>Added server-side features to deal with game events</li>
        </ol>
        <h4>February 15</h4>
        <ol>
            <li>Began implementing game events (food required, mutts released, etc.)</li>
            <li>Item pricing will now be adjusted based on the time</li>
        </ol>
        <h4>February 11</h4>
        <ol>
            <li>More debugging</li>
            <li>Began implementing the tribute dashboard page.</li>
        </ol>
        <h4>February 10</h4>
        <ol>
            <li>Mentors will now be unable to request a purchase if the tribute has insufficient funds</li>
            <li>Fixed other various bugs.</li>
        </ol>
        <h4>February 9</h4>
        <ol>
            <li>Added proper error reporting to all components. If the server does not properly process a request, the user will now be notified.</li>
        </ol>
        <h4>February 8</h4>
        <ol>
            <li>Finished implementing form validation on all pages</li>
            <li>Also added measures to prevent duplicate account emails and resource codes from being submitted</li>
        </ol>
        <h4>February 7</h4>
        <ol>
            <li>Began implementing better form validation with feedback</li>
        </ol>
        <h4>February 3</h4>
        <ol>
            <li>Mostly finished connecting components. Everything is now hooked up to the tribute_stats database</li>
        </ol>
        <h4>February 1</h4>
        <ol>
            <li>Began connecting various components. Changes are mostly behind-the-scenes for now.</li>
        </ol>
        <h4>January 31</h4>
        <ol>
            <li>Purchase Requests are almost fully functional. Item purchases deduce tribute funds and item quantity appropriately.</li>
            <li>Began testing and debugging all other features.</li>
        </ol>
        <h4>January 30</h4>
        <ol>
            <li>Continued implementing purchase request features</li>
        </ol>
        <h4>January 29</h4>
        <ol>
            <li>Started implementing purchase request features</li>
        </ol>
        <h4>January 28</h4>
        <ol>
            <li>Began backend work on purchase requests page</li>
        </ol>
        <h4>January 27</h4>
        <ol>
            <li>Implemented Items List</li>
            <li>Code refactoring and debugging day</li>
        </ol>
        <h4>January 25</h4>
        <ol>
            <li>Implemented Resource List and Resource Event Tabs</li>
        </ol>
        <h4>January 24</h4>
        <ol>
            <li>Changed the styling a bit</li>
        </ol>
        <h4>January 22</h4>
        <ol>
            <li>Completed the life event tracking page. Includes additional search filters and a fully functional create/edit form.</li>
        </ol>
        <h4>January 21</h4>
        <ol>
            <li>Began work on the life tracking page. Implemented enough to allow the list of events to be displayed</li>
        </ol>
        <h4>January 20</h4>
        <h5 className="coolor-text-red-darken-2">Please take a look at the Funds Management section and try adding some entries! Add tributes too, if necessary</h5>
        <ol>
            <li>Finished up the Funds Tracking page and added a 'tags' section. This could be used to label different items (eg. 'Boba fundraiser')</li>
            <li>Game start time can now be adjusted from the 'Manage Game State' component</li>
        </ol>
        <h4>January 19</h4>
        <ol>
            <li>Almost completed implementation of the Funds Tracking page. Search by Tribute Name does not work yet.</li>
            <li>Donation items can be searched by donation amount ranges, date ranges, donation method, and donor name.</li>
        </ol>
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