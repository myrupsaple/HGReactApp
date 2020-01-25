import React from 'react';
import { connect } from 'react-redux';
import { Button } from 'react-bootstrap';
import history from '../history';

import { signIn, signOut } from '../actions';

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
                console.log('GAPI LOAD DELAYED: waited 200ms ' + counter + ' time(s)');
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
            // TODO: Figure out how to get the email reliably:
            // console.log(this.auth.currentUser.get());
            const userEmail = this.auth.currentUser.get().getBasicProfile().getEmail();
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
        history.push('/App/signout-successful');
    }

    renderAuthButton() {
        if(!this.props.loaded) {
            return (
                <>
                Checking sign in status...
                </>
            );
        } else if(this.props.isSignedIn) {
            return (
                <>
                    <h6 onClick={this.onSignOutClick} style={this.props.color}>
                        Sign Out and Return Home
                    </h6>
                </>
            );
        } else {
            return (
                <Button className="coolor-bg-light-blue-darken-1" onClick={this.onSignInClick}>
                    <img src="https://i.imgur.com/vb6mwwc.png" alt="GoogleIcon" height="21" width="21"/>
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