import React from 'react';
import { connect } from 'react-redux';

// TODO: Update directories as necessary
import { setNavBar } from '../../actions';
import { OAuthFail, NotSignedIn, NotAuthorized, Loading } from '../components/AuthMessages';
import Wait from '../../components/Wait';

class MapRules extends React.Component {
    _isMounted = false;
    state = {
        auth: {
            loading: true,
            payload: null
        }
    };

    checkAuth = async () => {
        // SET ALLOWED ACCESS GROUPS HERE
        const allowedGroups = ['owner', 'admin', 'gamemaker', 'tribute', 'mentor', 'helper'];
        var timeoutCounter = 0;
        while(!this.props.authLoaded){
            await Wait(1000);
            timeoutCounter ++;
            console.log('waiting on authLoaded')
            if (timeoutCounter > 5){
                return(OAuthFail);
            }
        }

        timeoutCounter = 0;
        while(!this.props.isSignedIn){
            await Wait(1000);
            timeoutCounter ++;
            console.log('waiting on isSignedIn');
            if (timeoutCounter > 5){
                return(NotSignedIn);
            }
        }

        if(this._isMounted){
            this.setState({
                auth:{
                    loading: false
                }
            })
        }

        const userPerms = this.props.userPerms;
        for (let group of allowedGroups){
            if(userPerms === group){
                return null;
            }
        }

        return(NotAuthorized);
    }

    componentDidMount = async () => {
        this._isMounted = true;
        this.props.setNavBar('app');
        // Check authorization
        const authPayload = await this.checkAuth();
        if(this._isMounted){
            this.setState({
                auth:{
                    payload: authPayload
                }
            })
        }
    }

    renderContent = () => {
        if(this.state.auth.loading){
            return(
                <>
                <h3>Authorizing user...</h3>
                <p>{Loading}</p>
                </>
            );
        }
        if(this.state.auth.payload === null){
            return(
                // RETURN JSX UPON SUCCESSFUL LOGIN SHOULD BE PASTED HERE 
                <>
                    Hello
                </>
            );
        } else {
            return (<h3>{this.state.auth.payload}</h3>);
        }
    }

    render = () =>{
        return(
            <>
                {this.renderContent()}
            </>
        )
    }

    componentWillUnmount() {
        this._isMounted = false;
    }
};

const mapStateToProps = state => {
    return{
        authLoaded: state.auth.loaded,
        isSignedIn: state.auth.isSignedIn,
        userPerms: state.auth.userPerms
    }
}

export default connect(mapStateToProps, 
    {
    setNavBar,
    })(MapRules);