import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import NavBar from '../components/NavBar';
import GoogleAuth from '../../components/GoogleAuth';

import gif from '../_graphics/gifs/Login.gif';

class LogIn extends React.Component {
    greetUser() {
        if(this.props.userFirstName) {
            return (
                <div>
                    <div className="ui medium header">
                        Welcome, {this.props.userFirstName}!
                        You have {this.props.userPerms} permissions.
                    </div>
                    <div>
                        <Link to="/App/">
                            Continue to App
                        </Link>
                    </div>
                </div>
            );
        } else if(this.props.userEmail) {
            return (
                <div className="ui medium header">
                    Hello {this.props.userEmail}.
                    I'm sorry, but you don't appear to have an active account.
                    Please contact the Head Gamemaker if you need an account.
                </div>
            );
        } else if(this.props.firstSignIn){
            return(
                <div className="ui medium header">Loading...</div>
            );
        } else if(this.props.isSignedIn) {
            return(
                <div className="ui medium header">
                    We apologize, but there was an issue retreiving your data. 
                    Please contact a Gamemaker or try again later.
                </div>
            );
        } else {
            return(
                <div className="ui medium header">Hello! Please sign in to continue.</div>
            );
        }
    }

    render(){
        return (
            <>
                <NavBar />
                <div className="ui-container">
                    
                    <div className="header">Log In</div>
                    <div className="description">for Gamemakers, Mentors, Tributes, and Helpers</div>

                    <img src={gif} alt="NO." />

                    <GoogleAuth />

                    <div>{this.greetUser()}</div>
                </div>
            </>
        );
    }
};

const mapStateToProps = state => {
    return {
        userFirstName: state.auth.userFirstName,
        userEmail: state.auth.userEmail,
        userPerms: state.auth.userPerms,
        firstSignIn: state.auth.firstSignIn,
        isSignedIn: state.auth.isSignedIn
    }
}

export default connect(mapStateToProps, { })(LogIn);