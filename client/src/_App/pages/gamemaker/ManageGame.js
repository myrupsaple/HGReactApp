import React from 'react';
import { connect } from 'react-redux';
import { Button, Form } from 'react-bootstrap';

import { setNavBar } from '../../../actions';
import { OAuthFail, NotSignedIn, NotAuthorized, Loading } from '../../components/AuthMessages';
import Wait from '../../../components/Wait';
import AdjustStart from './game_components/AdjustStart';
import AdjustSettings from './game_components/AdjustSettings';
import AdjustStats from './game_components/AdjustStats';
import GameEventForm from './game_components/GameEventForm';
import DeleteModal from './shared_components/DeleteModal';
import {
    fetchGameState,
    fetchGlobalEvents,
    fetchAllTributeStats,
    deleteGlobalEvent
} from '../../../actions';

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
            displayMode: 'global_events',
            viewMode: '1',
            queried: false,
            showCreate: false,
            showEdit: false,
            showDelete: false,
            selectedId: null
        };
        
        this.handleDisplayMode = this.handleDisplayMode.bind(this);
        this.handleViewMode = this.handleViewMode.bind(this);
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

        const response2 = await this.props.fetchGlobalEvents();
        const response = await this.props.fetchGameState();
        if(!response || !response2){
            this.setState({ apiError: true });
            return;
        }
        if(this._isMounted){
            this.setState({ queried: true });
        }
        this.convertTimeToDate();
    }

    async handleDisplayMode(event){
        const input = event.target.value;
        this.setState({ displayMode: input });
        if(input === 'global_events'){
            const response = await this.props.fetchGlobalEvents();
            if(!response){
                this.setState({ apiError: true });
            }
        } else if(input === 'game_state'){
            const response = await this.props.fetchGameState();
            if(!response){
                this.setState({ apiError: true });
            }
        } else if(input === 'tribute_stats'){
            const response = await this.props.fetchAllTributeStats();
            if(!response){
                this.setState({ apiError: true });
            }
        }
    }
    handleViewMode(event){
        const input = event.target.id;
        this.setState({ viewMode: input });
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

    renderModeChanger(){
        return(
            <Form>
                <Form.Label>Select Management Mode:</Form.Label>
                <Form.Row>
                    <div className="col-4"><Form.Group controlId="displayMode">
                        <Form.Control as="select"
                            value={this.state.mode}
                            onChange={this.handleDisplayMode}
                        >
                            <option value="global_events">Global Events</option>
                            <option value="game_state">Game State</option>
                            <option value="tribute_stats">Tribute Stats</option>
                        </Form.Control>
                    </Form.Group></div>
                    {this.renderViewModeChanger()}
                </Form.Row>
                <Form.Row>
                    <Button onClick={this.refreshContents} variant="info">Refresh Data</Button>
                </Form.Row>
            </Form>
        );
    }

    renderViewModeChanger = () => {
        if(this.state.displayMode === 'global_events'){
            return <Button onClick={() => this.setState({ showCreate: true })}>Create</Button>;
        } else if(this.state.displaMode === 'tribute_stats'){
            return(
                <div className="col-">
                    <Form.Label>View Mode:</Form.Label>
                    <Form.Group controlId="view-mode">
                    <Form.Check
                        defaultChecked
                        type="radio"
                        name="view-mode"
                        label="1"
                        id="1"
                        onChange={this.handleViewMode}
                    />
                    <Form.Check
                        type="radio"
                        name="view-mode"
                        label="2"
                        id="2"
                        onChange={this.handleViewMode}
                    />
                    </Form.Group>
                </div>
            );
        } else {
            return null;
        }
    }

    refreshContents = async () => {
        if(this.state.displayMode === 'global_events'){
            const response = await this.props.fetchGlobalEvents();
            if(!response){
                this.setState({ apiError: true });
            }
        } else if(this.state.displayMode === 'game_state'){
            const response = await this.props.fetchGameState();
            if(!response){
                this.setState({ apiError: true });
            }
        } else if(this.state.displayMode === 'tribute_stats'){
            const response = await this.props.fetchAllTributeStats();
            if(!response){
                this.setState({ apiError: true });
            }
        }
    }

    renderTableContents = () => {
        const mode = this.state.displayMode;
        var message1 = '';
        var message2 = '';
        switch(mode){
            case 'global_events':
                message1 = 'Retrieving list of events...';
                message2 = 'No global events were found :(';
                break;
            case 'game_state':
                message1 = 'Retrieving game state...';
                message2 = '';
                break;
            case 'tribute_stats':
                message1 = 'Retrieving tribute stats...';
                message2 = 'No tribute stats were found :(';
                break;
            default:
                break;
        }
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
                    <h5>{message1}</h5>
                );
            }
            return(
                <>
                    <h5>{message2}</h5>
                </>
            );
        }

        if(mode === 'global_events'){
            return this.renderGlobalEvents();
        } else if(mode === 'game_state'){
            return this.renderGameState();
        } else if(mode === 'tribute_stats'){
            return this.renderTributeStats();
        }
    }

    renderGlobalEvents(){      
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

    renderGameState(){
        const gameState = this.props.gameState
        return(
            <>
                <h3>Game State:</h3>
                <ul className="list-group">
                {this.renderTableHeader()}
                <li className="list-group-item" key={gameState.gameActive}>
                    <div className="row">
                        <div className="col">{gameState.food_required}</div>
                        <div className="col">{gameState.water_required}</div>
                        <div className="col">{gameState.medicine_required}</div>
                        <div className="col">{gameState.current_price_tier}</div>
                        <div className="col">{gameState.game_active ? 'Yes' : 'No'}</div>
                        <div className="col">{this.renderAdmin(gameState)}</div>
                    </div>
                </li>
                </ul>
            </>
        );
    }

    renderTributeStats(){
        const tributeStats = this.props.tributeStats;
        tributeStats.sort((a, b) => {
            if(a.first_name < b.first_name){
                return -1;
            } else if(a.first_name > b.first_name){
                return 1;
            } else {
                return 0;
            }
        });

        if(this.state.viewMode === '1'){
            return(
                <>
                <h3>Tribute Stats:</h3>
                <ul className="list-group">
                    {this.renderTableHeader()}
                    {tributeStats.map(tribute => {
                        return(
                            <li className="list-group-item" key={tribute.id}>
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
                                    <div className="col">{this.renderAdmin(tribute)}</div>
                                </div>
                            </li>
                        );
                    })}
                </ul>
                </>
            );
        } else if(this.state.viewMode === '2'){
            return(
                <>
                <h3>Tribute Stats:</h3>
                <ul className="list-group">
                    {this.renderTableHeader()}
                    {tributeStats.map(tribute => {
                        return(
                            <li className="list-group-item" key={tribute.id}>
                                <div className="row">
                                    <div className="col">{tribute.first_name} {tribute.last_name}</div>
                                    <div className="col">{tribute.lives_remaining}</div>
                                    <div className="col">{tribute.life_resources}</div>
                                    <div className="col">{tribute.lives_exempt}</div>
                                    <div className="col">{tribute.lives_purchased}</div>
                                    <div className="col">{tribute.lives_lost}</div>
                                    <div className="col">{tribute.kill_count}</div>
                                    <div className="col">{tribute.has_immunity ? 'Yes' : 'No'}</div>
                                    <div className="col">{this.renderAdmin(tribute)}</div>
                                </div>
                            </li>
                        );
                    })}
                </ul>
                </>
            );   
        }
        
    }

    renderAdmin = (item) => {
        const mode = this.state.displayMode;
        if(mode === 'global_events'){
            if(item.id <= 10  || item.status === 'completed'){
                return(
                    <Button
                        variant="info"
                        onClick={() => this.setState({ showEdit: true, selectedId: item.id })}
                        >
                            Edit
                    </Button>
                );
            } else {
                return(
                    <div className="row">
                        <Button 
                        variant="info"
                        onClick={() => this.setState({ showEdit: true, selectedId: item.id })}
                        >
                            Edit
                        </Button>
                        <Button
                        variant="danger"
                        onClick={() => this.setState({ showDelete: true, selectedId: item.id })}
                        >
                            Delete
                        </Button>
                    </div>
                );
            }
        } else if(mode === 'game_state'){
            return(
                <AdjustSettings gameState={this.props.gameState} onSubmitCallback={this.onSubmitCallback}/>
            );
        } else if(mode === 'tribute_stats'){
            return(
                <Button
                    variant="info"
                    onClick={() => this.setState({ showEdit: true, selectedId: item.id })}
                    >
                        Edit
                </Button>
            );
        }
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
        if(this.state.displayMode === 'global_events'){
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
        } else if(this.state.displayMode === 'game_state'){
            return (
                <h4 className="row">
                    <div className="col">Food Required</div>
                    <div className="col">Water Required</div>
                    <div className="col">Medicine Required</div>
                    <div className="col">Current Price Tier</div>
                    <div className="col">Game Active?</div>
                    <div className="col">Modify</div>
                </h4>
            );
        } else if(this.state.displayMode === 'tribute_stats'){
            if(this.state.viewMode === '1'){
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
                        <div className="col">Mod.</div>
                    </h4>
                );
            } else if(this.state.viewMode === '2'){
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
                        <div className="col">Mod.</div>
                    </h4>
                )
            }
        }
    }

    showModal() {
        if(this.state.showCreate){
            return <GameEventForm gameState={this.props.gameState} onSubmitCallback={this.onSubmitCallback} mode="create" />;
        } else if(this.state.showEdit){
            if(this.state.displayMode === 'global_events'){
                return <GameEventForm id={this.state.selectedId} gameState={this.props.gameState} onSubmitCallback={this.onSubmitCallback} mode="edit"/>;
            } else if(this.state.displayMode === 'tribute_stats'){
                return <AdjustStats id={this.state.selectedId} onSubmitCallback={this.onSubmitCallback}/>;
            }
        } else if(this.state.showDelete){
            return(
                <DeleteModal id={this.state.selectedId} actionType="Global Event" 
                onConfirm={this.props.deleteGlobalEvent}
                onSubmitCallback={this.onSubmitCallback} />
            );
        }
    }

    onSubmitCallback = async () => {
        this.setState({ showCreate: false, showEdit: false, showDelete: false })
        if(this.state.displayMode === 'global_events'){
            const response = await this.props.fetchGlobalEvents();
            if(!response){
                this.setState({ apiError: true });
            }
        } else if(this.state.displayMode === 'game_state'){
            const response = await this.props.fetchGameState();
            if(!response){
                this.setState({ apiError: true });
            }
        } else if(this.state.displayMode === 'tribute_stats'){
            const response = await this.props.fetchAllTributeStats();
            if(!response){
                this.setState({ apiError: true });
            }
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
                    {this.renderModeChanger()}
                    {this.renderTableContents()}
                    {this.showModal()}
                </>
            );
        } else {
            return (<h3>{this.state.auth.payload}</h3>);
        }
    }
    
    render(){
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
        globalEvents: Object.values(state.globalEvents),
        tributeStats: Object.values(state.tributeStats)
    }
}

export default connect(mapStateToProps, { 
    setNavBar, 
    fetchGameState,
    fetchGlobalEvents,
    fetchAllTributeStats,
    deleteGlobalEvent
})(ManageGame);