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
        Manage Game State-
    </NavDropdown.Item>
);

const TributeAccountInfo = (
    <NavDropdown.Item as={Nav.Link} href="/App/gamemaker/tribute-info">
        Tribute Info+
    </NavDropdown.Item>
);

const FundsTracking = (
    <NavDropdown.Item as={Nav.Link} href="/App/gamemaker/funds-tracking">
        Funds Tracking+
    </NavDropdown.Item>
);

const LifeTracking = (
    <NavDropdown.Item as={Nav.Link} href="/App/gamemaker/life-tracking">
        Life Tracking^
    </NavDropdown.Item>
);

const ResourceTracking = (
    <NavDropdown.Item as={Nav.Link} href="/App/gamemaker/resource-tracking">
        Resource Tracking*
    </NavDropdown.Item>
);

const ManageItems = (
    <NavDropdown.Item as={Nav.Link} href="/App/gamemaker/manage-items">
        Update Item Inventory*
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
            {TributeAccountInfo}
            {FundsTracking}
            {LifeTracking}
            {ResourceTracking}
            {ManageItems}
            {ViewLocations}
        </>
)

export const AdminTools = (
        <>
            {ModifyUsers}
            {Messaging}
            {ManageGameState}
            {TributeAccountInfo}
            {FundsTracking}
            {LifeTracking}
            {ResourceTracking}
            {ManageItems}
            {ViewLocations}
        </>
);

export const GMTools = (
        <>
            {Messaging}
            {ManageGameState}
            {TributeAccountInfo}
            {FundsTracking}
            {LifeTracking}
            {ResourceTracking}
            {ManageItems}
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