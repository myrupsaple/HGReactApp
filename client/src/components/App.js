import React from 'react';
import { Router, Route, Switch } from 'react-router-dom';
import history from '../history';

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

import Unauthorized from '../_App/components/Unauthorized';
import SignOutSuccessful from './SignOutSuccessful';

// App imports
import DevUpdates from '../_App/pages/DevUpdates';
// General Tabs
import AppHome from '../_App/pages/_AppHome';
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
import TributeInfo from '../_App/pages/gamemaker/TributeInfo';
import FundsTracking from '../_App/pages/gamemaker/FundsTracking';
import LifeTracking from '../_App/pages/gamemaker/LifeTracking';
import ResourceTracking from '../_App/pages/gamemaker/ResourceTracking';
import ManageItems from '../_App/pages/gamemaker/ManageItems';
// Owner and Admin Tools
import ModifyUsers from '../_App/pages/owner_admin/ModifyUsers';

import NotFound from '../components/NotFound';

class App extends React.Component {
    render(){
        return(
            <>
            <Router history={history}>
                <Switch>

                    {/* STATIC WEBSITE LINKS */}
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
                    
                    <Route path="/App/unauthorized" exact component={Unauthorized} />
                    <Route path="/App/signout-successful" exact component={SignOutSuccessful} />


                    {/* INTERACTIVE APP LINKS */}
                    {/* General Tabs */}
                    <Route path="/App/dev-updates" exact component={DevUpdates} />

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
                    <Route path="/App/gamemaker/tribute-info" exact component={TributeInfo} />
                    <Route path="/App/gamemaker/funds-tracking" exact component={FundsTracking} />
                    <Route path="/App/gamemaker/life-tracking" exact component={LifeTracking} />
                    <Route path="/App/gamemaker/resource-tracking" exact component={ResourceTracking} />
                    <Route path="/App/gamemaker/manage-items" exact component={ManageItems} />
                    {/* Owner and Admin Tools */}
                    <Route path="/App/owner/modify-users" exact component={ModifyUsers} />
                    <Route path="/App/admin/modify-users" exact component={ModifyUsers} />

                    <Route path="/" component={NotFound} />

                </Switch>
            </Router>
            </>
        );
    }
}

export default App;