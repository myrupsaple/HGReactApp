import React from 'react';
import { connect } from 'react-redux';
import { Button } from 'react-bootstrap';

import { setNavBar, fetchGameState } from '../../../actions';
import { OAuthFail, NotSignedIn, NotAuthorized, Loading } from '../../components/AuthMessages';
import Wait from '../../../components/Wait';
import AdjustStart from './game_components/AdjustStart';
import AdjustSettings from './game_components/AdjustSettings';
import GameEventForm from './game_components/GameEventForm';
import { fetchGlobalEvents } from '../../../actions';

class ManageGame extends React.Component {
    _isMounted = false;
    constructor(props){
        super(props);
        this.state = {
            auth: {
                loading: true,
                payload: null
            },
            gameStateLoaded: false,
            startTimeAsDate: '',
            queried: false,
            showCreate: false,
            showEdit: false,
            showDelete: false,
            selectedId: null
        };
    }

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

        const response = await this.props.fetchGameState();
        const response2 = await this.props.fetchGlobalEvents();
        if(!response || !response2){
            this.setState({ apiError: true });
            return;
        }
        if(this._isMounted){
            this.setState({ queried: true });
        }
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

    renderGlobalEvents(){
        if(this.state.apiError){
            return(
                <h5>
                    An error occurred while loading data.
                </h5>
            );
        }
        if(Object.keys(this.props.globalEvents).length === 0){
            // Return different message before and after first search is sent
            if(!this.state.queried) {
                return(
                    <h5>
                        Retrieving list of events...
                    </h5>
                );
            }
            return(
                <>
                    <h5>No global events were found :(</h5>
                </>
            );
        }
        
        const globalEvents = this.props.globalEvents;
        globalEvents.sort((a, b) => a.notification_time - b.notification_time);

        return(
            <>
            <h3>Global Events:</h3>
            <ul className="list-group">
                {this.renderTableHeader()}
                {globalEvents.map(event => {
                    if(event.id === 10){
                        return null;
                    }
                    return(
                        <li className="list-group-item" key={event.id}>
                            <div className="row">
                                <div className="col">{event.type}</div>
                                <div className="col">{event.description}</div>
                                <div className="col">{event.message}</div>
                                <div className="col">{this.formatTime(event.notification_time)}</div>
                                <div className="col">{this.formatTime(event.event_end_time)}</div>
                                <div className="col">{event.status}</div>
                                <div className="col">{this.renderAdmin(event)}</div>
                            </div>
                        </li>
                    );
                })}
            </ul>
            </>
        );
    }

    formatTime(timeAsInt){
        const hours = Math.floor(timeAsInt / 60).toLocaleString(undefined, { minimumIntegerDigits: 2 });
        const minutes = (timeAsInt % 60).toLocaleString(undefined, { minimumIntegerDigits: 2 });
        if(hours >= 24){
            return 'NA';
        } else {
            return `${hours}:${minutes}`;
        }
    }

    renderTableHeader = () => {
        return (
            <h4 className="row">
                <div className="col">Event Type</div>
                <div className="col">Description</div>
                <div className="col">Message</div>
                <div className="col">Notification Time</div>
                <div className="col">End Time</div>
                <div className="col">Status</div>
                <div className="col">Modify</div>
            </h4>
        );
    }

    renderAdmin = (globalEvent) => {
        if(globalEvent.id <= 10  || globalEvent.status === 'completed'){
            return(
                <Button
                    variant="info"
                    onClick={() => this.setState({ showEdit: true, selectedId: globalEvent.id })}
                    >
                        Edit
                </Button>
            );
        } else {
            return(
                <div className="row">
                    <Button 
                    variant="info"
                    onClick={() => this.setState({ showEdit: true, selectedId: globalEvent.id })}
                    >
                        Edit
                    </Button>
                    <Button
                    variant="danger"
                    onClick={() => this.setState({ showDelete: true, selectedId: globalEvent.id })}
                    >
                        Delete
                    </Button>
                </div>
            );
        }
    }

    showModal() {
        if(this.state.showEdit){
            return(
                <GameEventForm id={this.state.selectedId} onSubmitCallback={this.onSubmitCallback} mode="edit"/>
            )
        } else if(this.state.showCreate){
            return(
                <GameEventForm onSubmitCallback={this.onSubmitCallback} mode="create" />
            )
        }
    }

    onSubmitCallback = async () => {
        this.setState({ showCreate: false, showEdit: false, showDelete: false })
        const response = await this.props.fetchGameState();
        const response2 = await this.props.fetchGlobalEvents();
        if(!response || !response2){
            this.setState({ apiError: true });
        }
    };

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
                    <h3>
                        Maximum Districts: {this.props.gameState.max_districts}
                        &nbsp;
                    </h3>
                    <h3>
                        Areas:
                    </h3>
                    <h5>
                        {this.renderAreas()}
                    </h5>
                        <AdjustSettings gameState={this.props.gameState} onSubmitCallback={this.onSubmitCallback}/>
                    <h3>Create New Event: <Button onClick={() => this.setState({ showCreate: true })}>Create</Button> </h3>
                    {this.renderGlobalEvents()}
                    {this.showModal()}
                </>
            );
        } else {
            return (<h3>{this.state.auth.payload}</h3>);
        }
    }

    renderAreas(){
        const areaString = this.props.gameState.areas;
        const areas = areaString.split(',');
        return(
            <>
                {areas.map(area => {
                    return <div key={area}>{area}</div>
                })}
            </>
        );
    }
    
    render = () => {
        return(
            <>
                <h3>Manage Game Settings</h3>
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
        globalEvents: Object.values(state.globalEvents)
    }
}

export default connect(mapStateToProps, { 
    setNavBar, 
    fetchGameState,
    fetchGlobalEvents
})(ManageGame);