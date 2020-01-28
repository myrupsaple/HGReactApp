import React from 'react';
import { connect } from 'react-redux';
import { Form, Button, Col } from 'react-bootstrap';

import { setNavBar } from '../../../actions';
import { OAuthFail, NotSignedIn, NotAuthorized, Loading } from '../../components/AuthMessages';
import Wait from '../../../components/Wait';
import {
    fetchItems,
    fetchAllItems,
    deleteItem
} from '../../../actions';
import ItemForm from './item_components/ItemForm';
import DeleteModal from './shared_components/DeleteModal';

class ManageItems extends React.Component {
    _isMounted = false;

    constructor(props){
        super(props);
        this.state = {
            auth: {
                loading: true,
                payload: null
            },
            queried: false,
            searchTerm: '',
            showCreate: false,
            showEdit: false,
            showDelete: false,
            showPurhcase: false,
            selectedId: null
        };

        this.handleSearchTerm = this.handleSearchTerm.bind(this);
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
    }

    handleSearchTerm(event) {
        this.setState({ searchTerm: event.target.value })
    }
    handleSearchSubmit(event) {
        event.preventDefault();

        this.setState({ queried: true });
        this.props.fetchItems(this.state.serachTerm);
    }

    renderItems(){
        if(Object.keys(this.props.items).length === 0){
            // Return different message before and after first search is sent
            if(!this.state.queried) {
                return(
                    <h5>
                        Search the database of items
                    </h5>
                );
            }
            return(
                <>
                    <h5>No items were found :(</h5>
                </>
            );
        }
        return(
            <>
            <h3>Items found:</h3>
            <ul className="list-group">
                {this.renderTableHeader()}
                {this.props.items.map(item => {
                    return(
                        <li className="list-group-item" key={item.id}>
                            <div className="row">
                                <div className="col">{item.item_name}</div>
                                <div className="col">{item.description}</div>
                                <div className="col">{item.quantity}</div>
                                <div className="col">{item.tier1_cost}</div>
                                <div className="col">{this.renderAdmin(item)}</div>
                            </div>
                        </li>
                    );
                })}
            </ul>
            </>
        );
    }

    renderTableHeader(){
        return(
            <h5 className="row">
                <div className="col">Item Name</div>
                <div className="col">Item Description</div>
                <div className="col">Quantity</div>
                <div className="col">Tier 1 Cost</div>
                <div className="col">Actions</div>
            </h5>
        )
    }

    renderAdmin = (item) => {
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

    renderSearchForm() {
        return(
            <>
            <Form onSubmit={this.handleSearchSubmit}>
                <Form.Label>Search For Items: </Form.Label>
                <Form.Row>
                    <Col>
                        <Form.Group controlId="query">
                            <Form.Control placeholder="Search for an item by name..." 
                                required
                                autoComplete="off"  
                                value={this.state.searchTerm} 
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
                            Create Item
                        </Button>
                    </Col>
                    <Col>
                        <Button className="coolor-bg-blue-darken-2" onClick={this.fetchAllItems}>Show All Items</Button>
                    </Col>
                    <Col>
                        <Button className="coolor-bg-blue-lighten-2" type="submit">Search</Button>
                    </Col>
                </Form.Row>
            </Form>
            </>
        )
    }

    fetchAllItems = () => {
        this.setState({ searchTerm: '' , queried: true });
        this.props.fetchAllItems()
    }

    renderModal = () => {
        if(this.state.showCreate){
            return(
                <ItemForm onSubmitCallback={this.onSubmitCallback} mode='create'/>
            );
        } else if(this.state.showEdit){
            return(
                <ItemForm email={this.state.selectedEmail} id={this.state.selectedId} onSubmitCallback={this.onSubmitCallback} mode='edit'/>
            );
        } else if(this.state.showDelete){
            return(
                <DeleteModal id={this.state.selectedId} actionType="Item" 
            onConfirm={this.props.deleteItem}
            onSubmitCallback={this.onSubmitCallback} />
            );
        } else {
            return null;
        }
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
            this.props.fetchAllItems();
        } else {
            this.props.fetchItems(this.state.searchTerm);
        }
    };

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
                    {this.renderItems()}
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
        items: Object.values(state.items)
    }
}

export default connect(mapStateToProps, 
    { 
        setNavBar,
        fetchItems,
        fetchAllItems,
        deleteItem
    })(ManageItems);