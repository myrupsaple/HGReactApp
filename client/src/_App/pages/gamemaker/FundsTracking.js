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
            searchType: 'Tribute Name',
            searchTerm: '',
            searchTermSecondary: '',
            us_date1: '',
            us_date2: '',
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
        if(this.state.searchType === 'Date Range'){
            const day = event.getDate().toLocaleString(undefined, {minimumIntegerDigits: 2});
            const month = (event.getMonth() + 1).toLocaleString(undefined, {minimumIntegerDigits: 2});
            const year = event.getFullYear();
            this.setState({ 
                searchTerm: `${year}-${month}-${day}`,
                us_date1: `${month}-${day}-${year}`
        });
        } else {
            this.setState({ searchTerm: event.target.value });
        }
    }
    handleSearchTermSecondary(event) {
        if(this.state.searchType === 'Date Range'){
            const day = event.getDate().toLocaleString(undefined, {minimumIntegerDigits: 2});
            const month = (event.getMonth() + 1).toLocaleString(undefined, {minimumIntegerDigits: 2});
            const year = event.getFullYear();
            this.setState({ 
                searchTermSecondary: `${year}-${month}-${day}`,
                us_date2: `${month}-${day}-${year}`,
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
        // In the tribute_email case, we have to do a separate donations fetch for each
        // email that was matched. Thus, the reducer adds to the state after
        // each donations search rather than replacing state with the new results.
        // The clearDonationsList action clears this list upon each user search
        // call so that there is no overlap in the results displayed
        await this.props.clearDonationsList();
        const searchType = this.formatSearchType(this.state.searchType);

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
                this.props.fetchDonations('tribute_email', match);
                return null;
            })
            return;
        }
        if(this.state.searchTermSecondary === ''){
            if(searchType === 'amount'){
                this.props.fetchDonationsRange(searchType,
                this.state.searchTerm, this.state.searchTerm);
                return;
            }
            this.props.fetchDonations(searchType, this.state.searchTerm);
        } else {
            this.props.fetchDonationsRange(searchType,
            this.state.searchTerm, this.state.searchTermSecondary);
        }
    }

    formatSearchType(type) {
        switch(type){
            case 'Tribute Name':
                return 'tribute_email';
            case 'Donor Name':
                return 'donor_name';
            case 'Donation Method':
                return 'method';
            case 'Date Range':
                return 'date';
            case 'Amount':
                return 'amount';
            case 'Tags':
                return 'tags';
            default:
                return null;
        }
    }

    renderWarnings = () => {
        // TODO: Render specific formatting instructions for each search input type
        return null;
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
                                <option>Tribute Name</option>
                                <option>Donor Name</option>
                                <option>Donation Method</option>
                                <option>Date Range</option>
                                <option>Amount</option>
                                <option>Tags</option>
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

    renderSearchField = () => {
        if(Object.keys(this.props.tributes).length === 0){
            return 'Loading...';
        }
        if(this.state.searchType === 'Donor Name' || 
        this.state.searchType === 'Donation Method' ||
        this.state.searchType === 'Tribute Name' ||
        this.state.searchType === 'Tags') {
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
        } else if(this.state.searchType === 'Date Range') {
            return(
                <>
                <Form.Group controlId="query">
                    <div><Form.Label>From (Start Date)</Form.Label></div>
                    <DatePicker dateFormat="MM-dd-yyyy" 
                        value={this.state.us_date1}
                        onSelect={this.handleSearchTerm}
                    />
                </Form.Group>
                <Form.Group controlId="query-secondary">
                    <div><Form.Label>To (End Date)</Form.Label></div>
                    
                    <DatePicker dateFormat="MM-dd-yyyy" 
                        value={this.state.us_date2}
                        onSelect={this.handleSearchTermSecondary}
                    />
                    <div><Form.Label>
                        Leaving the second parameter blank will search for a perfect match on the first date.
                    </Form.Label></div>
                </Form.Group>
                </>
            );

        } else if(this.state.searchType === 'Amount') {
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
                    placeholder="Enter maximum value (If blank, the first value will be matched)."
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
                    return(
                        <li className="list-group-item" key={donation.id}>
                            <div className="row">
                                <div className="col">{this.getTributeName(donation.tribute_email)}</div>
                                <div className="col">{donation.donor_name}</div>
                                <div className="col">{donation.method}</div>
                                <div className="col">{donation.date}</div>
                                <div className="col">{donation.amount}</div>
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