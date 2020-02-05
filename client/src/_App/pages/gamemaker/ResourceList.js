import React from 'react';
import { connect } from 'react-redux';
import { Form, Col, Button } from 'react-bootstrap';

import { setNavBar } from '../../../actions';
import { OAuthFail, NotSignedIn, NotAuthorized, Loading } from '../../components/AuthMessages';
import Wait from '../../../components/Wait';
import {
    fetchTributes,
    fetchResourceListItems,
    fetchResourceListItemRange,
    fetchAllResourceListItems,
    deleteResourceListItem,
    clearResourceList
} from '../../../actions';
import ResourceListForm from './resource_components/ResourceListForm';
import DeleteModal from './shared_components/DeleteModal';

class ResourceList extends React.Component {
    _isMounted = false;
    constructor(props){
        super(props)
        this.state = {
            auth: {
                loading: true,
                payload: null
            },
            queried: false,
            searchType: 'code',
            searchTerm: '',
            filterByUses: 'all',
            filterByType: 'all',
            showDetails: true,
            showCreate: false, 
            showEdit: false,
            showDelete: false,
            // Neded to access individual resource list item data
            selectedId: null
        };

        this.handleSearchType = this.handleSearchType.bind(this);
        this.handleSearchTerm = this.handleSearchTerm.bind(this);
        this.handleShowDetails = this.handleShowDetails.bind(this);
        this.handleFilterItemUses = this.handleFilterItemUses.bind(this);
        this.handleFilterItemType = this.handleFilterItemType.bind(this);
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
        this.setState({ searchTerm: event.target.value });
    }
    handleFilterItemUses(event){
        this.setState({ filterByUses: event.target.id });
    }
    handleFilterItemType(event){
        this.setState({ filterByType: event.target.id });
    }
    handleShowDetails(event){
        this.setState({ showDetails: event.target.checked });
    }

    async handleSearchSubmit(event){
        if(this._isMounted){
            this.setState({ queried: true });
        }
        event.preventDefault();

        await this.props.clearResourceList();

        const searchType = this.state.searchType;
        const searchTerm = this.state.searchTerm.toLowerCase();

        this.props.fetchResourceListItems(searchType, searchTerm.toLowerCase());
    }

    renderSearchForm = () =>{
        return(
            <>
            <Form onSubmit={this.handleSearchSubmit}>
                <Form.Label>Search For Resource Items:</Form.Label>
                <Form.Row>
                    <Col>
                    <Form.Group controlId="searchBy">
                        <Form.Control as="select"
                            value={this.state.searchType}
                            onChange={this.handleSearchType}
                        >
                            <option value="code">Resource Code</option>
                            <option value="notes">Notes</option>
                        </Form.Control>
                    </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group controlId="query">
                            <Form.Control required 
                                value={this.state.searchTerm}
                                autoComplete="off"
                                placeholder="Enter search term..."
                                onChange={this.handleSearchTerm}
                            />
                        </Form.Group>
                    </Col>
                </Form.Row>
                <Form.Row>
                    <Col>
                    <Button
                        variant="secondary"
                        className="coolor-bg-purple-lighten-2"
                        onClick={() => this.setState({ showCreate: true })}
                    >
                        Add New Resource Item
                    </Button>
                    </Col>
                    <Col>
                    <Button className="coolor-bg-blue-darken-2" onClick={this.searchForAllResourceItems}>Show All Items</Button>
                    </Col>
                    <Col>
                    <Button className="coolor-bg-blue-lighten-2" type="submit">Search</Button>
                    </Col>
                </Form.Row>
            </Form>
            </>
        );
    }

