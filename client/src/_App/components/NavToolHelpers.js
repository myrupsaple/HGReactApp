import React from 'react';
import { NavDropdown, Nav } from 'react-bootstrap';

//------------------------------OWNER, ADMIN, GM--------------------------------//

const ModifyUsersOwner = (
    <NavDropdown.Item as={Nav.Link} href="/App/owner/modify-users">
        Modify Users (Owner)
    </NavDropdown.Item>
);

const ModifyUsers = (
    <NavDropdown.Item as={Nav.Link} href="/App/admin/modify-users">
        Modify Users
    </NavDropdown.Item>
);

const ManageGameState = (
    <NavDropdown.Item as={Nav.Link} href="/App/gamemaker/manage-game">
        Manage Game State
    </NavDropdown.Item>
);

const TributeAccountInfo = (
    <NavDropdown.Item as={Nav.Link} href="/App/gamemaker/tribute-info">
        Tribute Info
    </NavDropdown.Item>
);

const DonationTracking = (
    <NavDropdown.Item as={Nav.Link} href="/App/gamemaker/donation-tracking">
        Donation Tracking
    </NavDropdown.Item>
);

const ApprovePurchases = (
    <NavDropdown.Item as={Nav.Link} href="/App/gamemaker/purchase-requests">
        Purchase Requests
    </NavDropdown.Item>
);

const LifeTracking = (
    <NavDropdown.Item as={Nav.Link} href="/App/gamemaker/life-tracking">
        Life Tracking
    </NavDropdown.Item>
);

const ResourceList = (
    <NavDropdown.Item as={Nav.Link} href="/App/gamemaker/resource-list">
        Resource Codes
    </NavDropdown.Item>
);

const ResourceEvents = (
    <NavDropdown.Item as={Nav.Link} href="/App/gamemaker/resource-events">
        Resource Events
    </NavDropdown.Item>
);

const ManageItems = (
    <NavDropdown.Item as={Nav.Link} href="/App/gamemaker/manage-items">
        Update Item Inventory
    </NavDropdown.Item>
);

//---------------------------------MENTORS------------------------------------//

// Samge page as purchase management for gamemakers
const RequestPurchase = (
    <NavDropdown.Item as={Nav.Link} href="/App/mentor/purchase-requests">
        Request Purchase
    </NavDropdown.Item>
);

const MentorDashboard = (
    <NavDropdown.Item as={Nav.Link} href="/App/mentor/dashboard">
        Mentor Dashboard
    </NavDropdown.Item>
);

//---------------------------------TRIBUTES-----------------------------------//

const TributeDashboard = (
    <NavDropdown.Item as={Nav.Link} href="/App/tribute/dashboard">
        Tribute Dashboard
    </NavDropdown.Item>
);

//---------------------------------HELPERS------------------------------------//

// // Also should be accesible to gamemakers
// const ViewLocations = (
//     <NavDropdown.Item as={Nav.Link} href="/App/helper/locations">
//         View Tribute Locations*
//     </NavDropdown.Item>
// );

//---------------------------------GENERAL------------------------------------//

// const Messaging = (
//     <NavDropdown.Item as={Nav.Link} href="/App/messaging">
//         Messaging*
//     </NavDropdown.Item>
// );

//---------------------------------EXPORTS------------------------------------//

export const OwnerTools = (
        <>
            {ModifyUsersOwner}
            {/* {Messaging} */}
            {ManageGameState}
            {TributeAccountInfo}
            {DonationTracking}
            {ApprovePurchases}
            {LifeTracking}
            {ResourceList}
            {ResourceEvents}
            {ManageItems}
            {/* {ViewLocations} */}
            {TributeDashboard}
            {MentorDashboard}
        </>
)

export const AdminTools = (
        <>
            {ModifyUsers}
            {/* {Messaging} */}
            {ManageGameState}
            {TributeAccountInfo}
            {DonationTracking}
            {ApprovePurchases}
            {LifeTracking}
            {ResourceList}
            {ResourceEvents}
            {ManageItems}
            {/* {ViewLocations} */}
        </>
);

export const GMTools = (
        <>
            {/* {Messaging} */}
            {ManageGameState}
            {TributeAccountInfo}
            {DonationTracking}
            {ApprovePurchases}
            {LifeTracking}
            {ResourceList}
            {ResourceEvents}
            {ManageItems}
            {/* {ViewLocations} */}
        </>
);

export const MentorTools = (
        <>
            {/* {Messaging} */}
            {RequestPurchase}
            {MentorDashboard}
        </>
);

export const TributeTools = (
        <>
            {/* {Messaging} */}
            {TributeDashboard}
        </>
);

export const HelperTools = (
        <>
            {/* {Messaging} */}
            {/* {ViewLocations} */}
        </>
);