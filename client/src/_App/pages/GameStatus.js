import React from 'react';
import { connect } from 'react-redux';

import AppNavBar from '../components/AppNavBar';
import { OAuthFail, NotSignedIn, NotAuthorized, Loading } from '../components/AuthMessages';
import Wait from '../../components/Wait';

class GameStatus extends React.Component {
    _isMounted = true;
    state = {
        gameStart: {
            // TODO: Store these values in state
            // LATER: Allow GM modification via 'Manage Game State'
            hours: 12,
            minutes: 0,
            seconds: 0
        },
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
            await Wait(500);
            timeoutCounter ++;
            if (timeoutCounter > 5){
                return(OAuthFail);
            }
        }

        timeoutCounter = 0;
        while(!this.props.isSignedIn){
            await Wait(500);
            timeoutCounter ++;
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
        // Check authorization
        const authPayload = await this.checkAuth();
        if(this._isMounted){
            this.setState({
                auth:{
                    payload: authPayload
                }
            })
        }
        console.log(this.state.auth.payload);

        // Clock components
        const today = new Date();
        var currentTime = today.getHours() * 3600 + today.getMinutes() * 60 + today.getSeconds();
        const gameStart = this.state.gameStart.hours * 3600 +
            this.state.gameStart.minutes * 60 + this.state.gameStart.seconds;
        setInterval(() => {
            currentTime = currentTime + 1;
            const hours = Math.floor(currentTime/3600);
            const minutes = Math.floor((currentTime - 3600*hours)/60);
            const seconds = currentTime - 3600*hours - 60*minutes;
            const currentTimeString = (
            hours.toLocaleString(undefined, {minimumIntegerDigits: 2}) +
            ':' + minutes.toLocaleString(undefined, {minimumIntegerDigits: 2}) + 
            ':' + seconds.toLocaleString(undefined, {minimumIntegerDigits: 2})
            );
            
            var gameTime = currentTime - gameStart;
            var gameHours;
            var gameMinutes;
            var gameSeconds;
            var gameDidStart;
            if(gameTime >= 0) {
                gameDidStart = true;
                gameHours = Math.floor(gameTime/3600);
                gameMinutes = Math.floor((gameTime - 3600*gameHours)/60);
                gameSeconds = gameTime - 3600*gameHours - 60*gameMinutes;
            }
            else {
                gameDidStart = false;
                gameHours = Math.abs(Math.ceil(gameTime/3600));
                gameMinutes = Math.abs(Math.ceil((gameTime + 3600*gameHours)/60));
                gameSeconds = Math.abs(gameTime + 3600*gameHours + 60*gameMinutes);
            }
            const gameTimeString = (
                gameHours.toLocaleString(undefined, {minimumIntegerDigits: 2}) +
                ':' + gameMinutes.toLocaleString(undefined, {minimumIntegerDigits: 2}) +
                ':' + gameSeconds.toLocaleString(undefined, {minimumIntegerDigits: 2})
            );
            if(this._isMounted){
                this.setState({
                    gameDidStart,
                    time: currentTimeString,
                    gameTime: gameTimeString
                })
            }
        }, 1000);
    }

    getStartTime = () => {
        return(this.state.gameStart.hours.toLocaleString(undefined,{minimumIntegerDigits: 2}) +
            ':' + this.state.gameStart.minutes.toLocaleString(undefined,{minimumIntegerDigits: 2}) +
            ':' + this.state.gameStart.seconds.toLocaleString(undefined,{minimumIntegerDigits: 2}));
    }

    renderConditionalText = () => {
        if(this.state.gameDidStart){
            return(
                <>
                    <h1>Games Started At: {this.getStartTime()} </h1>
                    <h1>Game Time: {this.state.gameTime}</h1>
                </>
            );
        } else {
            return(
                <>
                    <h1>Games Will Begin At: {this.getStartTime()} </h1>
                    <h1>Time Until Games Begin: {this.state.gameTime}</h1>
                </>
            )
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
                <>
                {this.renderConditionalText()}
                <h1>Current Time: {this.state.time}</h1>
                <h1>Resources You Need:</h1>
                <h1>Special Events:</h1>
                <h1>Tributes Remaining:</h1>
                <h1>Your Stats:</h1>
                <h5>Kills</h5>
                <h5>Lives</h5>
                <h5>Lives Lost</h5>
                <h5>Resources Collected and Used</h5>
                <h5>Items Purchased</h5>
                <h5>Funds Remaining</h5>
                </>
            );
        } else {
            return (<h3>{this.state.auth.payload}</h3>);
        }
    }

    render = () =>{
        return(
            <>
                <AppNavBar />
                <div className="ui-container">
                    {this.renderContent()}
                </div>
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

export default connect(mapStateToProps)(GameStatus);