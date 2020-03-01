import React from 'react';
import { connect } from 'react-redux';
import { Button, Col, Form } from 'react-bootstrap';

import { setNavBar } from '../../../actions';
import { OAuthFail, NotSignedIn, NotAuthorized, Loading } from '../../components/AuthMessages';
import Wait from '../../../components/Wait';
import { 
    fetchTributes,
    fetchMentors,
    fetchPurchaseRequests,
    fetchAllPurchaseRequests,
    deletePurchaseRequest,
    clearPurchasesList,
    fetchGameState
} from '../../../actions';
import ViewDetails from './purchase_components/ViewDetails';
import PurchaseForm from './purchase_components/PurchaseForm';
import ApprovalForm from './purchase_components/ApprovalForm';
import DeleteRequest from './purchase_components/DeleteRequest';


class PurchaseRequests extends React.Component {
    _isMounted = false;
    constructor(props){
        super(props)
        this.state = {
            auth: {
                loading: true,
                payload: null
            },
            displayMode: 'pending',
            // Causes a different message to be rendered during and after loading, if
            // no tributes are found
            loadQueried: false,
            showCreate: false,
            showEdit: false,
            showDelete: false,
            showDetails: false,
            showApproval: false,
            // Needed to access individual purchase request data
            selectedId: null,
            // API error handling
            apiError: false,
            apiInitialLoadError: false,
            // Search handling
            searchTerm: '',
            searchQueried: false
        };

        this.handleSearchField = this.handleSearchField.bind(this);
    }

    checkAuth = async () => {
        // SET ALLOWED ACCESS GROUPS HERE
        const allowedGroups = ['owner', 'admin', 'gamemaker', 'mentor'];
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

        const response1 = await this.props.fetchTributes();
        const response2 = await this.props.fetchAllPurchaseRequests();
        const response3 = await this.props.fetchMentors();
        const response4 = await this.props.fetchGameState();
        if(!response1 || !response2 || !response3 || !response4){
            this.setState({ apiInitialLoadError: true });
        }

        if(this._isMounted){
            this.setState({ loadQueried: true })
        }
    }

    handleSearchField(event){
        this.setState({ searchTerm: event.target.value });
    }

    renderButtons(){
        const switchModes = (
            <Button onClick={ async () => { 
                    this.setState({ displayMode: this.state.displayMode === 'pending' ? 'processed' : 'pending', searchQueried: false });
                    const response = await this.props.fetchAllPurchaseRequests();
                    if(!response){
                        this.setState({ apiError: true });
                    } else{
                        this.setState({ apiError: false });
                    }
                }}
                variant="secondary"
            >
                {this.state.displayMode === 'pending' ? 'Show Processed Requests' : 'Show Pending Requests'}
            </Button>
        );
        if(this.props.userPerms !== 'mentor'){
            return(
                <>
                    {switchModes}
                </>
            );
        }
        return(
            <div style={{ display: "flex" }}>
                <div style={{ justifyContent: "flex-start" }}>
                    {switchModes}
                </div>
                <div style={{ justifyContent: "flex-end" }}>
                <Button 
                    variant="secondary"
                    onClick={() => this.setState({ showCreate: true })}
                    className="coolor-bg-purple-darken-2"
                    style={{ justifyContent: "flex-end"}}
                >
                    Create Purchase Request
                </Button>
                </div>
            </div>
        )
    }

    renderSearch(){
        return(
            <Form onSubmit={this.handleSearchSubmit}>
                <Form.Row>
                    <Col>
                        <Form.Group controlId="searchBy">
                            <Form.Control 
                                value={this.state.searchTerm} 
                                onChange={this.handleSearchField}
                                placeholder="Search for Purchases by Receiving Tribute Name..."
                            />
                        </Form.Group>
                    </Col>
                    <Col>
                        <Button variant="info" onClick={this.handleSearchSubmit}>Search</Button>
                        <Button variant="secondary" 
                            onClick={this.fetchAllPurchaseRequests}
                        >
                            Show All
                        </Button>
                    </Col>
                </Form.Row>
            </Form>
        );
    }

    fetchAllPurchaseRequests = async () => {
        this.setState({ searchTerm: '', loadQueried: false });
        const response = await this.props.fetchAllPurchaseRequests();
        if(!response){
            this.setState({ apiError: true });
        } else {
            this.setState({ apiError: false });
        }
        this.setState({ loadQueried: true });
    }

