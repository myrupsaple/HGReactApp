import React from 'react';
import { connect } from 'react-redux';
import { Form, Col, Button } from 'react-bootstrap';
import DatePicker from 'react-datepicker';

import { setNavBar } from '../../../actions';
import { OAuthFail, NotSignedIn, NotAuthorized, Loading } from '../../components/AuthMessages';
import Wait from '../../../components/Wait';
import { 
    fetchTributes,
    fetchResourceEvent,
    fetchResourceEvents,
    fetchResourceEventsRange,
    fetchAllResourceEvents,
    deleteResourceEvent,
    clearResourceEvents
} from '../../../actions';
import ResourceEventForm from './resource_components/ResourceEventForm';
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
            filterByType: 'all',
            filterByMethod: 'all',
            showDetails: true,
            showPairedCombat: false,
            showCreate: false, 
            showEdit: false,
            showDelete: false,
            // Neded to access individual resource event data
            selectedId: null
        };
        this.handleSearchType = this.handleSearchType.bind(this);
        this.handleSearchTerm = this.handleSearchTerm.bind(this);
        this.handleSearchTermSecondary = this.handleSearchTermSecondary.bind(this);
        this.handleFilterEventType = this.handleFilterEventType.bind(this);
        this.handleShowDetails = this.handleShowDetails.bind(this);
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
            this.setState({ filterByType: 'all' });    
        } else if(button === 'radio-show-food'){
            this.setState({ filterByType: 'food'});
        } else if(button === 'radio-show-water'){
            this.setState({ filterByType: 'water' });    
        } else if(button === 'radio-show-medicine'){
            this.setState({ filterByType: 'medicine' });    
        } else if(button === 'radio-show-roulette'){
            this.setState({ filterByType: 'roulette'});
        } else if(button === 'radio-show-life'){
            this.setState({ filterByType: 'life' });    
        } else if(button === 'radio-show-golden'){
            this.setState({ filterByType: 'golden' });    
        }
    }
    handleFilterUsageMethod(event){
        const button = event.target.id;
        if(button === 'radio-show-all'){
            this.setState({ filterByMethod: 'all' });    
        } else if(button === 'radio-show-code'){
            this.setState({ filterByMethod: 'code'});
        } else if(button === 'radio-show-purchased'){
            this.setState({ filterByMethod: 'purchased' });    
        } else if(button === 'radio-show-other'){
            this.setState({ filterByMethod: 'other' });    
        }
    }
    handleShowDetails(event){
        this.setState({ showDetails: event.target.checked });
    }
    
    async handleSearchSubmit(event){
        if(this._isMounted){
            this.setState({ queried: true });
        }
        event.preventDefault();

        await this.props.clearResourceEvents();

        const searchType = this.formatSearchType(this.state.searchType);
        const searchTerm = this.state.searchTerm;
        const searchTermSecondary = this.state.searchTermSecondary;

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
                this.props.fetchResourceEvents(searchType, match);
                return null;
            })

        } else if(searchType === 'time'){
            if(searchTermSecondary === ''){
                this.props.fetchResourceEvents(searchType, searchTerm);
            } else {
                this.props.fetchResourceEventsRange(searchType, searchTerm, searchTermSecondary);
            }
        } else if(searchType === 'notes'){
            this.props.fetchResourceEvents(searchType, searchTerm);
        }
    }

    formatSearchType(type){
        switch(type){
            case 'Tribute Name':
                return 'tribute_email';
            case 'Time Range':
                return 'time';
            case 'Notes':
                return 'notes';
            default:
                return null;
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
                <Form.Label>Search For Resource Events:</Form.Label>
                <Form.Row>
                    <Col>
                    <Form.Group controlId="searchBy">
                        <Form.Control as="select"
                            value={this.state.searchType}
                            onChange={this.handleSearchType}
                        >
                            <option>Tribute Name</option>
                            <option>Time Range</option>
                            <option>Notes</option>
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
                    <Button className="coolor-bg-blue-darken-2" onClick={this.searchForAllResourceEvents}>Show All Events</Button>
                    </Col>
                    <Col>
                    <Button className="coolor-bg-blue-lighten-2" type="submit">Search</Button>
                    </Col>
                </Form.Row>
            </Form>
            </>
        )
    }

    renderOptions(){
        return(
            <Form.Row>
                <div className="col-">
                    <Form.Label>Show:</Form.Label>
                </div>
                <div className="col-">
                    <Form.Group controlId="filter-by-method">
                        <Form.Check
                            defaultChecked
                            type="radio"
                            name="filter-by-method"
                            label="All"
                            id="radio-show-all"
                            onChange={this.handleFilterItemUses}
                        />
                        <Form.Check
                            type="radio"
                            name="filter-by-method"
                            label="Code"
                            id="radio-show-code"
                            onChange={this.handleFilterItemUses}
                        />
                        <Form.Check
                            type="radio"
                            name="filter-by-method"
                            label="Purchased"
                            id="radio-show-purchased"
                            onChange={this.handleFilterItemUses}
                        />
                        <Form.Check
                            type="radio"
                            name="filter-by-uses"
                            label="Other"
                            id="radio-show-other"
                            onChange={this.handleFilterItemUses}
                        />
                    </Form.Group>
                </div>
                <div className="col-">
                    <Form.Group controlId="filter-by-type">
                        <Form.Check
                            defaultChecked
                            type="radio"
                            name="filter-by-type"
                            label="All"
                            id="radio-show-all"
                            onChange={this.handleFilterItemType}
                        />
                        <Form.Check
                            type="radio"
                            name="filter-by-type"
                            label="Food"
                            id="radio-show-food"
                            onChange={this.handleFilterItemType}
                        />
                        <Form.Check
                            type="radio"
                            name="filter-by-type"
                            label="Water"
                            id="radio-show-water"
                            onChange={this.handleFilterItemType}
                        />
                        <Form.Check
                            type="radio"
                            name="filter-by-type"
                            label="Medicine"
                            id="radio-show-medicine"
                            onChange={this.handleFilterItemType}
                        />
                        <Form.Check
                            type="radio"
                            name="filter-by-type"
                            label="Roulette"
                            id="radio-show-roulette"
                            onChange={this.handleFilterItemType}
                        />
                        <Form.Check
                            type="radio"
                            name="filter-by-type"
                            label="Life"
                            id="radio-show-life"
                            onChange={this.handleFilterItemType}
                        />
                        <Form.Check
                            type="radio"
                            name="filter-by-type"
                            label="Golden"
                            id="radio-show-golden"
                            onChange={this.handleFilterItemType}
                        />
                    </Form.Group>
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
                </div>
            </Form.Row>
        );
    }

    searchForAllResourceEvents = () => {
        this.setState({ searchTerm: '', searchTermSecondary: '', queried: true});
        this.props.fetchAllResourceEvents();
    }

    renderSearchField = () => {
        if(Object.keys(this.props.tributes).length === 0){
            return 'Loading...';
        }
        if(this.state.searchType === 'Tribute Name' || this.state.searchType === 'Notes'){
            return(
                <Form.Group controlId="query">
                    <Form.Control required 
                        value={this.state.searchTerm}
                        autoComplete="off"
                        placeholder="Enter search term..."
                        onChange={this.handleSearchTerm}
                    />
                </Form.Group>
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

    renderTableHeader(){
        return(
            <h4 className="row">
                <div className="col">Tribute Name</div>
                <div className="col">Resource Type</div>
                <div className="col">Method of Use</div>
                <div className="col">Time</div>
                <div className="col">Notes</div>
                <div className="col">Modify</div>
            </h4>
        );
    }

    renderResourceEvents(){
        if(Object.keys(this.props.resourceEvents).length === 0){
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

        var resourceEvents = this.props.resourceEvents;
        const eventTypeFilter = this.state.filterByType;
        if(eventTypeFilter !== 'all'){
            resourceEvents = resourceEvents.filter(resource => resource.type === eventTypeFilter);
        }

        const eventMethodFilter = this.state.filterByMethod;
        if(eventMethodFilter === 'code'){
            resourceEvents = resourceEvents.filter(resourceEvent => resourceEvent.method === 'code');
        } else if(eventTypeFilter === 'purchased') {
            resourceEvents = resourceEvents.filter(resourceEvent => resourceEvent.method === 'purchased');
        } else if(eventTypeFilter === 'other') {
            resourceEvents = resourceEvents.filter(resourceEvent => resourceEvent.method === 'other');
        }

        return(
            <>
            <ul className="list-group">
            {this.renderDetails(resourceEvents)}

            {this.renderTableHeader()}
            {resourceEvents.map(resourceEvent => {
                return(
                    <li className="list-group-item" key={resourceEvent.id}>
                        <div className="row">
                            <div className="col">{this.getTributeName(resourceEvent.tribute_email)}</div>
                            <div className="col">{this.capitalizeFirst(resourceEvent.type)}</div>
                            <div className="col">{this.capitalizeFirst(resourceEvent.method)}</div>
                            <div className="col">{this.formatTimeFromInt(resourceEvent.time)}</div>
                            <div className="col">{resourceEvent.notes}</div>
                            <div className="col">{this.renderAdmin(resourceEvent)}</div>
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

    renderAdmin = (resourceEvent) => {
        return(
            <div className="row">
                <Button 
                variant="info"
                onClick={() => this.setState({ showEdit: true, selectedId: resourceEvent.id })}
                >
                    Edit
                </Button>
                <Button
                variant="danger"
                onClick={() => this.setState({ showDelete: true, selectedId: resourceEvent.id })}
                >
                    Delete
                </Button>
            </div>
        );
    }

    renderDetails = (resourceEvents) => {
        if(!this.state.showDetails){
            return null;
        }
        var code = 0;
        var nonCode = 0;
        var food = 0;
        var water = 0;
        var medicine = 0;
        var roulette = 0;
        var life = 0;
        var golden = 0;
        var foodCode = 0;
        var waterCode = 0;
        var medicineCode = 0;
        var rouletteCode = 0;
        var lifeCode = 0;
        var goldenCode = 0;
        for (let event of resourceEvents) {
            if(event.type === food){
                food += 1;
                if(event.method === 'code'){
                    foodCode += 1;
                    code += 1;
                } else {
                    nonCode += 1;
                }
            } else if(event.type === water){
                water += 1;
                if(event.method === 'code'){
                    waterCode += 1;
                    code += 1;
                }
            } else if(event.type === medicine){
                medicine += 1;
                if(event.method === 'code'){
                    medicineCode += 1;
                    code += 1;
                } else {
                    nonCode += 1;
                }
            } else if(event.type === roulette){
                roulette += 1;
                if(event.method === 'code'){
                    rouletteCode += 1;
                    code += 1;
                } else {
                    nonCode += 1;
                }
            } else if(event.type === life){
                life += 1;
                if(event.method === 'code'){
                    lifeCode += 1;
                    code += 1;
                } else {
                    nonCode += 1;
                }
            } else if(event.type === golden){
                golden += 1;
                if(event.method === 'code'){
                    goldenCode += 1;
                    code += 1;
                } else {
                    nonCode += 1;
                }
            } 
        }
        return(
            <>
                <h5>Total by Method:</h5>
                <h6>Code: {code} || Non-Code: {nonCode}</h6>
                <h5>Total Codes Used:</h5>
                <h6> Food: {food} || Water: {water} || Medicine: {medicine} || Roulette: {roulette} || Life: {life} || Golden: {golden} ||</h6>
                <h5>Total Non-Code Events:</h5>
                <h6> Food: {foodCode} || Water: {waterCode} || Medicine: {medicineCode} || Roulette: {rouletteCode} || Life: {lifeCode} || Golden: {goldenCode} ||</h6>
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
            this.props.fetchAllResourceEvents();
        } else {
            this.props.fetchResourceEvents(this.formatSearchType(this.state.searchType), this.state.searchTerm);
        }
    }

    renderModal(){
        if(this.state.showCreate) {
            return <ResourceEventForm tributes={this.props.tributes} id={this.state.selectedId} mode="create" onSubmitCallback={this.onSubmitCallback}/>;
        } else if(this.state.showEdit) {
            return <ResourceEventForm tributes={this.props.tributes} id={this.state.selectedId} mode="edit" onSubmitCallback={this.onSubmitCallback}/>;
        } else if(this.state.showDelete){
            return <DeleteModal id={this.state.selectedId} actionType="Resource Event" 
            onConfirm={this.props.deleteResourceEvent}
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
                    {this.renderResourceEvents()}
                    {this.renderModal()}
                </>
            );
        } else {
            return <h3>{this.state.auth.payload}</h3>;
        }
    }

    render = () => {
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
        resourceEvents: Object.values(state.resourceEvents)
    }
}

export default connect(mapStateToProps, 
    {
        setNavBar,
        fetchTributes,
        fetchResourceEvent,
        fetchResourceEvents,
        fetchResourceEventsRange,
        fetchAllResourceEvents,
        deleteResourceEvent,
        clearResourceEvents
    })(ManageFunds);