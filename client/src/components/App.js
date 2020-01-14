import React from 'react';
import { Router, Route, Switch } from 'react-router-dom';
import history from '../history';

import NavBar from '../_Website/components/NavBar';
import AppNavBar from '../_App/components/AppNavBar';

// Website Imports
import Home from '../_Website/pages/_Home';
import AboutHG from '../_Website/pages/about/AboutHG';
import AboutIV from '../_Website/pages/about/AboutIV';
import Rules from '../_Website/pages/about/Rules';
    import RulesMap from '../_Website/pages/about/subpages/RulesMap';
    import RulesMapNotes from '../_Website/pages/about/subpages/RulesMapNotes';
    import RulesList from '../_Website/pages/about/subpages/RulesList';
    import AdditionalInfo from '../_Website/pages/about/subpages/AdditionalInfo';
import Districts from '../_Website/pages/districts/Districts';
import DistrictRouter from '../_Website/pages/districts/DistrictRouter';
import Watch from '../_Website/pages/Watch';
import Donate from '../_Website/pages/Donate';
import Updates from '../_Website/pages/Updates';

// App imports
// General Tabs
import AppHome from '../_App/pages/AppHome';
import GameStatus from '../_App/pages/GameStatus';
import MapRules from '../_App/pages/MapRules';
import Messaging from '../_App/pages/Messaging';
// Tribute Tools
import SubmitResource from '../_App/pages/tribute/SubmitResource';
// Helper Tools
import ViewLocations from '../_App/pages/helper/ViewLocations';
// Mentor Tools
import RequestItems from '../_App/pages/mentor/RequestItems';
// Gamemaker Tools
import ManageGame from '../_App/pages/gamemaker/ManageGame';
import ManageTributeStats from '../_App/pages/gamemaker/ManageTributesStats';
import ManageResources from '../_App/pages/gamemaker/ManageResources';
import ManageItems from '../_App/pages/gamemaker/ManageItems';
import ManageFunds from '../_App/pages/gamemaker/ManageFunds';
// Owner and Admin Tools
import ModifyUsersOwner from '../_App/pages/owner_admin/ModifyUsersOwner';
import ModifyUsersAdmin from '../_App/pages/owner_admin/ModifyUsersAdmin';
    import EditUser from '../_App/pages/owner_admin/components/EditUser';

class App extends React.Component {
    renderNav(){
        return(
            <>
                <NavBar />
                <AppNavBar />
            </>
        );
    }

    render(){
        return(
            <>
            {/* {this.renderNav()} */}
            <div className="ui container">
                <Router history={history}>
                    <Switch>
                        {/* WEBSITE LINKS */}
                        <Route path="/" exact component={Home} />
                        <Route path="/about/hg" exact component={AboutHG} />
                        <Route path="/about/iv" exact component={AboutIV} />
                        <Route path="/about/rules" exact component={Rules} />
                            <Route path="/links/arena-map.jpg" exact component={RulesMap} />
                            <Route path="/links/map-notes.pdf" exact component={RulesMapNotes} />
                            <Route path="/links/rules-list.extern" exact component={RulesList} />
                            <Route path="/links/additional-info.extern" exact component={AdditionalInfo} />
                        <Route path="/districts/" exact component={Districts} />
                        <Route path="/districts/:id" exact component={DistrictRouter} />
                        <Route path="/watch" exact component={Watch} />
                        <Route path="/donate" exact component={Donate} />
                        <Route path="/updates" exact component={Updates} />
                        
                        {/* INTERACTIVE APP LINKS */}
                        {/* General Tabs */}
                        <Route path="/App/" exact component={AppHome} />
                        <Route path="/App/game-status" exact component={GameStatus} />
                        <Route path="/App/map-rules" exact component={MapRules} />
                        <Route path="/App/messaging" exact component={Messaging} />
                        {/* Tribute Tools */}
                        <Route path="/App/tribute/submit" exact component={SubmitResource} />
                        {/* Helper Tools */}
                        <Route path="/App/helper/locations" exact component={ViewLocations} />
                        {/* Mentor Tools */}
                        <Route path="/App/mentor/request" exact component={RequestItems} />
                        {/* Gamemaker Tools */}
                        <Route path="/App/gamemaker/manage-game" exact component={ManageGame} />
                        <Route path="/App/gamemaker/manage-tribute-stats" exact component={ManageTributeStats} />
                        <Route path="/App/gamemaker/manage-resources" exact component={ManageResources} />
                        <Route path="/App/gamemaker/manage-items" exact component={ManageItems} />
                        <Route path="/App/gamemaker/manage-funds" exact component={ManageFunds} />
                        {/* Owner and Admin Tools */}
                        <Route path="/App/owner/modify-users" exact component={ModifyUsersOwner} />
                        <Route path="/App/admin/modify-users" exact component={ModifyUsersAdmin} />
                            <Route path="/App/admin/modify-users/edit/:email" exact component={EditUser} />

                    </Switch>
                </Router>
            </div>
            </>
        );
    }
}

export default App;