    handleSearchSubmit = async (event) => {
        event.preventDefault();

        this.setState({ searchQueried: true });

        await this.props.clearPurchasesList();

        const emails = [];
        const name = this.state.searchTerm.toLowerCase();
        this.props.tributes.map(tribute => {
            if(tribute.first_name.toLowerCase().includes(name)){
                emails.push(tribute.email);
            }
            return null;
        });

        emails.map(async email => {
            const response = await this.props.fetchPurchaseRequests(email);
            if(!response){
                this.setState({ apiError: true });
            }
            return null;
        })
        this.setState({ apiError: false });
    }

    renderPurchases(){
        var purchases = this.props.purchases;
        if(this.state.displayMode === 'pending'){
            purchases = purchases.filter(purchase => purchase.status === 'pending');
        } else {
            purchases = purchases.filter(purchase => purchase.status !== 'pending');
        }
        if(this.state.apiInitialLoadError){
            return(
                <h5>
                    An error occurred when loading data. Please refresh the page and try again.
                </h5>
            );
        } else if(this.state.apiError){
            return(
                <h5>
                    An error occurred when loading data. Please try again.
                </h5>
            );
        }
        if(Object.keys(purchases).length === 0){
            if(!this.state.loadQueried) {
                return(
                    <h5>
                        Retrieving list of purchase requests...
                    </h5>
                );
            } else {
                // If list is empty, display the appropriate message based on the display mode
                if(this.state.displayMode === 'pending'){
                    if(this.state.searchQueried){
                        return <h5>Couldn't find any purchase items matching your query :(</h5>
                    } else {
                        return(
                            <>
                                <h5>We're all caught up :)</h5>
                                <h6>No pending purchase requests were found.</h6>
                            </>
                        );
                    }
                } else {
                    if(this.state.searchQueried){
                        return <h5>Couldn't find any purchase items matching your query :(</h5>
                    } else {
                        return(
                            <>
                                <h5>There's nothing here :(</h5>
                                <h6>Couldn't find any past purchase requests</h6>
                            </>
                        );
                    }
                }
            }
        }
        // For non-empty list, display the appropriate list
        if(this.state.displayMode === 'pending'){
            return(
                <>
                <h3>Pending Purchase Requests:</h3>
                <ul className="list-group">
                    {this.renderTableHeader()}
                    {purchases.map(purchase => {
                        return(
                            <li className="list-group-item" key={purchase.id}>
                                <div className="row">
                                    <div className="col">{this.getMentorName(purchase.mentor_email)}</div>
                                    <div className="col">{this.getTributeName(purchase.receiver_email)}</div>
                                    <div className="col">{this.getTributeName(purchase.payer_email)}</div>
                                    <div className="col">{purchase.item_name}</div>
                                    <div className="col">{purchase.quantity}</div>
                                    <div className="col">${purchase.cost}</div>
                                    <div className="col">{this.renderAdmin(purchase)}</div>
                                </div>
                            </li>
                        );
                    })}
                </ul>
                </>
            );
        } else {
            return(
                <>
                <h3>Processed Purchase Requests:</h3>
                <ul className="list-group">
                    {this.renderTableHeader()}
                    {purchases.map(purchase => {
                        return(
                            <li className="list-group-item" key={purchase.id}>
                                <div className="row">
                                    <div className="col">{this.getMentorName(purchase.mentor_email)}</div>
                                    <div className="col">{this.getTributeName(purchase.receiver_email)}</div>
                                    <div className="col">{this.getTributeName(purchase.payer_email)}</div>
                                    <div className="col">{purchase.status}</div>
                                    <div className="col">{purchase.item_name}</div>
                                    <div className="col">{this.renderAdmin(purchase)}</div>
                                </div>
                            </li>
                        );
                    })}
                </ul>
                </>
            );
        }
 
    }

    renderTableHeader(){
        if(this.state.displayMode === 'pending'){
            return(
            <h5 className="row">
                <div className="col">Requested By</div>
                <div className="col">Receiver</div>
                <div className="col">Payer</div>
                <div className="col">Item</div>
                <div className="col">Quantity</div>
                <div className="col">Total</div>
                <div className="col">Actions</div>
            </h5>
            );
        } else {
            return(
                <h5 className="row">
                    <div className="col">Requested By</div>
                    <div className="col">Receiver</div>
                    <div className="col">Payer</div>
                    <div className="col">Status</div>
                    <div className="col">Item</div>
                    <div className="col">Actions</div>
                </h5>
            );
        }
    }

