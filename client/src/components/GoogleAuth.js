import React from 'react';
import { connect } from 'react-redux';
import axios from 'axios';

import { signIn, signOut } from '../actions';


class GoogleAuth extends React.Component {
    componentDidMount() {
        window.gapi.load('client:auth2', async () => {
            await window.gapi.client.init({
                clientId: '909644843745-9sk4i4dtp3tbpkbsfkpvbn7td3d4164k.apps.googleusercontent.com',
                scope: 'email'
            }).then(() => {
                this.auth = window.gapi.auth2.getAuthInstance();
                this.onAuthChange(this.auth.isSignedIn.get());
                this.auth.isSignedIn.listen(this.onAuthChange);
            });
        });
    };

    onAuthChange = (isSignedIn) => {
        if(isSignedIn){
            // Upon sign in, load up user data given their email
            const userEmail = this.auth.currentUser.get().w3.getEmail();
            this.props.signIn(userEmail);
            console.log('ATTEMPTED SIGN IN');
        } else {
            this.props.signOut();
            console.log('ATTEMPTED SIGN OUT');
        }
    }

    onSignInClick = () => {
        this.auth.signIn();
    }

    onSignOutClick = () => {
        this.auth.signOut();
    }

    renderAuthButton() {
        if(this.props.firstSignIn) {
            return null;
        } else if(this.props.isSignedIn) {
            return (
                <button onClick={this.onSignOutClick} className="ui red button">
                    Sign Out
                </button>
            );
        } else {
            return (
                <button onClick={this.onSignInClick} className="ui red google button">
                    <i className="google icon" />
                    Sign in with Google
                </button>
            );
        }
    }

    render() {
        return (
            <div>
                {this.renderAuthButton()}
            </div>
        )
    }
}

const mapStateToProps = state => {
    return { 
        firstSignIn: state.auth.firstSignIn,
        isSignedIn: state.auth.isSignedIn 
    };
}

export default connect(mapStateToProps, { signIn, signOut })(GoogleAuth);