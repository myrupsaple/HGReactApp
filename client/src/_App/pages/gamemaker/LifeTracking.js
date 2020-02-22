import React from 'react';
import { connect } from 'react-redux';
import { Form, Col, Button } from 'react-bootstrap';
import DatePicker from 'react-datepicker';

import { setNavBar } from '../../../actions';
import { OAuthFail, NotSignedIn, NotAuthorized, Loading } from '../../components/AuthMessages';
import Wait from '../../../components/Wait';
import { 
    fetchGameState,
    fetchTributes,
    fetchLifeEvent,
    fetchLifeEvents,
    fetchLifeEventsRange,
    fetchAllLifeEvents,
    deleteLifeEvent,
    clearLifeEventsList
} from '../../../actions';
import LifeEventForm from './life_components/LifeEventForm';
import DeleteLifeEvent from './life_components/DeleteLifeEvent';

class ManageFunds extends React.Component {
    _isMounted = false;
    constructor(props){
        super(props);
        this.state = {
            auth: {
                loading: true,
                payload: null
            },
            queried: false,
            searchType: 'tribute_email',
            // For time, search terms will be in minutes (eg. 12:00 pm = 720)
            searchTerm: '',
            searchTermSecondary: '',
            // These will hold the hh:mm time values as strings
            timeFormatted: '',
            timeFormattedSecondary: '',
            filterEventType: 'all',
            showStats: true,
            // A paired combat event of type 'combat' is created each time a life lost
            // through combat is reported. This is to more easily keep track of
            // kill counts
            showPairedCombat: false,
            showCreate: false, 
            showEdit: false,
            showDelete: false,
            // Neded to access individual life event data
            selectedId: null,
            // API error handling
            apiInitialLoadError: false,
            apiError: false
        };
        this.handleSearchType = this.handleSearchType.bind(this);
        this.handleSearchTerm = this.handleSearchTerm.bind(this);
        this.handleSearchTermSecondary = this.handleSearchTermSecondary.bind(this);
        this.handleFilterEventType = this.handleFilterEventType.bind(this);
        this.handleshowStats = this.handleshowStats.bind(this);
        this.handlePairedCombat = this.handlePairedCombat.bind(this);
        this.handleSearchSubmit = this.handleSearchSubmit.bind(this);
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
        const response = await this.props.fetchTributes();
        const response2 = await this.props.fetchGameState();
        if(!response || !response2){
            this.setState({ apiInitialLoadError: true });
        }
    }

    handleSearchType(event) {
        this.setState({ 
            searchType: event.target.value,
            searchTerm: '',
            searchTermSecondary: ''
        });
        if(event.target.value === 'method'){
            this.setState({ searchTerm: 'purchased' });
        } if(event.target.value === 'time'){
            const now = new Date();
            const hours = now.getHours().toLocaleString(undefined, { minimumIntegerDigits: 2 });
            const minutes = now.getMinutes().toLocaleString(undefined, { minimumIntegerDigits: 2 });
            this.setState({
                searchTerm: 60 * hours + 1 * minutes,
                timeFormatted: `${hours}:${minutes}`
            })
        }
    }
    handleSearchTerm(event) {
        if(this.state.searchType === 'time'){
            // Returns as [timeInMinutes, hh:mm]
            const time = this.formatTimeFromDate(event);
            this.setState({ 
                searchTerm: time[0],
                timeFormatted: time[1]
        });
        } else {
            this.setState({ searchTerm: event.target.value });
        }
    }
    handleSearchTermSecondary(event) {
        if(this.state.searchType === 'time'){
            const time = this.formatTimeFromDate(event);
            this.setState({ 
                searchTermSecondary: time[0],
                timeFormattedSecondary: time[1]
        });
        } else {
            this.setState({ searchTermSecondary: event.target.value });
        }
    }
    handleFilterEventType(event){
        this.setState({ filterEventType: event.target.id });
    }
    handlePairedCombat(event){
        this.setState({ showPairedCombat: event.target.checked });
    }
    handleshowStats(event){
        this.setState({ showStats: event.target.checked });
    }
    
