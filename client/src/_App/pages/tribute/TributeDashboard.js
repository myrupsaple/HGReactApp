import React from 'react';
import { connect } from 'react-redux';

import { setNavBar } from '../../../actions';
import { OAuthFail, NotSignedIn, NotAuthorized, Loading } from '../../components/AuthMessages';
import Wait from '../../../components/Wait';
import { Button } from 'react-bootstrap';
import { 
    fetchTributeStats 
} from '../../../actions';

class SubmitResource extends React.Component {
    _isMounted = false;
    constructor(props){
        super(props);
        this.state = {
            auth: {
                loading: true,
                payload: null
            },
            apiInitialLoadError: false
        };
    }

    checkAuth = async () => {
        // SET ALLOWED ACCESS GROUPS HERE
        const allowedGroups = ['owner', 'tribute'];
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
                auth: {
                    payload: authPayload
                }
            })
        }

        const response = await this.props.fetchTributeStats(this.props.userEmail);
        console.log(response);
        if(!response || !response.data ){
            this.setState({ apiInitialLoadError: true });
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
        } else if(this.state.apiInitialLoadError){
            return <h3>Unable to load data at this time. Please try again later.</h3>
        } else if(this.state.auth.payload === null){
            return(
                // RETURN JSX UPON SUCCESSFUL LOGIN SHOULD BE PASTED HERE 
                <>
                    <h1>Your Stats:</h1>
                    <h5>Kills: {this.props.stats.kill_count}</h5>
                    <h5>Lives</h5>
                    <h5>Lives Lost</h5>
                    <h5>Resources Collected and Used</h5>
                    <h5>Items Purchased</h5>
                    <h5>Funds Remaining</h5>
                </>
            );
        } else {
            console.log(this.state);
            return (<h3>{this.state.auth.payload}</h3>);
        }
    }

    render = () =>{
        console.log(this.state);
        return(
            <>
                {this.renderContent()}
                <Button onClick={() => this.props.fetchTributeStats(this.props.userEmail)}>Refresh Data</Button>
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
        userPerms: state.auth.userPerms,
        userEmail: state.auth.userEmail,
        stats: state.tributeStats
    }
}

export default connect(mapStateToProps, 
    {
    setNavBar,
    fetchTributeStats
    })(SubmitResource);