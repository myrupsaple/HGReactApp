import React from 'react';
import { Link } from 'react-router-dom';
import { Dropdown } from "semantic-ui-react";

//------------------------------OWNER, ADMIN, GM--------------------------------//

const ModifyUsersOwner = (
    <Dropdown.Item>
        <Link to="/App/owner/modify-users">
            Modify Users (Owner)
        </Link>
    </Dropdown.Item>
);

const ModifyUsers = (
    <Dropdown.Item>
        <Link to="/App/admin/modify-users">
            Modify Users
        </Link>
    </Dropdown.Item>
);

const ManageGameState = (
    <Dropdown.Item>
        <Link to="/App/gamemaker/manage-game">
            Manage Game State
        </Link>
    </Dropdown.Item>
);

const ModifyTributeStats = (
    <Dropdown.Item>
        <Link to="/App/gamemaker/manage-tribute-stats">
            Modify Tribute Stats
        </Link>
    </Dropdown.Item>
);

const ManageResources = (
    <Dropdown.Item>
        <Link to="/App/gamemaker/manage-resources">
            Manage Resources
        </Link>
    </Dropdown.Item>
);

const ManageItems = (
    <Dropdown.Item>
        <Link to="/App/gamemaker/manage-items">
            Update Item Inventory
        </Link>
    </Dropdown.Item>
);

const UpdateFunds = (
    <Dropdown.Item>
        <Link to="/App/gamemaker/manage-funds">
            Update Funds
        </Link>
    </Dropdown.Item>
);

//---------------------------------MENTORS------------------------------------//

const RequestPurchase = (
    <Dropdown.Item>
        <Link to="/App/mentor/request">
            Request Purchase
        </Link>
    </Dropdown.Item>
);

//---------------------------------TRIBUTES-----------------------------------//

const SubmitCodes = (
    <Dropdown.Item>
        <Link to="/App/tribute/submit">
            Submit Resource Code
        </Link>
    </Dropdown.Item>
);

//---------------------------------HELPERS------------------------------------//

// Also should be accesible to gamemakers
const ViewLocations = (
    <Dropdown.Item>
        <Link to="/App/helper/locations">
            View Tribute Locations
        </Link>
    </Dropdown.Item>
);

//---------------------------------GENERAL------------------------------------//

const Messaging = (
    <Dropdown.Item>
        <Link to="/App/messaging">
            Messaging
        </Link>
    </Dropdown.Item>
);

//---------------------------------EXPORTS------------------------------------//

export const OwnerTools = (
        <Dropdown.Menu>
            {ModifyUsersOwner}
            {Messaging}
            {ManageGameState}
            {ModifyTributeStats}
            {ManageResources}
            {ManageItems}
            {UpdateFunds}
            {ViewLocations}
        </Dropdown.Menu>
)

export const AdminTools = (
        <Dropdown.Menu>
            {ModifyUsers}
            {Messaging}
            {ManageGameState}
            {ModifyTributeStats}
            {ManageResources}
            {ManageItems}
            {UpdateFunds}
            {ViewLocations}
        </Dropdown.Menu>
);

export const GMTools = (
        <Dropdown.Menu>
            {Messaging}
            {ManageGameState}
            {ModifyTributeStats}
            {ManageResources}
            {ManageItems}
            {UpdateFunds}
            {ViewLocations}
        </Dropdown.Menu>
);

export const MentorTools = (
        <Dropdown.Menu>
            {Messaging}
            {RequestPurchase}
        </Dropdown.Menu>
);

export const TributeTools = (
        <Dropdown.Menu>
            {Messaging}
            {SubmitCodes}
        </Dropdown.Menu>
);

export const HelperTools = (
        <Dropdown.Menu>
            {Messaging}
            {ViewLocations}
        </Dropdown.Menu>
);