    async handleSearchSubmit(event){
        if(this._isMounted){
            this.setState({ queried: true });
        }
        event.preventDefault();

        await this.props.clearLifeEventsList();

        const searchType = this.state.searchType;
        const searchTerm = this.state.searchTerm;
        const searchTermSecondary = this.state.searchTermSecondary;

        if(searchType === 'tribute_email'){
            const emails = [];
            const name = this.state.searchTerm.toLowerCase();
            this.props.tributes.map(tribute => {
                if(tribute.first_name.toLowerCase().includes(name)){
                    emails.push(tribute.email);
                }
                return null;
            });
            emails.map(async email => {
                const response = await this.props.fetchLifeEvents(searchType, email);
                if(!response){
                    this.setState({ apiError: true });
                }
                return null;
            })
            this.setState({ apiError: false });

        } else if(searchType === 'method'){
            if(searchTerm === 'purchased' || searchTerm === 'combat'){
                const response = await this.props.fetchLifeEvents(searchType, searchTerm);
                if(!response){
                    this.setState({ apiError: true });
                    return null;
                } else {
                    this.setState({ apiError: false });
                }
            } else if(searchTerm === 'mutts'){
                const response = await this.props.fetchLifeEvents('method', 'mutts');
                if(!response){
                    this.setState({ apiError: true });
                    return null;
                } else {
                    this.setState({ apiError: false });
                }
            } else if(searchTermSecondary === 'all'){
                const resources = ['life', 'food', 'water', 'medicine', 'roulette'];
                for (let resource of resources){
                    const response = await this.props.fetchLifeEvents('method', resource);
                    if(!response){
                        this.setState({ apiError: true });
                        return null;
                    }
                }
                this.setState({ apiError: false });
            } else {
                const response = await this.props.fetchLifeEvents(searchType, searchTermSecondary);
                if(!response){
                    this.setState({ apiError: true });
                    return null;
                } else {
                    this.setState({ apiError: false });
                }
            }
        } else if(searchType === 'time'){
            if(searchTermSecondary === ''){
                const response = await this.props.fetchLifeEvents(searchType, searchTerm);
                if(!response){
                    this.setState({ apiError: true });
                    return null;
                } else {
                    this.setState({ apiError: false });
                }
            } else {
                const response = await this.props.fetchLifeEventsRange(searchType, searchTerm, searchTermSecondary);
                if(!response){
                    this.setState({ apiError: true });
                    return null;
                } else {
                    this.setState({ apiError: false });
                }
            }
        }
    }

    formatTimeFromDate(time){
        const hours = time.getHours().toLocaleString(undefined, { minimumIntegerDigits: 2 });
        const minutes = time.getMinutes().toLocaleString(undefined, { minimumIntegerDigits: 2 });
        // * 1 prevents the values from being formatted into a string
        // eg. 12:00 would be formatted to 60 * '12' + '00' = '720' + '00' = '72000'
        return [60 * hours + 1 * minutes, `${hours}:${minutes}`];
    }

    formatTimeFromInt(time){
        const hours = Math.floor(time/60).toLocaleString(undefined, { minimumIntegerDigits: 2 });
        const minutes = (time % 60).toLocaleString(undefined, { minimumIntegerDigits: 2 });
        return `${hours}:${minutes}`;
    }

    capitalizeFirst(string){
        return string.slice(0, 1).toUpperCase() + string.slice(1, string.length);
    }

    renderSearchForm = () => {
        return(
            <>
            <Form onSubmit={this.handleSearchSubmit}>
                <Form.Label>Search For Lives Gained/Lost:</Form.Label>
                <Form.Row>
                    <Col>
                    <Form.Group controlId="search-type">
                        <Form.Control as="select"
                            value={this.state.searchType}
                            onChange={this.handleSearchType}
                        >
                            <option value="tribute_email">Tribute Name</option>
                            <option value="method">Method</option>
                            <option value="time">Time Range</option>
                        </Form.Control>
                    </Form.Group>
                    </Col>
                    <Col>
                        {this.renderSearchField()}
                    </Col>
                </Form.Row>
                <Form.Row>
                    <Col>
                    <Button
                        variant="secondary"
                        className="coolor-bg-purple-lighten-2"
                        onClick={() => this.setState({ showCreate: true })}
                    >
                        Add New Event
                    </Button>
                    </Col>
                    <Col>
                    <Button className="coolor-bg-blue-darken-2" onClick={this.searchForAllLifeEvents}>Show All Events</Button>
                    </Col>
                    <Col>
                    <Button className="coolor-bg-blue-lighten-2" type="submit">Search</Button>
                    </Col>
                </Form.Row>
            </Form>
            </>
        )
    }

