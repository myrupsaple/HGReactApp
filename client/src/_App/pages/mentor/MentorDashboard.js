import React from 'react';
import { connect } from 'react-redux';
import { Form } from 'react-bootstrap';

import { setNavBar } from '../../../actions';
import { OAuthFail, NotSignedIn, NotAuthorized, Loading } from '../../components/AuthMessages';
import Wait from '../../../components/Wait';
import {
    fetchServerTime,
    fetchGameState,
    fetchTributeStats,
    fetchGlobalEventsByStatus
} from '../../../actions';

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
            viewMode: 'overview',
            foodPending: 0,
            waterPending: 0,
            medicinePending: 0,
            resourceEventExists: false,
            specialEventExists: false,
            apiError: false
        };

        this.handleViewMode = this.handleViewMode.bind(this);
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
        const response2 = await this.props.fetchTributeStats(this.props.userEmail);
        const response3 = await this.props.fetchGlobalEventsByStatus();
        if(!response || !response2 || !response3){
            this.setState({ apiError: true });
        }

        var resourceEventExists = false;
        var specialEventExists = false;
        for(let event of this.props.globalEvents){
            if(event.status === 'active'){
                if(event.type === 'food_required'){
                    const foodPending = this.state.foodPending + 1;
                    this.setState({ foodPending: foodPending });
                } else if(event.type === 'water_required'){
                    const waterPending = this.state.waterPending + 1;
                    this.setState({ waterPending: waterPending });
                } else if(event.type === 'medicine_required'){
                    const medicinePending = this.state.medicinePending + 1;
                    this.setState({ medicinePending: medicinePending });
                }

                if(['food_required', 'water_required', 'medicine_required'].includes(event.type)){
                    resourceEventExists = true
                } else {
                    specialEventExists = true;
                }
            }
        }
        this.setState({ resourceEventExists, specialEventExists })

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

    handleViewMode(event){
        const input = event.target.id;
        this.setState({ viewMode: input });
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
        if(!this.state.resourceEventExists){
            return <h5>None</h5>;
        }
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
        if(!this.state.specialEventExists){
            return <h5>None</h5>;
        }
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

    renderViewModeChanger(){
        return(
            <div className="col-">
                <Form.Label>View Mode:</Form.Label>
                <Form.Group controlId="view-mode">
                <Form.Check
                    defaultChecked
                    type="radio"
                    name="view-mode"
                    label="Overview"
                    id="overview"
                    onChange={this.handleViewMode}
                />
                <Form.Check
                    type="radio"
                    name="view-mode"
                    label="Resources"
                    id="resources"
                    onChange={this.handleViewMode}
                />
                <Form.Check
                    type="radio"
                    name="view-mode"
                    label="Lives"
                    id="lives"
                    onChange={this.handleViewMode}
                />
                </Form.Group>
            </div>
        );
    }
    renderLegend(){
        return(
            <p>
                FU = Food Used; FM = Food Missed; WU = Water Used; WM = Water Missed; MU = Medicine Used;
                &nbsp;MM = Medicine Missed; RU = Roulette Used; GU = Golden Used; LRem = Lives Remaining;
                &nbsp;LRU = Life Resources Used; LE = Lives Exempt From Pricing Tiers;
                &nbsp;LLo = Lives Lost; K = Kills; IMM = Immunity;
            </p>
        )
    }
    renderTributeStats(){
        const stats = this.props.stats;
        stats.sort((a, b) => {
            if(a.first_name < b.first_name){
                return -1;
            } else if(a.first_name > b.first_name){
                return 1;
            } else {
                return 0;
            }
        });

        if(this.state.viewMode === 'overview'){
            return(
                <>
                <ul className="list-group">
                    {this.renderTableHeader()}
                    {stats.map(tribute => {
                        const [bgCoolor, warnings] = this.showTributeWarnings(tribute);

                        return(
                            <li className={`list-group-item ${bgCoolor}`} key={tribute.id}>
                                <div className="row">
                                    <div className="col">{tribute.first_name} {tribute.last_name}</div>
                                    <div className="col">{tribute.funds_remaining}</div>
                                    <div className="col">{tribute.total_donations}</div>
                                    <div className="col">{tribute.total_purchases}</div>
                                    <div className="col">{warnings}</div>
                                </div>
                            </li>
                        );
                    })}
                </ul>
                </>
            );
        } else if(this.state.viewMode === 'resources'){
            return(
                <>
                <ul className="list-group">
                    {this.renderTableHeader()}
                    {stats.map(tribute => {
                        const [bgCoolor] = this.showTributeWarnings(tribute);

                        return(
                            <li className={`list-group-item ${bgCoolor}`} key={tribute.id}>
                                <div className="row">
                                    <div className="col">{tribute.first_name} {tribute.last_name}</div>
                                    <div className="col">{tribute.food_used}</div>
                                    <div className="col">{tribute.food_missed}</div>
                                    <div className="col">{tribute.water_used}</div>
                                    <div className="col">{tribute.water_missed}</div>
                                    <div className="col">{tribute.medicine_used}</div>
                                    <div className="col">{tribute.medicine_missed}</div>
                                    <div className="col">{tribute.roulette_used}</div>
                                    <div className="col">{tribute.golden_used}</div>
                                </div>
                            </li>
                        );
                    })}
                </ul>
                </>
            );
        } else if(this.state.viewMode === 'lives'){
            return(
                <>
                <ul className="list-group">
                    {this.renderTableHeader()}
                    {stats.map(tribute => {
                        const [bgCoolor] = this.showTributeWarnings(tribute);

                        return(
                            <li className={`list-group-item ${bgCoolor}`} key={tribute.id}>
                                <div className="row">
                                    <div className="col">{tribute.first_name} {tribute.last_name}</div>
                                    <div className="col">{tribute.lives_remaining}</div>
                                    <div className="col">{tribute.life_resources}</div>
                                    <div className="col">{tribute.lives_exempt}</div>
                                    <div className="col">{tribute.lives_purchased}</div>
                                    <div className="col">{tribute.lives_lost}</div>
                                    <div className="col">{tribute.kill_count}</div>
                                    <div className="col">{tribute.has_immunity ? 'Yes' : 'No'}</div>
                                </div>
                            </li>
                        );
                    })}
                </ul>
                </>
            );   
        }   
    }
    renderTableHeader = () => {
        if(this.state.viewMode === 'overview'){
            return (
                <h4 className="row">
                    <div className="col">Name</div>
                    <div className="col">Funds Remaining</div>
                    <div className="col">Total Donations</div>
                    <div className="col">Total Purchases</div>
                    <div className="col">Warnings</div>
                </h4>
            );
        } else if(this.state.viewMode === 'resources'){
            return (
                <h4 className="row">
                    <div className="col">Name</div>
                    <div className="col">FU</div>
                    <div className="col">FM</div>
                    <div className="col">WU</div>
                    <div className="col">WM</div>
                    <div className="col">MU</div>
                    <div className="col">MM</div>
                    <div className="col">RU</div>
                    <div className="col">GU</div>
                </h4>
            );
        } else if(this.state.viewMode === 'lives'){
            return(
                <h4 className="row">
                    <div className="col">Name</div>
                    <div className="col">LRem</div>
                    <div className="col">LRU</div>
                    <div className="col">LE</div>
                    <div className="col">LP</div>
                    <div className="col">LLo</div>
                    <div className="col">K</div>
                    <div className="col">IMM</div>
                </h4>
            )
        }
    }
    showTributeWarnings(tribute){
        var bgCoolor = 'coolor-bg-white';
        var warnings = '';
        if(tribute.food_used + tribute.food_missed < this.props.gameState.food_required + this.state.foodPending){
            warnings += ' ~ Food is needed by the deadline';
            bgCoolor = 'coolor-bg-yellow-lighten-4';
        }
        if(tribute.water_used + tribute.water_missed < this.props.gameState.water_required + this.state.waterPending){
            warnings += ' ~ Water is needed by the deadline';
            bgCoolor = 'coolor-bg-yellow-lighten-4';
        }
        if(tribute.medicine_used + tribute.medicine_missed < this.props.gameState.medicine_required + this.state.medicinePending){
            warnings += ' ~ Medicine is needed by the deadline';
            bgCoolor = 'coolor-bg-yellow-lighten-4';
        }
        if(tribute.lives_remaining === 2){
            warnings += ' ~ Tribute has 2 lives remaining';
            bgCoolor = 'coolor-bg-yellow-lighten-4';
        } else if(tribute.lives_remaining === 1){
            warnings += ' ~ Tribute has 1 lives remaining';
            bgCoolor = 'coolor-bg-red-lighten-4';
        } else if(tribute.lives_remaining === 0){
            warnings = 'Tribute has been eliminated';
            bgCoolor = 'coolor-bg-red-lighten-1';
        }
        if(tribute.funds < 100){
            warnings += ' ~ Tribute is running low on funds';
            if(!bgCoolor.includes('coolor-bg-red-lighten')) bgCoolor = 'coolor-bg-orange-lighten-4';
        }

        warnings = warnings.replace(/~ /, '');
        if(warnings === ''){
            warnings = 'None';
        }
        return [bgCoolor, warnings];
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
                    <div className="col-3">
                        {this.renderConditionalText()}
                        <h3>Resources Needed:</h3>{this.renderResourcesNeeded()}
                        <h3>Special Events:</h3>{this.renderSpecialEvents()}
                    </div>
                    <div className="col-9">
                        <h3>Your Tributes:</h3>
                        {this.renderViewModeChanger()}
                        {this.renderLegend()}
                        {this.renderTributeStats()}
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
        userEmail: state.auth.userEmail,
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
        fetchTributeStats,
        fetchGlobalEventsByStatus
    })(GameStatus);