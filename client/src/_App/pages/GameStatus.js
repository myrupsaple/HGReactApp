import React from 'react';
import { connect } from 'react-redux';

import { setNavBar } from '../../actions';
import { OAuthFail, NotSignedIn, NotAuthorized, Loading } from '../components/AuthMessages';
import Wait from '../../components/Wait';
import {
    fetchServerTime,
    fetchGameState,
    fetchAllTributeStatsLimited,
    fetchGlobalEventsByStatus
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
            serverTime: null,
            
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
        const response3 = await this.props.fetchGlobalEventsByStatus();
        if(!response || !response2 || !response3){
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

        // Clock components
        const currentTimeRaw = await this.props.fetchServerTime();
        const currentTimeParsed = new Date(Date.parse(currentTimeRaw));
        if(!currentTimeRaw){
            this.setState({ apiError: true });
        }
        
        var currentTime = currentTimeParsed.getHours() * 3600 + currentTimeParsed.getMinutes() * 60 + currentTimeParsed.getSeconds();
        if(this._isMounted){
            this.setState({ serverTime: Math.floor(currentTime / 60) });
        }

        // Check for and update event status every 15 seconds
        setInterval(async () => {
            const currentTime = this.state.serverTime + 0.1;
            if(this._isMounted){
                this.setState({ serverTime: currentTime });
            }
        }, 6000)

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

    renderResourcesNeeded = () => {
        return(
            <ul className="list-group">
                {this.props.globalEvents.map(event => {
                    if(event.status !== 'active' || !['food_required', 'water_required', 'medicine_required'].includes(event.type)){
                        return null;
                    }

                    var bgCoolor = 'coolor-bg-white';
                    if(event.event_end_time - this.state.serverTime <= 5) bgCoolor = 'coolor-bg-red-lighten-4';
                    else if(event.event_end_time - this.state.serverTime <= 15) bgCoolor = 'coolor-bg-yellow-lighten-4';

                    var displayText = '';
                    const hours = Math.floor(event.event_end_time / 60).toLocaleString(undefined, { minimumIntegerDigits: 2 });
                    const minutes = (event.event_end_time % 60).toLocaleString(undefined, { minimumIntegerDigits: 2 });
                    const eventEndTime = `${hours}:${minutes}`
                    if(event.type === 'food_required'){
                        displayText = `Food required by ${eventEndTime}`;
                    } else if(event.type === 'water_required'){
                        displayText = `Water required by ${eventEndTime}`;
                    } else if(event.type === 'medicine_required'){
                        displayText = `Medicine required by ${eventEndTime}`;
                    }
                    return(
                        <li className={`list-group-item ${bgCoolor}`} key={event.id}>
                            <div className="row">
                                <div className="col">{displayText}</div>
                            </div>
                        </li>
                    );
                })}
            </ul>
        );
    }
    renderSpecialEvents = () => {
        return(
            <ul className="list-group">
                {this.props.globalEvents.map(event => {
                    if(event.status !== 'active' || ['food_required', 'water_required', 'medicine_required'].includes(event.type)){
                        return null;
                    }

                    var bgCoolor = 'coolor-bg-white';
                    if(event.event_end_time - this.state.serverTime <= 5) bgCoolor = 'coolor-bg-red-lighten-4';
                    else if(event.event_end_time - this.state.serverTime <= 15) bgCoolor = 'coolor-bg-yellow-lighten-4';

                    const hours1 = Math.floor(event.notification_time / 60).toLocaleString(undefined, { minimumIntegerDigits: 2 });
                    const minutes1 = (event.notification_time % 60).toLocaleString(undefined, { minimumIntegerDigits: 2 });
                    const eventNotificationTime = `${hours1}:${minutes1}`
                    const hours2 = Math.floor(event.event_end_time / 60).toLocaleString(undefined, { minimumIntegerDigits: 2 });
                    const minutes2 = (event.event_end_time % 60).toLocaleString(undefined, { minimumIntegerDigits: 2 });
                    const eventEndTime = `${hours2}:${minutes2}`;

                    const displayText = `${event.message} starting at ${eventNotificationTime} and ending at ${eventEndTime}`;
                    return(
                        <li className={`list-group-item ${bgCoolor}`} key={event.id}>
                            <div className="row">
                                <div className="col">{displayText}</div>
                            </div>
                        </li>
                    );
                })}
            </ul>
        );
    }

    renderScoreBoard = () => {
        return(
            <>
            <h2>Scoreboard</h2>
            <ul className="list-group">
                <h4 className="row">
                    <div className="col">Tribute</div>
                    <div className="col">Funds Remaining</div>
                    <div className="col">Lives Remaining</div>
                    <div className="col">Total Lives Lost</div>
                    <div className="col">Kill Count</div>
                </h4>
                {this.props.stats.map(tribute => {
                    var bgCoolor = 'coolor-bg-green-lighten-4';
                    if(tribute.lives_remaining === 1) bgCoolor = 'coolor-bg-yellow-lighten-4';
                    else if(tribute.lives_remaining === 0) bgCoolor = 'coolor-bg-red-lighten-4';
                    return(
                        <li className={`list-group-item ${bgCoolor}`} key={tribute.id}>
                            <div className="row">
                                <div className="col">{tribute.first_name} {tribute.last_name}</div>
                                <div className="col">${tribute.funds_remaining}</div>
                                <div className="col">{tribute.lives_remaining}</div>
                                <div className="col">{tribute.lives_lost}</div>
                                <div className="col">{tribute.kill_count}</div>
                            </div>
                        </li>
                    );
                })}
            </ul>
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
                <>
                <h1>Current Game Status</h1>
                <div className="row">
                    <div className="col-4">
                        {this.renderConditionalText()}
                        <h3>Resources Needed:</h3>{this.renderResourcesNeeded()}
                        <h3>Special Events:</h3>{this.renderSpecialEvents()}
                    </div>
                    <div className="col-8">
                        {this.renderScoreBoard()}
                    </div>
                </div>
                </>
            );
        } else {
            return (<h3>{this.state.auth.payload}</h3>);
        }
    }

    render(){
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
        gameState: state.gameState,
        stats: Object.values(state.tributeStats),
        globalEvents: Object.values(state.globalEvents)
    }
}

export default connect(mapStateToProps, 
    { 
        setNavBar,
        fetchServerTime,
        fetchGameState,
        fetchAllTributeStatsLimited,
        fetchGlobalEventsByStatus
    })(GameStatus);