    renderOptions(){
        return(
            <Form.Row>
                <div className="col-">
                    <Form.Label>Show:</Form.Label>
                </div>
                <div className="col-">
                    <Form.Group controlId="filter-by-uses">
                        <Form.Check
                            defaultChecked
                            type="radio"
                            name="filter-by-uses"
                            label="All"
                            id="all"
                            onChange={this.handleFilterItemUses}
                        />
                        <Form.Check
                            type="radio"
                            name="filter-by-uses"
                            label="Unused"
                            id="unused"
                            onChange={this.handleFilterItemUses}
                        />
                        <Form.Check
                            type="radio"
                            name="filter-by-uses"
                            label="Used At Least Once"
                            id="used"
                            onChange={this.handleFilterItemUses}
                        />
                        <Form.Check
                            type="radio"
                            name="filter-by-uses"
                            label="No Uses Left"
                            id="no-uses-left"
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
                            id="all"
                            onChange={this.handleFilterItemType}
                        />
                        <Form.Check
                            type="radio"
                            name="filter-by-type"
                            label="Food"
                            id="food"
                            onChange={this.handleFilterItemType}
                        />
                        <Form.Check
                            type="radio"
                            name="filter-by-type"
                            label="Water"
                            id="water"
                            onChange={this.handleFilterItemType}
                        />
                        <Form.Check
                            type="radio"
                            name="filter-by-type"
                            label="Medicine"
                            id="medicine"
                            onChange={this.handleFilterItemType}
                        />
                        <Form.Check
                            type="radio"
                            name="filter-by-type"
                            label="Roulette"
                            id="roulette"
                            onChange={this.handleFilterItemType}
                        />
                        <Form.Check
                            type="radio"
                            name="filter-by-type"
                            label="Life"
                            id="life"
                            onChange={this.handleFilterItemType}
                        />
                        <Form.Check
                            type="radio"
                            name="filter-by-type"
                            label="Golden"
                            id="golden"
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

    searchForAllResourceItems = () => {
        this.setState({ searchTerm: '', queried: true});
        this.props.fetchAllResourceListItems();
    }

    renderTableHeader(){
        return(
            <h4 className="row">
                <div className="col">Resource Code</div>
                <div className="col">Resource Type</div>
                <div className="col">Times Used</div>
                <div className="col">Uses Remaining</div>
                <div className="col">Notes</div>
                <div className="col">Modify</div>
            </h4>
        );
    }

    renderResourceList(){
        if(Object.keys(this.props.resourceList).length === 0){
            // Return different message before and after first search is sent
            if(!this.state.queried) {
                return(
                    <h5>
                        Search the database of resource codes
                    </h5>
                );
            }
            return(
                <>
                    <h5>No events were found :(</h5>
                </>
            );
        }

        const numberUsesFilter = this.state.filterByUses;
        var resourceList = this.props.resourceList;
        if(numberUsesFilter === 'unused'){
            resourceList = resourceList.filter(resource => resource.times_used === 0);
        } else if(numberUsesFilter === 'used'){
            resourceList = resourceList.filter(resource => resource.times_used !== 0);
        } else if(numberUsesFilter === 'noUses') {
            resourceList = resourceList.filter(resource => resource.times_used === resource.max_uses);
        }
        const filterType = this.state.filterByType;
        if(filterType !== 'all'){
            resourceList = resourceList.filter(resource => resource.type === filterType);
        }

        resourceList.sort((a, b) => {
            if(a.code > b.code){
                return 1;
            } else if(a.code < b.code){
                return -1;
            } else {
                return 0;
            }
        });

        return(
            <>
            <ul className="list-group">
            {this.renderDetails(resourceList)}

            {this.renderTableHeader()}
            {resourceList.map(resource => {
                return(
                    <li className="list-group-item" key={resource.code}>
                        <div className="row">
                            <div className="col">{resource.code}</div>
                            <div className="col">{this.capitalizeFirst(resource.type)}</div>
                            <div className="col">{resource.times_used}</div>
                            <div className="col">{resource.max_uses - resource.times_used}</div>
                            <div className="col">{resource.notes}</div>
                            <div className="col">{this.renderAdmin(resource)}</div>
                        </div>
                    </li>
                );
            })}
            </ul>
            </>
        );
    }

    capitalizeFirst(string){
        return string.slice(0, 1).toUpperCase() + string.slice(1, string.length);
    }

    renderAdmin = (resource) => {
        return(
            <div className="row">
                <Button 
                variant="info"
                onClick={() => this.setState({ showEdit: true, selectedId: resource.id })}
                >
                    Edit
                </Button>
                <Button
                variant="danger"
                onClick={() => this.setState({ showDelete: true, selectedId: resource.id })}
                >
                    Delete
                </Button>
            </div>
        );
    }

    renderDetails = (resourceList) => {
        if(!this.state.showDetails){
            return null;
        }
        var food = 0;
        var water = 0;
        var medicine = 0;
        var roulette = 0;
        var life = 0;
        var golden = 0;
        var foodUsed = 0;
        var waterUsed = 0;
        var medicineUsed = 0;
        var rouletteUsed = 0;
        var lifeUsed = 0;
        var goldenUsed = 0;
        var foodNotUsed = 0;
        var waterNotUsed = 0;
        var medicineNotUsed = 0;
        var rouletteNotUsed = 0;
        var lifeNotUsed = 0;
        var goldenNotUsed = 0;

        for (let resource of resourceList) {
            if(resource.type === 'food'){
                food += 1;
                foodUsed += resource.times_used;
                foodNotUsed = foodNotUsed + resource.max_uses - resource.times_used;
            } else if(resource.type === 'water'){
                water += 1;
                waterUsed += resource.times_used;
                waterNotUsed = waterNotUsed + resource.max_uses - resource.times_used;
            } else if(resource.type === 'medicine'){
                medicine += 1;
                medicineUsed += resource.times_used;
                medicineNotUsed = medicineNotUsed + resource.max_uses - resource.times_used;
            } else if(resource.type === 'roulette'){
                roulette += 1;
                rouletteUsed += resource.times_used;
                rouletteNotUsed = rouletteNotUsed + resource.max_uses - resource.times_used;
            } else if(resource.type === 'life'){
                life += 1;
                lifeUsed += resource.times_used;
                lifeNotUsed = lifeNotUsed + resource.max_uses - resource.times_used;
            } else if(resource.type === 'golden'){
                golden += 1;
                goldenUsed += resource.times_used;
                goldenNotUsed = goldenNotUsed + resource.max_uses - resource.times_used;
            }
        }
        return(
            <>
                <h5>Total Codes:</h5>
                <h6> Food: {food} || Water: {water} || Medicine: {medicine} || Roulette: {roulette} || Life: {life} || Golden: {golden} ||</h6>
                <h5>Times Used:</h5>
                <h6> Food: {foodUsed} || Water: {waterUsed} || Medicine: {medicineUsed} || Roulette: {rouletteUsed} || Life: {lifeUsed} || Golden: {goldenUsed} ||</h6>
                <h5>Uses Remaining:</h5>
                <h6> Food: {foodNotUsed} || Water: {waterNotUsed} || Medicine: {medicineNotUsed} || Roulette: {rouletteNotUsed} || Life: {lifeNotUsed} || Golden: {goldenNotUsed} ||</h6>
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
            this.props.fetchAllResourceListItems();
        } else {
            this.props.fetchResourceListItems(this.state.searchType, this.state.searchTerm);
        }
    }

    renderModal(){
        if(this.state.showCreate) {
            return <ResourceListForm tributes={this.props.tributes} id={this.state.selectedId} mode="create" onSubmitCallback={this.onSubmitCallback}/>;
        } else if(this.state.showEdit) {
            return <ResourceListForm tributes={this.props.tributes} id={this.state.selectedId} mode="edit" onSubmitCallback={this.onSubmitCallback}/>;
        } else if(this.state.showDelete){
            return <DeleteModal id={this.state.selectedId} actionType="Resource List Item" 
            onConfirm={this.props.deleteResourceListItem}
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
                    {this.renderResourceList()}
                    {this.renderModal()}
                </>
            );
        } else {
            return (<h3>{this.state.auth.payload}</h3>);
        }
    }

    render = () =>{
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
        resourceList: Object.values(state.resourceList)
    }
}

export default connect(mapStateToProps, 
    { 
        setNavBar,
        fetchTributes,
        fetchResourceListItems,
        fetchResourceListItemRange,
        fetchAllResourceListItems,
        deleteResourceListItem,
        clearResourceList
    })(ResourceList);