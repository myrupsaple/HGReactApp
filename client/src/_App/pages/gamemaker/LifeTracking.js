import React from 'react';
import { connect } from 'react-redux';
import { Form, Col, Button } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

import { setNavBar } from '../../../actions';
import { OAuthFail, NotSignedIn, NotAuthorized, Loading } from '../../components/AuthMessages';
import Wait from '../../../components/Wait';
import { 
    fetchTributes,
    fetchLifeEvent,
    fetchLifeEvents,
    fetchLifeEventsRange,
    fetchAllLifeEvents,
    deleteLifeEvent,
    clearLifeEventsList
} from '../../../actions';
import LifeEventForm from './life_components/LifeEventForm';
import DeleteModal from './shared_components/DeleteModal';

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
            searchType: 'Tribute Name',
            searchTerm: '',
            searchTermSecondary: '',
            timeFormatted: '',
            timeFormattedSecondary: '',
            filterEventType: 'all',
            showDetails: true,
            showPairedCombat: false,
            showCreate: false, 
            showEdit: false,
            showDelete: false,
            // Neded to access individual life event data
            selectedId: null
        };
        this.handleSearchType = this.handleSearchType.bind(this);
        this.handleSearchTerm = this.handleSearchTerm.bind(this);
        this.handleSearchTermSecondary = this.handleSearchTermSecondary.bind(this);
        this.handleFilterEventType = this.handleFilterEventType.bind(this);
        this.handleShowDetails = this.handleShowDetails.bind(this);
        this.handlePairedCombat = this.handlePairedCombat.bind(this);
        this.handleSearchSubmit = this.handleSearchSubmit.bind(this);
    }

    checkAuth = async () => {
        // SET ALLOWED ACCESS GROUPS HERE
        const allowedGroups = ['owner', 'admin', 'gamemaker'];
        var timeoutCounter = 0;
        while(!this.props.authLoaded){
            await Wait(500);
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
        await this.props.fetchTributes();
    }

    handleSearchType(event) {
        this.setState({ 
            searchType: event.target.value,
            searchTerm: '',
            searchTermSecondary: ''
        });
    }
    handleSearchTerm(event) {
        if(this.state.searchType === 'Time Range'){
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
        if(this.state.searchType === 'Time Range'){
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
        const button = event.target.id;
        if(button === 'radio-show-all'){
            this.setState({ filterEventType: 'all' });    
        } else if(button === 'radio-show-gained'){
            this.setState({ filterEventType: 'gained' });    
        } else if(button === 'radio-show-lost'){
            this.setState({ filterEventType: 'lost' });    
        } 
    }
    handlePairedCombat(event){
        this.setState({ showPairedCombat: event.target.checked });
    }
    handleShowDetails(event){
        this.setState({ showDetails: event.target.checked });
    }
    
    async handleSearchSubmit(event){
        if(this._isMounted){
            this.setState({ queried: true });
        }
        event.preventDefault();

        await this.props.clearLifeEventsList();

        const searchType = this.formatSearchType(this.state.searchType);
        const searchTerm = this.formatSearchTerm(this.state.searchTerm);
        const searchTermSecondary = this.formatSearchTerm(this.state.searchTermSecondary);

        if(searchType === 'tribute_email'){
            const matches = [];
            const name = this.state.searchTerm.toLowerCase();
            this.props.tributes.map(tribute => {
                if(tribute.first_name.toLowerCase().includes(name)){
                    matches.push(tribute.email);
                }
                return null;
            });
            matches.map(match => {
                this.props.fetchLifeEvents(searchType, match);
                return null;
            })

        } else if(searchType === 'method'){
            if(searchTerm === 'purchase' || searchTerm === 'combat'){
                this.props.fetchLifeEvents(searchType, searchTerm);
            } else if(searchTerm === 'mutts'){
                this.props.fetchLifeEvents('method', 'mutts')
            } else if(searchTermSecondary === 'all'){
                const resources = ['life', 'food', 'water', 'medicine'];
                for (let resource of resources){
                    this.props.fetchLifeEvents('method', resource);
                }
            } else {
                this.props.fetchLifeEvents(searchType, searchTermSecondary);
            }
        } else if(searchType === 'time'){
            if(searchTermSecondary === ''){
                this.props.fetchLifeEvents(searchType, searchTerm);
            } else {
                this.props.fetchLifeEventsRange(searchType, searchTerm, searchTermSecondary);
            }
        }
    }

    formatSearchType(type){
        switch(type){
            case 'Tribute Name':
                return 'tribute_email';
            case 'Method':
                return 'method';
            case 'Time Range':
                return 'time';
            default:
                return type;
        }
    }

    formatSearchTerm(method){
        switch(method){
            case 'Purchased':
                return 'purchased';
            case 'Resource':
                return 'resource';
            case 'Combat':
                return 'combat';
            case 'Mutts':
                return 'mutts';
            case 'Show All':
                return 'all';
            case 'Life (gained)':
                return 'life_resource';
            case 'Food (lost)':
                return 'food_resource';
            case 'Water (lost)':
                return 'water_resource';
            case 'Medicine (lost)':
                return 'medicine_resource';
            case  'Roulette':
                return 'roulette_resource';
            case 'Other':
                return 'other';
            default:
                return method;
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
        return string.slice(0, 1).toUpperCase() + string.slice(1, string.length).toLowerCase();
    }

    renderSearchForm = () => {
        return(
            <>
            <Form onSubmit={this.handleSearchSubmit}>
                <Form.Label>Search For Lives Gained/Lost:</Form.Label>
                <Form.Row>
                    <Col>
                    <Form.Group controlId="searchBy">
                        <Form.Control as="select"
                            value={this.state.searchType}
                            onChange={this.handleSearchType}
                        >
                            <option>Tribute Name</option>
                            <option>Method</option>
                            <option>Time Range</option>
                        </Form.Control>
                    </Form.Group>
                    </Col>
                    <Col>
                        {this.renderSearchField()}
                    </Col>
                </Form.Row>
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
                                id="radio-show-all"
                                onChange={this.handleFilterEventType}
                            />
                            <Form.Check
                                type="radio"
                                name="filter-event-radios"
                                label="Gained"
                                id="radio-show-gained"
                                onChange={this.handleFilterEventType}
                            />
                            <Form.Check
                                type="radio"
                                name="filter-event-radios"
                                label="Lost"
                                id="radio-show-lost"
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
                                value={this.state.showDetails}
                                onChange={this.handleShowDetails}
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

    searchForAllLifeEvents = () => {
        this.setState({ searchTerm: '', searchTermSecondary: '', queried: true});
        this.props.fetchAllLifeEvents();
    }

    renderSearchField = () => {
        if(Object.keys(this.props.tributes).length === 0){
            return 'Loading...';
        }
        if(this.state.searchType === 'Tribute Name'){
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
        } else if(this.state.searchType === 'Method'){
            return(
                <>
                <Form.Group controlId="query">
                    <Form.Control required
                        as="select"
                        value={this.state.searchTerm}
                        onChange={this.handleSearchTerm}
                    >
                        <option>Purchased</option>
                        <option>Resource</option>
                        <option>Combat</option>
                        <option>Mutts</option>
                        <option>Other</option>
                    </Form.Control>
                </Form.Group>
                {this.renderEventTypeSecondary()}
                </>
            );
        } else if(this.state.searchType === 'Time Range'){
            return(
                <>
                <Form.Group controlId="query">
                    <div><Form.Label>From (Start Time)</Form.Label></div>
                    <DatePicker 
                        showTimeSelect
                        showTimeSelectOnly
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
        if(this.state.searchTerm === 'Resource'){
            return(
                <Form.Group controlId="query-secondary">
                    <Form.Control
                        as="select"
                        value={this.state.searchTermSecondary}
                        onChange={this.handleSearchTermSecondary}
                    >
                        <option>Show All</option>
                        <option>Life (gained)</option>
                        <option>Food (lost)</option>
                        <option>Water (lost)</option>
                        <option>Medicine (lost)</option>
                        <option>Roulette</option>
                    </Form.Control>
                </Form.Group>
            )
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
        return(
            <>
            <ul className="list-group">
            {this.renderDetails(lifeEvents)}

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

    renderDetails = (lifeEvents) => {
        if(!this.state.showDetails){
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

    onSubmitCallback = () => {
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
            this.props.fetchAllLifeEvents();
        } else {
            this.props.fetchLifeEvents(this.formatSearchType(this.state.searchType), this.state.searchTerm);
        }
    }

    renderModal(){
        if(this.state.showCreate) {
            return <LifeEventForm tributes={this.props.tributes} id={this.state.selectedId} mode="create" onSubmitCallback={this.onSubmitCallback}/>;
        } else if(this.state.showEdit) {
            return <LifeEventForm tributes={this.props.tributes} id={this.state.selectedId} mode="edit" onSubmitCallback={this.onSubmitCallback}/>;
        } else if(this.state.showDelete){
            return <DeleteModal id={this.state.selectedId} actionType="Life Event" 
            onConfirm={this.props.deleteLifeEvent}
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
                    {this.renderLifeEvents()}
                    {this.renderModal()}
                </>
            );
        } else {
            return <h3>{this.state.auth.payload}</h3>;
        }
    }

    render = () => {
        console.log(this.state);
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
        tributes: Object.values(state.tributes),
        lifeEvents: Object.values(state.lifeEvents)
    }
}

export default connect(mapStateToProps, 
    {
        setNavBar,
        fetchTributes,
        fetchLifeEvent,
        fetchLifeEvents,
        fetchLifeEventsRange,
        fetchAllLifeEvents,
        deleteLifeEvent,
        clearLifeEventsList
    })(ManageFunds);