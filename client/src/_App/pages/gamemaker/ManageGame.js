import React from 'react';
import { connect } from 'react-redux';

import { setNavBar, getGameState } from '../../../actions';
import { OAuthFail, NotSignedIn, NotAuthorized, Loading } from '../../components/AuthMessages';
import Wait from '../../../components/Wait';
import AdjustStart from './game_components/AdjustStart';

class ManageGame extends React.Component {
    _isMounted = false;
    state = {
        auth: {
            loading: true,
            payload: null
        },
        gameStateLoaded: false,
        startTimeAsDate: ''
    };

    checkAuth = async () => {
        // SET ALLOWED ACCESS GROUPS HERE
        const allowedGroups = ['owner', 'admin', 'gamemaker'];
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
            await Wait(500);
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

        await this.props.getGameState();
        this.convertTimeToDate();
    }

    convertTimeToDate = () => {
        const startTime = new Date(Date.parse(this.props.gameState.start_time));
        if(this._isMounted){
            this.setState({
                startTimeAsDate: startTime,
                gameStateLoaded: true
            })
        }
    }

    renderStartTimeString = () => {
        if(this.state.gameStateLoaded){
            const hours = this.state.startTimeAsDate.getHours();
            const minutes = this.state.startTimeAsDate.getMinutes().toLocaleString(undefined, { minimumIntegerDigits: 2 });
            const seconds = this.state.startTimeAsDate.getSeconds().toLocaleString(undefined, { minimumIntegerDigits: 2 });
            return (
                <>
                    {hours}:{minutes}:{seconds}
                </>
            );
        }
        return(
            <>
                Loading...
            </>
        );
    }

    onSubmitCallback = async () => {
        await this.props.getGameState();
        this.convertTimeToDate();
    }

    renderContent = () => {
        if(this.state.auth.loading || !this.state.gameStateLoaded){
            return(
                <>
                <h3>Authorizing user...</h3>
                <p>{Loading}</p>
                </>
            );
        }
        if(this.state.auth.payload === null){
            return( 
                <>
                    <h3>
                        Current Game Start Time: {this.renderStartTimeString()} 
                        <AdjustStart startTime={this.state.startTimeAsDate} onSubmitCallback={this.onSubmitCallback}/>
                    </h3>
                    <h3>Create New Event</h3>
                    <h3>Create New Resource Requirement</h3>
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
        userPerms: state.auth.userPerms,
        gameState: state.gameState
    }
}

export default connect(mapStateToProps, { setNavBar, getGameState })(ManageGame);