    renderSearchField = () => {
        if(Object.keys(this.props.tributes).length === 0){
            return 'Loading...';
        }
        if(this.state.searchType === 'tribute_email'){
            return(
                <Form.Group controlId="query">
                    <Form.Control required 
                        value={this.state.searchTerm}
                        autoComplete="off"
                        placeholder="Enter tribute name..."
                        onChange={this.handleSearchTerm}
                    />
                </Form.Group>
            );
        } else if(this.state.searchType === 'method'){
            return(
                <>
                <Form.Group controlId="query">
                    <Form.Control required
                        as="select"
                        value={this.state.searchTerm}
                        onChange={this.handleSearchTerm}
                    >
                        <option value="purchased">Purchased</option>
                        <option value="resource">Resource</option>
                        <option value="combat">Combat</option>
                        <option value="mutts">Mutts</option>
                        <option value="other">Other</option>
                    </Form.Control>
                </Form.Group>
                {this.renderEventTypeSecondary()}
                </>
            );
        } else if(this.state.searchType === 'time'){
            const gameTime = new Date(Date.parse(this.props.gameState.start_time));
            const date1 = new Date();
            date1.setHours(gameTime.getHours());
            date1.setMinutes(gameTime.getMinutes());
            const date2 = new Date();
            date2.setHours(gameTime.getHours() + 5);
            date2.setMinutes(gameTime.getMinutes());
            return(
                <>
                <Form.Group controlId="query">
                    <div><Form.Label>From (Start Time)</Form.Label></div>
                    <DatePicker 
                        showTimeSelect
                        showTimeSelectOnly
                        minTime={date1}
                        maxTime={date2}
                        timeIntervals={2}
                        value={this.state.timeFormatted}
                        onChange={this.handleSearchTerm}
                        dateFormat="hh:mm aa"
                    />
                </Form.Group>
                <Form.Group controlId="query-secondary">
                    <div><Form.Label>To (End Time)</Form.Label></div>
                    
                    <DatePicker
                        showTimeSelect
                        showTimeSelectOnly
                        minTime={date1}
                        maxTime={date2}
                        timeIntervals={2}
                        value={this.state.timeFormattedSecondary}
                        onChange={this.handleSearchTermSecondary}
                        dateFormat="hh:mm aa"
                    />
                    <div><Form.Label>
                        Leaving the second parameter blank will search for a perfect match on the first time.
                    </Form.Label></div>
                </Form.Group>
                </>
            );
        }
    }

    renderEventTypeSecondary = () => {
        if(this.state.searchTerm === 'resource'){
            return(
                <Form.Group controlId="query-secondary">
                    <Form.Control
                        as="select"
                        value={this.state.searchTermSecondary}
                        onChange={this.handleSearchTermSecondary}
                    >
                        <option value="all">Show All</option>
                        <option value="life_resource">Life (gained)</option>
                        <option value="food_resource">Food (lost)</option>
                        <option value="water">Water (lost)</option>
                        <option value="medicine">Medicine (lost)</option>
                        <option value="roulette">Roulette</option>
                    </Form.Control>
                </Form.Group>
            )
        }
    }

    renderOptions(){
        return(
            <Form.Row>
                <div className="col-">
                    <Form.Label>Filter Events By:</Form.Label>
                </div>
                <div className="col-">
                    <Form.Group controlId="filter-by">
                        <Form.Check
                            defaultChecked
                            type="radio"
                            name="filter-event-radios"
                            label="All"
                            id="all"
                            onChange={this.handleFilterEventType}
                        />
                        <Form.Check
                            type="radio"
                            name="filter-event-radios"
                            label="Gained"
                            id="gained"
                            onChange={this.handleFilterEventType}
                        />
                        <Form.Check
                            type="radio"
                            name="filter-event-radios"
                            label="Lost"
                            id="lost"
                            onChange={this.handleFilterEventType}
                        />
                    </Form.Group>
                </div>
                <div className="col-1"></div>
                <div className="col-">
                    <Form.Label>Extra Options:</Form.Label>
                </div>
                <div className="col-">
                    <Form.Group controlId="show-details" style={{ marginBottom: '0px' }}>
                        <Form.Check
                            defaultChecked
                            value={this.state.showStats}
                            onChange={this.handleshowStats}
                            label="Show Details"
                        />
                    </Form.Group>
                    <Form.Group controlId="show-paired" style={{ marginBottom: '0px' }}>
                        <Form.Check
                            value={this.state.showPairedCombat}
                            onChange={this.handlePairedCombat}
                            label="Show Paired Combat Events"
                        />
                    </Form.Group>
                </div>
            </Form.Row>
        );
    }

