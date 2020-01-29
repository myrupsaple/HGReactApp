import React from 'react';
import { connect } from 'react-redux';
import { Form, Col, Button } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

import { setNavBar } from '../../../actions';
import { OAuthFail, NotSignedIn, NotAuthorized, Loading } from '../../components/AuthMessages';
import Wait from '../../../components/Wait';
import { 
    fetchDonations, 
    fetchAllDonations,
    fetchDonationsRange,
    deleteDonation,
    fetchTributes,
    clearDonationsList
} from '../../../actions';
import DonationForm from './donations_components/DonationForm';
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
            searchType: 'tribute_email',
            searchTerm: '',
            searchTermSecondary: '',
            // Formatted string dates that will be displayed in the form.
            // Actual dates used for query will be stored in the 'searchTerm' and 
            // 'searchTermSecondary' fields
            formattedDate: '',
            formattedDateSecondary: '',
            showCreate: false,
            showEdit: false,
            showDelete: false,
            // Neded to access individual donation data
            selectedId: null
        };

        this.handleSearchType = this.handleSearchType.bind(this);
        this.handleSearchTerm = this.handleSearchTerm.bind(this);
        this.handleSearchTermSecondary = this.handleSearchTermSecondary.bind(this);
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
        this.props.setNavBar('app');
        // Check authorization
        this._isMounted = true;
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
        if(this.state.searchType === 'date'){
            const day = event.getDate().toLocaleString(undefined, {minimumIntegerDigits: 2});
            const month = (event.getMonth() + 1).toLocaleString(undefined, {minimumIntegerDigits: 2});
            const year = event.getFullYear();
            this.setState({ 
                searchTerm: `${year}-${month}-${day}`,
                formattedDate: `${month}-${day}-${year}`
        });
        } else {
            this.setState({ searchTerm: event.target.value });
        }
    }
    handleSearchTermSecondary(event) {
        if(this.state.searchType === 'date'){
            const day = event.getDate().toLocaleString(undefined, {minimumIntegerDigits: 2});
            const month = (event.getMonth() + 1).toLocaleString(undefined, {minimumIntegerDigits: 2});
            const year = event.getFullYear();
            this.setState({ 
                searchTermSecondary: `${year}-${month}-${day}`,
                formattedDateSecondary: `${month}-${day}-${year}`,
            });
        } else {
            this.setState({ searchTermSecondary: event.target.value });
        }
    }

    async handleSearchSubmit(event) {
        if(this._isMounted){
            this.setState({ queried: true });
        }
        event.preventDefault();
        // In the tribute_email case, the user actually searches by first name.
        // We thus need to find all tribute items that match this first name query
        // and return the list of emails associated with those matches. The email
        // list is then iterated over and used as the search terms for the fetchDonations
        // call. Because multiple fetchDonations calls are made, the state must
        // contain the cumulative list of donation entries, rather than containing
        // only the entries from the most recent call. clearDonationsList is used as
        // a 'reset' between search calls to ensure that results do not overlap
        // between search events
        await this.props.clearDonationsList();
        const searchType = this.state.searchType;

        if(searchType === 'tribute_email'){
            const emails = [];
            const name = this.state.searchTerm.toLowerCase();
            this.props.tributes.map(tribute => {
                if(tribute.first_name.toLowerCase().includes(name)){
                    emails.push(tribute.email);
                }
                return null;
            });
            emails.map(email => {
                this.props.fetchDonations('tribute_email', email);
                return null;
            })
        } else if(this.state.searchTermSecondary === '') {
            if(this.state.searchType === 'amount' || this.state.searchType === 'date'){
                // If no secondary term is provided and the search type is by amount or date,
                // use fetchDonationsRange. Using regular fetchDonations will perform
                // a 'LIKE' search (eg. Searching for $10 would also return $100, $1000,
                // $910, etc.). Range using the same number twice will perform an exact
                // match search
                this.props.fetchDonationsRange(searchType, this.state.searchTerm, this.state.searchTerm);
            } else {
                this.props.fetchDonations(searchType, this.state.searchTerm)
            }
                
        } else {
            // Will only be called for 'amount' and 'date' search types
            this.props.fetchDonationsRange(searchType,
            this.state.searchTerm, this.state.searchTermSecondary);
        }
    }

    fetchAllDonations = () => {
        this.setState({ searchTerm: '', searchTermSecondary: '', queried: true });
        this.props.fetchAllDonations();
    }

    renderSearchForm() {
        return(
            <>
            <Form onSubmit={this.handleSearchSubmit}>
                <Form.Label>Search For Donations:</Form.Label>
                <Form.Row>
                    <Col>
                        <Form.Group controlId="searchBy">
                            <Form.Control as="select"
                                value={this.state.searchType}
                                onChange={this.handleSearchType}
                            >
                                <option value="tribute_email">Tribute Name</option>
                                <option value="donor_name">Donor Name</option>
                                <option value="method">Donation Method</option>
                                <option value="date">Date Range</option>
                                <option value="amount">Amount</option>
                                <option value="tags">Tags</option>
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
                            Add New Donation
                        </Button>
                    </Col>
                    <Col>
                        <Button className="coolor-bg-blue-darken-2" onClick={this.fetchAllDonations}>Show All Donations</Button>
                    </Col>
                    <Col>
                        <Button className="coolor-bg-blue-lighten-2" type="submit">Search</Button>
                    </Col>
                </Form.Row>
            </Form>
            </>
        )
    }

    // Search query will be different depending on search type
    renderSearchField = () => {
        if(Object.keys(this.props.tributes).length === 0){
            return 'Loading...';
        }
        if( this.state.searchType === 'tribute_email' ||
            this.state.searchType === 'donor_name' || 
            this.state.searchType === 'method' ||
            this.state.searchType === 'tags') {
            return(
                <Form.Group controlId="query">
                    <Form.Control required 
                        value={this.state.searchTerm}
                        autoComplete="off"
                        placeholder="Enter search terms..."
                        onChange={this.handleSearchTerm}
                    />
                </Form.Group>
            )
        } else if(this.state.searchType === 'date') {
            return(
                <>
                <Form.Group controlId="query">
                    <div><Form.Label>From (Start Date)</Form.Label></div>
                    <DatePicker dateFormat="MM-dd-yyyy" 
                        value={this.state.formattedDate}
                        onSelect={this.handleSearchTerm}
                    />
                </Form.Group>
                <Form.Group controlId="query-secondary">
                    <div><Form.Label>To (End Date)</Form.Label></div>
                    
                    <DatePicker dateFormat="MM-dd-yyyy" 
                        value={this.state.formattedDateSecondary}
                        onSelect={this.handleSearchTermSecondary}
                    />
                    <div><Form.Label>
                        Leaving the second parameter blank will search for a perfect match on the first date.
                    </Form.Label></div>
                </Form.Group>
                </>
            );

        } else if(this.state.searchType === 'amount') {
            return(
                <>
                <Form.Group controlId="query">
                    <Form.Control required 
                        value={this.state.searchTerm}
                        onChange={this.handleSearchTerm}
                        placeholder="Enter minimum value"
                    />
                </Form.Group>
                <Form.Group controlId="query-secondary">
                <Form.Control
                    value={this.state.searchTermSecondary}
                    onChange={this.handleSearchTermSecondary}
                    placeholder="Enter maximum value (If blank, the first value will be matched exactly)."
                />
                </Form.Group>
                </>
            );
        }
    }

    renderTableHeader(){
        return(
            <h5 className="row">
                <div className="col">Tribute Name</div>
                <div className="col">Donor Name</div>
                <div className="col">Method</div>
                <div className="col">Date</div>
                <div className="col">Amount</div>
                <div className="col">Tags</div>
                <div className="col">Modify</div>
            </h5>
        )
    }

    renderAdmin = (donation) => {
        return(
            <div className="row">
                <Button 
                variant="info"
                onClick={() => this.setState({ showEdit: true, selectedId: donation.id })}
                >
                    Edit
                </Button>
                <Button
                variant="danger"
                onClick={() => this.setState({ showDelete: true, selectedId: donation.id })}
                >
                    Delete
                </Button>
            </div>
        );
    }

    // Sums up the amount of unassigned funds in the search results
    sumUnassignedFunds(){
        var total = 0;
        this.props.donations.map(donation => {
            if(donation.tribute_email === 'No Assignment'){
                total += donation.amount;
            }
            return null;
        })
        return total;
    }

    renderDonations = () => {
        if(Object.keys(this.props.donations).length === 0){
            // Return different message before and after first search is sent
            if(!this.state.queried) {
                return(
                    <h5>
                        Search the database of donations
                    </h5>
                );
            }
            return(
                <>
                    <h5>No donations were found :(</h5>
                </>
            );
        }
        return(
            <>
            <h5>Unassigned Funds: ${this.sumUnassignedFunds()}</h5>
            <h3>Donations found:</h3>
            <ul className="list-group">
                {this.renderTableHeader()}
                {this.props.donations.map(donation => {
                    var [year, month, day] = donation.date.split('-');
                    day = day.split('T')[0];
                    return(
                        <li className="list-group-item" key={donation.id}>
                            <div className="row">
                                <div className="col">{this.getTributeName(donation.tribute_email)}</div>
                                <div className="col">{donation.donor_name}</div>
                                <div className="col">{donation.method}</div>
                                <div className="col">{`${month}-${day}-${year}`}</div>
                                <div className="col">${donation.amount}</div>
                                <div className="col">{donation.tags}</div>
                                <div className="col">{this.renderAdmin(donation)}</div>
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
            this.props.fetchAllDonations();
        } else {
            this.props.fetchDonations(this.formatSearchType(this.state.searchType), this.state.searchTerm);
        }
    }

    renderModal = () => {
        if(this.state.showCreate) {
            return <DonationForm tributes={this.props.tributes} id={this.state.selectedId} mode="create" onSubmitCallback={this.onSubmitCallback}/>;
        } else if(this.state.showEdit) {
            return <DonationForm tributes={this.props.tributes} id={this.state.selectedId} mode="edit" onSubmitCallback={this.onSubmitCallback}/>;
        } else if(this.state.showDelete){
            return <DeleteModal id={this.state.selectedId} actionType="Donation" 
            onConfirm={this.props.deleteDonation}
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
                    {this.renderDonations()}
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
        donation: state.selectedDonation,
        donations: Object.values(state.donations),
        tributes: Object.values(state.tributes)
    }
}

export default connect(mapStateToProps, 
    { 
        setNavBar,
        fetchDonations, 
        fetchAllDonations,
        fetchDonationsRange,
        deleteDonation,
        fetchTributes,
        clearDonationsList
    })(ManageFunds);