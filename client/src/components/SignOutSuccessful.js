import React from 'react';
import history from '../history';

class SignOutSuccessful extends React.Component {
    componentDidMount(){
        setTimeout(() => {
            history.push('/')
        }, 1250)
    }
    render(){
        return(
            <div className="ui-container">
                <h3>Sign out successful. Returning to the website home page...</h3>
            </div>
        );
    }
}

export default SignOutSuccessful;