import React from 'react';
import { Router, Route, Switch } from 'react-router-dom';
import history from '../history';

import NavBar from './NavBar'
import Home from '../pages/Home';


class App extends React.Component {
    render(){
        return(
            <div className="ui container">
                <Router history={history}>
                    <div>
                        <NavBar />
                        <Switch>
                            <Route path="/" exact component={Home} />
                        </Switch>
                    </div>
                </Router>
            </div>
        );
    }
}

export default App;