import React from 'react';
import { Router, Route, Switch } from 'react-router-dom';
import history from '../history';

import NavBar from './NavBar'
import Home from '../pages/_Home';
import AboutHG from '../pages/about/AboutHG';
import AboutIV from '../pages/about/AboutIV';
import Rules from '../pages/about/Rules';
import Districts from '../pages/districts/Districts';
import DistrictRouter from '../pages/districts/DistrictRouter';
import Watch from '../pages/Watch';
import Donate from '../pages/Donate';
import Updates from '../pages/Updates';
import LogIn from '../pages/LogIn';


class App extends React.Component {
    render(){
        return(
            <div className="ui container">
                <Router history={history}>
                    <div>
                        <NavBar />
                        <Switch>
                            <Route path="/" exact component={Home} />
                            <Route path="/about/hg" exact component={AboutHG} />
                            <Route path="/about/iv" exact component={AboutIV} />
                            <Route path="/about/rules" exact component={Rules} />
                            <Route path="/districts/" exact component={Districts} />
                            <Route path="/districts/:id" exact component={DistrictRouter} />
                            <Route path="/watch" exact component={Watch} />
                            <Route path="/donate" exact component={Donate} />
                            <Route path="/updates" exact component={Updates} />
                            <Route path="/login" exact component={LogIn} />
                        </Switch>
                    </div>
                </Router>
            </div>
        );
    }
}

export default App;