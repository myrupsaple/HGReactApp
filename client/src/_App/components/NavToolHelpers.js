import React from 'react';
import { NavDropdown, Nav } from 'react-bootstrap';

//------------------------------OWNER, ADMIN, GM--------------------------------//

const ModifyUsersOwner = (
    <NavDropdown.Item as={Nav.Link} href="/App/owner/modify-users">
        Modify Users (Owner)+
    </NavDropdown.Item>
);

const ModifyUsers = (
    <NavDropdown.Item as={Nav.Link} href="/App/admin/modify-users">
        Modify Users+
    </NavDropdown.Item>
);

const ManageGameState = (
    <NavDropdown.Item as={Nav.Link} href="/App/gamemaker/manage-game">
        Manage Game State*
    </NavDropdown.Item>
);

const ModifyTributeStats = (
    <NavDropdown.Item as={Nav.Link} href="/App/gamemaker/manage-tribute-stats">
        Modify Tribute Stats*
    </NavDropdown.Item>
);

const ManageResources = (
    <NavDropdown.Item as={Nav.Link} href="/App/gamemaker/manage-resources">
        Manage Resources*
    </NavDropdown.Item>
);

const ManageItems = (
    <NavDropdown.Item as={Nav.Link} href="/App/gamemaker/manage-items">
        Update Item Inventory*
    </NavDropdown.Item>
);

const UpdateFunds = (
    <NavDropdown.Item as={Nav.Link} href="/App/gamemaker/manage-funds">
        Update Funds*
    </NavDropdown.Item>
);

//---------------------------------MENTORS------------------------------------//

const RequestPurchase = (
    <NavDropdown.Item as={Nav.Link} href="/App/mentor/request">
        Request Purchase*
    </NavDropdown.Item>
);

//---------------------------------TRIBUTES-----------------------------------//

const SubmitCodes = (
    <NavDropdown.Item as={Nav.Link} href="/App/tribute/submit">
        Submit Resource Code*
    </NavDropdown.Item>
);

//---------------------------------HELPERS------------------------------------//

// Also should be accesible to gamemakers
const ViewLocations = (
    <NavDropdown.Item as={Nav.Link} href="/App/helper/locations">
        View Tribute Locations*
    </NavDropdown.Item>
);

//---------------------------------GENERAL------------------------------------//

const Messaging = (
    <NavDropdown.Item as={Nav.Link} href="/App/messaging">
        Messaging*
    </NavDropdown.Item>
);

//---------------------------------EXPORTS------------------------------------//

export const OwnerTools = (
        <>
            {ModifyUsersOwner}
            {Messaging}
            {ManageGameState}
            {ModifyTributeStats}
            {ManageResources}
            {ManageItems}
            {UpdateFunds}
            {ViewLocations}
        </>
)

export const AdminTools = (
        <>
            {ModifyUsers}
            {Messaging}
            {ManageGameState}
            {ModifyTributeStats}
            {ManageResources}
            {ManageItems}
            {UpdateFunds}
            {ViewLocations}
        </>
);

export const GMTools = (
        <>
            {Messaging}
            {ManageGameState}
            {ModifyTributeStats}
            {ManageResources}
            {ManageItems}
            {UpdateFunds}
            {ViewLocations}
        </>
);

export const MentorTools = (
        <>
            {Messaging}
            {RequestPurchase}
        </>
);

export const TributeTools = (
        <>
            {Messaging}
            {SubmitCodes}
        </>
);

export const HelperTools = (
        <>
            {Messaging}
            {ViewLocations}
        </>
);