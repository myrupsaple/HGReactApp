import React from 'react';
import { connect } from 'react-redux';
import gif from '../_graphics/gifs/Login.gif';

import GoogleAuth from '../components/GoogleAuth';

class LogIn extends React.Component {
    greetUser() {
        if(this.props.userFirstName) {
            return (
                <div className="ui medium header">
                    Welcome, {this.props.userFirstName}!
                    You have {this.props.userPerms} permissions.
                </div>
            );
        } else if(this.props.userEmail) {
            return (
                <div className="ui medium header">
                    Hello {this.props.userEmail}.
                    I'm sorry, but you don't appear to have an active account.
                    Please contact the Head Gamemaker if you need an account.</div>
            );
        } else {
            return(
                <div className="description">Hello! Please sign in to continue.</div>
            )
        }
    }

    render(){
        return (
            <div className="container">
                <div className="header">Log In</div>
                <div className="description">for Gamemakers, Mentors, Tributes, and Helpers</div>

                <img src={gif} alt="NO." />

                <GoogleAuth />

                <div>{this.greetUser()}</div>
            </div>
        );
    }
};

const mapStateToProps = state => {
    return {
        userFirstName: state.auth.userFirstName,
        userEmail: state.auth.userEmail,
        userPerms: state.auth.userPerms
    }
}

export default connect(mapStateToProps, { })(LogIn);