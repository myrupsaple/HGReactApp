import React from 'react';
import { connect } from 'react-redux';

import { setNavBar } from '../../actions';
import { OAuthFail, NotSignedIn, NotAuthorized, Loading } from '../components/AuthMessages';
import Wait from '../../components/Wait';
import {
    fetchServerTime,
    fetchGameState,
    fetchAllTributeStatsLimited
} from '../../actions';

class GameStatus extends React.Component {
    _isMounted = false;
    constructor(props){
        super(props);
        this.state = {
            auth: {
                loading: true,
                payload: null
            },
            gameStart: {
                hours: 0,
                minutes: 0,
                seconds: 0
            },
            
            apiError: false
        };
    }

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

        const response = await this.props.fetchGameState();
        const response2 = await this.props.fetchAllTributeStatsLimited();
        if(!response || !response2){
            this.setState({ apiError: true });
        }
        const startTime = new Date(Date.parse(this.props.gameState.start_time));
        if(this._isMounted){
            this.setState({
                gameStart: {
                    hours: startTime.getHours(),
                    minutes: startTime.getMinutes().toLocaleString(undefined, { minimumIntegerDigits: 2 }),
                    seconds: startTime.getSeconds().toLocaleString(undefined, { minimumIntegerDigits: 2 }),
                }
            });
        }
        console.log(this.state.gameStart);

        // Clock components
        const currentTimeRaw = await this.props.fetchServerTime()
        const currentTimeParsed = new Date(Date.parse(currentTimeRaw));
        if(!currentTimeRaw){
            this.setState({ apiError: true });
        }
        
        var currentTime = currentTimeParsed.getHours() * 3600 + currentTimeParsed.getMinutes() * 60 + currentTimeParsed.getSeconds();
        // Multiply by 1 because othrwise this.state.gameStart.seconds is treated as a string
        // Eg. 12:00:00 becomes 12 * 3600 + 0 * 60 + '00' = 43200 + 0 + '00' = 43200 + '00' = 4320000
        const gameStart = this.state.gameStart.hours * 3600 +
            this.state.gameStart.minutes * 60 + this.state.gameStart.seconds * 1;
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

            if(currentTime >= 24 * 60 * 60){
                gameDidStart = false;
                currentTime = 0;
            }

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
                    gameDidStart: gameDidStart,
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
        const message1 = this.state.gameDidStart ? 'Games Started At: ' : 'Games Will Begin At: ';
        const message2 = this.state.gameDidStart ? 'Game Time: ' : 'Time Until Games Begin: ';
        return (
            <>
                <h2>{message1}</h2><h3 className="coolor-text-grey-darken-2">{this.getStartTime()}</h3>
                <h2>Current Time:</h2><h3 className="coolor-text-grey-darken-2">{this.state.time}</h3>
                <h2>{message2}</h2><h3 className="coolor-text-grey-darken-2">{this.state.gameTime}</h3>
            </>
        );
    }

    renderScoreBoard = () => {
        return(
            <>
                <h1>Scoreboard</h1>

            </>
        );
    }

    renderContent = () => {
        if(this.state.auth.loading){
            return(
                <>
                <h3>Authorizing user...</h3>
                <p>{Loading}</p>
                </>
            );
        } else if(this.state.apiError){
            return <h3>Unable to load data at this time. Please try again later.</h3>
        }
        if(this.state.auth.payload === null){
            return(
                <div className="row">
                    <div className="col-4">
                        {this.renderConditionalText()}
                        <h3>Resources Needed:</h3>
                        <h3>Special Events Active:</h3>
                        <h3>Tributes Remaining:</h3>
                    </div>
                    <div className="col-8">
                        {this.renderScoreBoard()}
                    </div>
                </div>
            );
        } else {
            return (<h3>{this.state.auth.payload}</h3>);
        }
    }

    render = () =>{
        return(
            <>
                <h1>Current Game Status</h1>
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

export default connect(mapStateToProps, 
    { 
        setNavBar,
        fetchServerTime,
        fetchGameState,
        fetchAllTributeStatsLimited
    })(GameStatus);