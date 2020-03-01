import React from 'react';
import { connect } from 'react-redux';

import { setNavBar } from '../../../actions';
import { OAuthFail, NotSignedIn, NotAuthorized, Loading } from '../../components/AuthMessages';
import Wait from '../../../components/Wait';
import { Button, Form } from 'react-bootstrap';
import ResourceEventForm from './dashboard_components/ResourceEventForm';
import { 
    fetchGameState,
    fetchTributeStatEmail,
    fetchGlobalEventsByStatus,
    fetchResourceEvents,
    fetchLifeEvents
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
            apiInitialLoadError: false,
            displayMode: 'stats',
            showCreate: false,
            eliminated: false
        };

        this.handleDisplayMode = this.handleDisplayMode.bind(this);
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

        const response = await this.props.fetchTributeStatEmail(this.props.userEmail);
        const response2 = await this.props.fetchGlobalEventsByStatus();
        const response3 = await this.props.fetchResourceEvents('tribute_email', this.props.userEmail);
        if(!response || !response.data || !response2 || !response3){
            this.setState({ apiInitialLoadError: true });
        }

        if(this.props.stats.lives_remaining === 0){
            this.setState({ eliminated: true });
        }
    }

    async handleDisplayMode(event){
        const input = event.target.value;
        this.setState({ displayMode: input });
        this.refreshData(input);
    }

    renderViewModeChanger = () => {
        return(
            <Form>
                <Form.Label>Select View Mode:</Form.Label>
                <Form.Row>
                    <div className="col-4"><Form.Group controlId="displayMode">
                        <Form.Control as="select"
                            value={this.state.displayMode}
                            onChange={this.handleDisplayMode}
                        >
                            <option value="stats">Your Game Stats</option>
                            <option value="events">Game Events</option>
                            <option value="resources">View Resource Usage</option>
                            <option value="lives">View Life History</option>
                        </Form.Control>
                    </Form.Group></div>
                </Form.Row>
            </Form>
        );
    }

    renderStats(){
        const stats = this.props.stats;
        return(
            <>
            <h3>Your Stats</h3>
                <h5>Lives Remaining: {stats.lives_remaining}</h5>
                <h5>Lives Lost: {stats.lives_lost}</h5>
                <h5>Kills: {stats.kill_count}</h5>
                <h5>Food Resources Used: {stats.food_used}</h5>
                <h5>Food Resources Missed: {stats.food_missed}</h5>
                <h5>Water Resources Used: {stats.water_used}</h5>
                <h5>Water Resources Missed: {stats.water_missed}</h5>
                <h5>Medicine Resources Used: {stats.medicine_used}</h5>
                <h5>Medicine Resources Missed: {stats.medicine_missed}</h5>
                <h5>Roulette Resources Used: {stats.roulette_used}</h5>
                <h5>Life Resources Used: {stats.life_resources}</h5>
                <h5>Lives Purchased: {stats.lives_purchased}</h5>
                <h5>Golden Resources Used: {stats.golden_used}</h5>
                <h5>Funds Remaining: ${stats.funds_remaining}</h5>
                <h5>Total Donations: ${stats.total_donations}</h5>
                <h5>Total Expenditures: ${stats.total_purchases}</h5>
            </>
        );
    }

    renderEvents(){
        const events = this.props.globalEvents.sort((a, b) => b.notification_time - a.notification_time);
        return(
            <>
            <h3>Game Events</h3>
            <ul className="list-group">
                <h4 className="row">
                    <div className="col">Message from the Gamemakers</div>
                    <div className="col">Event created at</div>
                    <div className="col">Event deadline</div>
                    <div className="col">Event status</div>
                    <div className="col">What you need to know</div>
                </h4>
                {events.map(event => {
                    if(event.id === 10){
                        return null;
                    }
                    return(
                        <li className="list-group-item" key={event.id}>
                            <div className="row">
                                <div className="col">{event.message}</div>
                                <div className="col">{this.formatTime(event.notification_time)}</div>
                                <div className="col">{this.formatTime(event.event_end_time)}</div>
                                <div className="col">{event.status}</div>
                                <div className="col">{this.whatToKnow(event)}</div>
                            </div>
                        </li>
                    );
                })}
            </ul>
            </>
        );
    }
    formatTime(time){
        const hours = Math.floor(time / 60).toLocaleString(undefined, { minimumIntegerDigits: 2 });
        const minutes = (time % 60).toLocaleString(undefined, { minimumIntegerDigits: 2 });
        return `${hours}:${minutes}`;
    }
    whatToKnow(event){
        if(event.type.includes('_cost_start')){
            return `Prices will increase at the time indicated under 'event deadline'`;
        } else if(event.type === 'food_required'){
            return `You must purchase or use a food resource by the 'event deadline'`;
        } else if(event.type === 'water_required'){
            return `You must purchase or use a water resource by the 'event deadline'`;
        } else if(event.type === 'medicine_required'){
            return `You must purchase or use a medicine resource by the 'event deadline'`;
        } else if(event.type === 'special_event'){
            return `Complete the specified 'event deadline' or face the consequences.`;
        } else if(event.type === 'announcement'){
            return `This is simply an announcement.`;
        }
    }

    renderResources(){
        const events = this.props.resourceEvents.sort((a, b) => b.time - a.time);
        return(
            <>
            <h3>Resources You've Used</h3>
            <ul className="list-group">
                <h4 className="row">
                    <div className="col">Resource type</div>
                    <div className="col">Acquired by</div>
                    <div className="col">Time of acquisition</div>
                    <div className="col">Notes</div>
                </h4>
                {events.map(event => {
                    if(event.id === 10){
                        return null;
                    }
                    return(
                        <li className="list-group-item" key={event.id}>
                            <div className="row">
                                <div className="col">{event.type}</div>
                                <div className="col">{event.method}</div>
                                <div className="col">{this.formatTime(event.time)}</div>
                                <div className="col">{event.notes}</div>
                            </div>
                        </li>
                    );
                })}
            </ul>
            </>
        );
    }
    renderResourceForm(){
        if(this.state.showCreate){
            return <ResourceEventForm email={this.props.userEmail} onSubmitCallback={this.onSubmitCallback}/>;
        } else if(!this.state.eliminated) {
            return <Button variant="info" onClick={() => this.setState({ showCreate: true })}>Submit Resource Code</Button>
        } else {
            return null;
        }
    }

    renderLives(){
        const events = this.props.lifeEvents.sort((a, b) => b.time - a.time);
        return(
            <>
            <h3>Life Events</h3>
            <ul className="list-group">
                <h4 className="row">
                    <div className="col">Event Type</div>
                    <div className="col">Method</div>
                    <div className="col">Time</div>
                    <div className="col">Notes</div>
                </h4>
                {events.map(event => {
                    if(event.id === 10){
                        return null;
                    }
                    return(
                        <li className="list-group-item" key={event.id}>
                            <div className="row">
                                <div className="col">{event.type}</div>
                                <div className="col">{event.method}</div>
                                <div className="col">{this.formatTime(event.time)}</div>
                                <div className="col">{event.notes}</div>
                            </div>
                        </li>
                    );
                })}
            </ul>
            </>
        );
    }

    onSubmitCallback = async () => {
        this.setState({ showCreate: false });
        this.refreshData(this.state.displayMode);
    };

    refreshData = async (displayMode) => {
        if(displayMode === 'stats'){
            const response = await this.props.fetchTributeStatEmail(this.props.userEmail);
            if(!response){
                this.setState({ apiError: true });
            } else {
                this.setState({ apiError: false });
            }
        } else if(displayMode === 'events'){
            const response = await this.props.fetchGlobalEventsByStatus();
            if(!response){
                this.setState({ apiError: true });
            } else {
                this.setState({ apiError: false });
            }
        } else if(displayMode === 'resources'){
            const response = await this.props.fetchResourceEvents('tribute_email', this.props.userEmail);
            if(!response){
                this.setState({ apiError: true });
            } else {
                this.setState({ apiError: false });
            }
        } else if(displayMode === 'lives'){
            const response = await this.props.fetchLifeEvents('tribute_email', this.props.userEmail);
            if(!response){
                this.setState({ apiError: true });
            } else {
                this.setState({ apiError: false });
            }
        }
        if(this.props.stats.lives_remaining === 0){
            this.setState({ eliminated: true });
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
        } else if(this.state.apiInitialLoadError || this.state.apiError){
            return <h3>Unable to load data at this time. Please try again later.</h3>
        } else if(this.state.auth.payload === null){
            const stats = this.props.stats;
            if(!stats.first_name){
                return(
                    <h1>You must be signed in as a tribute to access this page.</h1>
                );
            } else if(this.state.displayMode === 'stats'){
                return (
                    <>
                        {this.renderStats()}
                    </>
                );
            } else if(this.state.displayMode === 'events'){
                return(
                    <>
                        {this.renderEvents()}
                    </>
                );
            } else if(this.state.displayMode === 'resources'){
                return(
                    <>
                        {this.renderResources()}
                        {this.renderResourceForm()}
                    </>
                );
            } else if(this.state.displayMode === 'lives'){
                return(
                    <>
                        {this.renderLives()}
                    </>
                );
            }
        } else {
            return (<h3>{this.state.auth.payload}</h3>);
        }
    }

    renderEliminated = () => {
        if(this.state.eliminated){
            return (
                <h1 className="coolor-text-red" style={{ fontSize: "12pt" }}>
                    <span role="img" aria-label="check/x">&#10071;</span> You have been eliminated and will no longer be able to submit resource codes. Please contact the Gamemakers if you believe this is an error.
                </h1>
            );
        } else {
            return null;
        }
    }

    render(){
        return(
            <>
                <h1>{this.props.stats.first_name} {this.props.stats.last_name}</h1>
                {this.renderEliminated()}
                {this.renderViewModeChanger()}
                <Button onClick={() => this.refreshData(this.state.displayMode)}>Refresh Data</Button>
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
        stats: state.selectedTributeStats,
        globalEvents: Object.values(state.globalEvents),
        resourceEvents: Object.values(state.resourceEvents),
        lifeEvents: Object.values(state.lifeEvents)
    }
}

export default connect(mapStateToProps, 
    {
    setNavBar,
    fetchGameState,
    fetchTributeStatEmail,
    fetchGlobalEventsByStatus,
    fetchResourceEvents,
    fetchLifeEvents
    })(SubmitResource);