    searchForAllLifeEvents = async () => {
        this.setState({ searchTerm: '', searchTermSecondary: '', queried: true});
        const response = await this.props.fetchAllLifeEvents();
        if(!response){
            this.setState({ apiError: true });
            return null;
        } else {
            this.setState({ apiError: false });
        }
    }

    renderTableHeader(){
        return(
            <h4 className="row">
                <div className="col">Tribute Name</div>
                <div className="col">Event Type</div>
                <div className="col">Method</div>
                <div className="col">Time</div>
                <div className="col">Notes</div>
                <div className="col">Modify</div>
            </h4>
        );
    }

    renderLifeEvents(){
        if(this.state.apiInitialLoadError) {
            return(
                <h5>
                    An error occurred when loading data. Please refresh the page and try again.
                </h5>
            );
        } else if(this.state.apiError) {
            return(
                <h5>
                    An error occurred when loading data. Please try again.
                </h5>
            );
        }
        if(Object.keys(this.props.lifeEvents).length === 0){
            // Return different message before and after first search is sent
            if(!this.state.queried) {
                return(
                    <h5>
                        Search the database of life events
                    </h5>
                );
            }
            return(
                <>
                    <h5>No events were found :(</h5>
                </>
            );
        }

        const eventTypeFilter = this.state.filterEventType;
        var lifeEvents = this.props.lifeEvents;
        if(eventTypeFilter === 'all' && !this.state.showPairedCombat){
            lifeEvents = lifeEvents.filter(lifeEvent => lifeEvent.type !== 'combat');
        } else if(eventTypeFilter !== 'all') {
            lifeEvents = lifeEvents.filter(lifeEvent => lifeEvent.type === eventTypeFilter);
        }

        lifeEvents.sort((a, b) => {
            if(a.time > b.time){
                return -1;
            } else if(a.time < b.time){
                return 1;
            } else {
                return 0;
            }
        });

        return(
            <>
            <ul className="list-group">
            {this.renderStats(lifeEvents)}

            {this.renderTableHeader()}
            {lifeEvents.map(lifeEvent => {
                return(
                    <li className="list-group-item" key={lifeEvent.id}>
                        <div className="row">
                            <div className="col">{this.getTributeName(lifeEvent.tribute_email)}</div>
                            <div className="col">{this.capitalizeFirst(lifeEvent.type)}</div>
                            <div className="col">{this.capitalizeFirst(lifeEvent.method)}</div>
                            <div className="col">{this.formatTimeFromInt(lifeEvent.time)}</div>
                            <div className="col">{lifeEvent.notes}</div>
                            <div className="col">{this.renderAdmin(lifeEvent)}</div>
                        </div>
                    </li>
                );
            })}
            </ul>
            </>
        );
    }

    getTributeName = (email) => {
        if(email === 'No Assignment'){
            return 'No Assignment';
        }
        for (let tribute of this.props.tributes){
            if(email === tribute.email){
                return (tribute.first_name + ' ' + tribute.last_name);
            }
        }
        return 'Unrecognized Tribute';
    }

    renderAdmin = (lifeEvent) => {
        if(lifeEvent.type === 'combat'){
            return(
                <Button
                    variant="danger"
                    onClick={() => this.setState({ showDelete: true, selectedId: lifeEvent.id })}
                    >
                        Delete
                </Button>
            );
        } else if(lifeEvent.method === 'resource'){
            return 'This item can be deleted in Resource Events';
        }
        return(
            <div className="row">
                <Button 
                variant="info"
                onClick={() => this.setState({ showEdit: true, selectedId: lifeEvent.id })}
                >
                    Edit
                </Button>
                <Button
                variant="danger"
                onClick={() => this.setState({ showDelete: true, selectedId: lifeEvent.id })}
                >
                    Delete
                </Button>
            </div>
        );
    }

    renderStats = (lifeEvents) => {
        if(!this.state.showStats){
            return null;
        }
        var gained = 0;
        var lost = 0;
        var purchased = 0;
        var lifeRes = 0;
        var foodRes = 0;
        var waterRes = 0;
        var medicineRes = 0;
        var rouletteRes = 0;
        var combat = 0;
        var mutts = 0;
        var other = 0;
        for (let lifeEvent of lifeEvents) {
            if(lifeEvent.type === 'gained'){
                gained += 1;
            } else if (lifeEvent.type === 'lost'){
                lost += 1;
            }
            if(lifeEvent.method === 'purchased'){
                purchased += 1;
            } else if(lifeEvent.method === 'life_resource'){
                lifeRes += 1;
            } else if(lifeEvent.method === 'food_resource'){
                foodRes += 1;
            } else if(lifeEvent.method === 'water_resource'){
                waterRes += 1;
            } else if(lifeEvent.method === 'medicine_resource'){
                medicineRes += 1;
            } else if(lifeEvent.method === 'roulette_resource'){
                rouletteRes += 1;
            } else if(lifeEvent.method === 'combat'){
                combat += 1;
            } else if(lifeEvent.method === 'mutts'){
                mutts += 1;
            } else if(lifeEvent.method === 'other'){
                other += 1;
            }
        }
        return(
            <>
                <h5>Total Lives Gained: {gained} || Total Lives Lost: {lost}</h5>
                <h5>Lives Gained by...</h5>
                <h6>Purchases: {purchased} || Life Resources: {lifeRes} || Roulette Resources: {rouletteRes} </h6>
                <h5>Lives Lost To...</h5>
                <h6>
                    Hunger: {foodRes} || Thirst: {waterRes} || Injury: {medicineRes} |
                    | Combat: {combat} || Mutts: {mutts} || Other: {other}
                </h6>
            </>
        );
    }

    onSubmitCallback = async () => {
        if(this.state.showCreate){
            this.setState({ showCreate: false })
        } else if(this.state.showEdit){
            this.setState({ showEdit: false })
        } else if(this.state.showDelete){
            this.setState({ showDelete: false })
        }
        if(!this.state.queried){
            return;
        }
        if(this.state.searchTerm === ''){
            const response = await this.props.fetchAllLifeEvents();
            if(!response){
                this.setState({ apiError: true });
                return null;
            }
        } else {
            const response = await this.props.fetchLifeEvents(this.state.searchType, this.state.searchTerm);
            if(!response){
                this.setState({ apiError: true });
                return null;
            }
        }
    }

    renderModal(){
        if(this.state.showCreate) {
            return <LifeEventForm gameState={this.props.gameState} tributes={this.props.tributes} id={this.state.selectedId} mode="create" onSubmitCallback={this.onSubmitCallback}/>;
        } else if(this.state.showEdit) {
            return <LifeEventForm gameState={this.props.gameState} tributes={this.props.tributes} id={this.state.selectedId} mode="edit" onSubmitCallback={this.onSubmitCallback}/>;
        } else if(this.state.showDelete){
            return <DeleteLifeEvent id={this.state.selectedId}
            onSubmitCallback={this.onSubmitCallback} />
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
                    {this.renderSearchForm()}
                    {this.renderOptions()}
                    {this.renderLifeEvents()}
                    {this.renderModal()}
                </>
            );
        } else {
            return <h3>{this.state.auth.payload}</h3>;
        }
    }

    render(){
        return(
            <>
                <h3 style={{ padding: "10px" }}>Life Tracking</h3>
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
        tributes: Object.values(state.tributes),
        lifeEvents: Object.values(state.lifeEvents),
        gameState: state.gameState
    }
}

export default connect(mapStateToProps, 
    {
        setNavBar,
        fetchGameState,
        fetchTributes,
        fetchLifeEvent,
        fetchLifeEvents,
        fetchLifeEventsRange,
        fetchAllLifeEvents,
        deleteLifeEvent,
        clearLifeEventsList
    })(ManageFunds);