    renderAdmin = (purchase) => {
        if(purchase.status !== 'pending'){
            return(
                <>
                <Button variant="info"
                    onClick={() => {this.setState({ showDetails: true, selectedId: purchase.id })}}
                >
                    Details
                </Button>
                </>
            );
        }
        const userPerms = this.props.userPerms;
        if(userPerms === 'mentor'){
            if(purchase.mentor_email === this.props.userEmail){
                return(
                    <>
                    <Button
                        variant="info"
                        onClick={() => {this.setState({ showEdit: true, selectedId: purchase.id})}}
                    >
                        Edit
                    </Button>
                    <Button
                        variant="danger"
                        onClick={() => {this.setState({ showDelete: true, selectedId: purchase.id})}}
                    >
                        Delete
                    </Button>
                    </>
                );
            } else {
                return(
                    <>
                    <Button variant="info"
                        onClick={() => {this.setState({ showDetails: true, selectedId: purchase.id })}}
                    >
                        View Details
                    </Button>
                    </>
                );
            }
        } else if (['owner', 'admin', 'gamemaker'].includes(userPerms)){
            return(
                <Button
                    variant="info"
                    onClick={() => {this.setState({ showApproval: true, selectedId: purchase.id})}}
                >
                    Review
                </Button>
            );
        }
    }

    getTributeName(email){
        for (let tribute of this.props.tributes){
            if(tribute.email === email){
                return `${tribute.first_name} ${tribute.last_name}`;
            }
        }
    }

    getMentorName(email){
        for (let mentor of this.props.mentors){
            if(mentor.email === email){
                return `${mentor.first_name} ${mentor.last_name}`;
            }
        }
        return 'Unknown User';
    }

    onSubmitCallback = async () => {
        if(this.state.showCreate){
            this.setState({ showCreate: false })
        } else if(this.state.showEdit){
            this.setState({ showEdit: false })
        } else if(this.state.showDelete){
            this.setState({ showDelete: false })
        } else if(this.state.showDetails){
            this.setState({ showDetails: false })
        } else if(this.state.showApproval){
            this.setState({ showApproval: false })
        }
        if(this.state.searchTerm === ''){
            console.log('a');
            this.fetchAllPurchaseRequests();
        } else {
            const response = await this.props.fetchPurchaseRequests(this.state.searchTerm);
            if(!response){
                this.setState({ apiError: true });
                return null;
            }
        }
    }

    showModal() {
        if(this.state.showCreate){
            return(
                <PurchaseForm
                    mode="create"
                    tributes={this.props.tributes}
                    mentors={this.props.mentors}
                    id={this.state.selectedId}
                    onSubmitCallback={this.onSubmitCallback}
                />
            );
        } else if(this.state.showEdit){
            return(
                <PurchaseForm
                    mode="edit"
                    tributes={this.props.tributes}
                    mentors={this.props.mentors}
                    id={this.state.selectedId}
                    onSubmitCallback={this.onSubmitCallback}
                />
            );
        } else if(this.state.showDelete){
            return(
                <DeleteRequest 
                    tributes={this.props.tributes}
                    mentors={this.props.mentors}
                    id={this.state.selectedId}
                    onSubmitCallback={this.onSubmitCallback} 
                />
            );
        } else if(this.state.showDetails){
            return(
                <ViewDetails
                    tributes={this.props.tributes}
                    mentors={this.props.mentors}
                    id={this.state.selectedId}
                    onSubmitCallback={this.onSubmitCallback}
                />
            );
        } else if(this.state.showApproval){
            return(
                <ApprovalForm 
                    tributes={this.props.tributes} 
                    mentors={this.props.mentors} 
                    id={this.state.selectedId} 
                    onSubmitCallback={this.onSubmitCallback} 
                />
            );
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
                    {this.renderSearch()}
                    {this.renderButtons()}
                    {this.renderPurchases()}
                    {this.showModal()}
                </>
            );
        } else {
            return (<h3>{this.state.auth.payload}</h3>);
        }
    }

    render(){
        const mode = this.state.displayMode === 'pending' ? 'Viewing: Pending Requests' : 'Viewing: Processed Requests';
        const priceTierMessage = this.state.auth.loading ? '' : `Current Price Tier: ${this.props.gameState.current_price_tier}`;
        const message2 = this.state.auth.loading ? '' : mode;
        return(
            <>
                <h1>View and Manage Purchase Requests</h1>
                <h3>{priceTierMessage}</h3>
                <h3>{message2}</h3>
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
        tributes: Object.values(state.tributes),
        authLoaded: state.auth.loaded,
        isSignedIn: state.auth.isSignedIn,
        userEmail: state.auth.userEmail,
        userPerms: state.auth.userPerms,
        purchases: Object.values(state.purchases),
        mentors: Object.values(state.users),
        gameState: state.gameState
    }
}

export default connect(mapStateToProps, { 
    setNavBar,
    fetchTributes,
    fetchMentors,
    fetchPurchaseRequests,
    fetchAllPurchaseRequests,
    deletePurchaseRequest,
    clearPurchasesList,
    fetchGameState
    })(PurchaseRequests);