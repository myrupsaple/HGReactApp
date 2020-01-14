import React from 'react';
import { connect } from 'react-redux';
import { Button } from 'react-bootstrap';

import { signIn, signOut } from '../actions';

import GoogleIcon from '../_App/_graphics/GoogleIcon.png';


class GoogleAuth extends React.Component {
    async componentDidMount() {
        // window.gapi is sometimes not initialized before calling .load, causing
        // an 'property of undefined' error
        // The workaround ended up being a lot larger than expected.
        // https://codingwithspike.wordpress.com/2018/03/10/making-settimeout-an-async-await-function/
        var counter = 1;
        function wait() {
            return new Promise(resolve => {
              setTimeout(resolve, 200);
            });
        }
        async function checkForGapi () {
            while(!window.gapi){
                console.log('GAPI LOAD FAILED: waited 200ms ' + counter + ' time(s)');
                counter += 0;
                await wait();
            }
        }
        await checkForGapi();
        // End of workaround... now for some actual useful code
        

        window.gapi.load('client:auth2', async () => {
            await window.gapi.client.init({
                clientId: '909644843745-9sk4i4dtp3tbpkbsfkpvbn7td3d4164k.apps.googleusercontent.com',
                scope: 'email'
            }).then(async () => {
                this.auth = await window.gapi.auth2.getAuthInstance();
                this.onAuthChange(this.auth.isSignedIn.get());
                this.auth.isSignedIn.listen(this.onAuthChange);
            });
        });
    };

    onAuthChange = (isSignedIn) => {
        if(isSignedIn){
            // Upon sign in, load up user data given their email
            const userEmail = this.auth.currentUser.get().w3.getEmail();
            console.log('GoogleAuth: Sign in attempt');
            this.props.signIn(userEmail);
        } else {
            console.log('GoogleAuth: Sign out attempt');
            this.props.signOut();
        }
    }

    onSignInClick = () => {
        this.auth.signIn();
    }

    onSignOutClick = () => {
        this.auth.signOut();
    }

    renderAuthButton() {
        if(!this.props.loaded) {
            return (
                <>
                Loading...
                </>
            );
        } else if(this.props.isSignedIn) {
            return (
                // <button onClick={this.onSignOutClick} className="ui red button">
                //     Sign Out
                // </button>
                <Button className="coolor-bg-light-blue-darken-1" onClick={this.onSignOutClick}>
                    Sign Out
                </Button>
            );
        } else {
            return (
                <Button className="coolor-bg-light-blue-darken-1" onClick={this.onSignInClick}>
                    <img src={GoogleIcon} alt="GoogleIcon" height="21" width="21"/>
                    Participant Sign In
                </Button>
            );
        }
    }

    render() {
        return (
            <>
                {this.renderAuthButton()}
            </>
        )
    }
}

const mapStateToProps = state => {
    return { 
        loaded: state.auth.loaded,
        isSignedIn: state.auth.isSignedIn 
    };
}

export default connect(mapStateToProps, { signIn, signOut })(GoogleAuth);