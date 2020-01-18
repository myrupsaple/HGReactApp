import React from 'react';
import { connect } from 'react-redux';
import { Form, Col, Button } from 'react-bootstrap';

import { fetchUsers, fetchAllUsers } from '../../../actions';
import AppNavBar from '../../components/AppNavBar';
import { OAuthFail, NotSignedIn, NotAuthorized, Loading } from '../../components/AuthMessages';
import Wait from '../../../components/Wait';
import UserForm from './components/UserForm';
import DeleteUser from './components/DeleteUser';

class ModifyUsers extends React.Component {
    _isMounted = true;
    constructor(props){
        super(props);
        this.state = {
            auth: {
                loading: true,
                payload: null
            },
            queried: false,
            searchType: 'First Name',
            searchTerm: '',
            showCreate: false,
            showEdit: false,
            showDelete: false,
            isShowing: false,
            // Both needed to access individual user data
            selectedId: null,
            selectedEmail: null
        };

        this.handleSearchType = this.handleSearchType.bind(this);
        this.handleSearchTerm = this.handleSearchTerm.bind(this);
        this.handleSearchSubmit = this.handleSearchSubmit.bind(this);
        this.showModal = this.showModal.bind(this);
    }

    checkAuth = async () => {
        // SET ALLOWED ACCESS GROUPS HERE
        const allowedGroups = ['owner', 'admin'];
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

    handleSearchType(event) {
        this.setState({ searchType: event.target.value })
    }
    handleSearchTerm(event) {
        this.setState({ searchTerm: event.target.value })
    }

    handleSearchSubmit(event) {
        event.preventDefault();

        var searchType = '';
        var searchTerm = this.state.searchTerm;
        switch(this.state.searchType){
            case 'First Name':
                searchType = 'first_name';
                break;
            case 'Last Name':
                searchType = 'last_name';
                break;
            case 'Email':
                searchType = 'email';
                break;
            case 'Group':
                searchType = 'permissions';
                break;
            default:
                return;
        }
        this.setState({ queried: true });
        this.props.fetchUsers(searchType, searchTerm);
    }

    renderUsers(){
        if(Object.keys(this.props.users).length === 0){
            // Return different message before and after first search is sent
            if(!this.state.queried) {
                return(
                    <h5>
                        Search the database of users
                    </h5>
                );
            }
            return(
                <>
                    <h5>No users were found :(</h5>
                </>
            );
        }
        return(
            <>
            <h3>Users found:</h3>
            <ul className="list-group">
                {this.renderTableHeader()}
                {this.props.users.map(user => {
                    return(
                        <li className="list-group-item" key={user.id}>
                            <div className="row">
                                <div className="col">{user.first_name}</div>
                                <div className="col">{user.last_name}</div>
                                <div className="col">{user.email}</div>
                                <div className="col">{user.permissions}</div>
                                <div className="col">{this.renderAdmin(user)}</div>
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
            <div className="col">First Name</div>
            <div className="col">Last Name</div>
            <div className="col">Email</div>
            <div className="col">Permissions</div>
            <div className="col">Modify User</div>
        </h5>
        )
    }

    renderAdmin(user) {
        return(
            <div className="row">
                <Button 
                variant="info"
                onClick={() => this.setState({ showEdit: true, selectedEmail: user.email, selectedId: user.id })}
                >
                    Edit
                </Button>
                <Button
                variant="danger"
                onClick={() => this.setState({ showDelete: true, selectedEmail: user.email, selectedId: user.id })}
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
                <Form.Label>Search For Users: </Form.Label>
                <Form.Row>
                    <Col>
                        <Form.Group controlId="searchBy">
                            <Form.Control as="select"
                                value={this.state.searchType}
                                onChange={this.handleSearchType}
                            >
                                <option>First Name</option>
                                <option>Last Name</option>
                                <option>Email</option>
                                <option>Group</option>
                            </Form.Control>
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group controlId="query">
                            <Form.Control placeholder="Enter search terms..." 
                                required
                                autoComplete="off"  
                                value={this.state.searchTerm} 
                                onChange={this.handleSearchTerm}
                            />
                            <Form.Control.Feedback type="invalid">
                                Please enter a search term
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Col>
                </Form.Row>
                <Form.Row>
                    <Col>
                        <Button variant="secondary" className="coolor-bg-purple-lighten-2" 
                        onClick={() => this.setState({ showCreate: true })}
                        >
                            Create User
                        </Button>
                    </Col>
                    <Col>
                        <Button className="coolor-bg-blue-darken-2" onClick={this.props.fetchAllUsers}>Show All Users</Button>
                    </Col>
                    <Col>
                        <Button className="coolor-bg-blue-lighten-2" type="submit">Search</Button>
                    </Col>
                </Form.Row>
            </Form>
            </>
        )
    }

    showModal(){
        if(this.state.showCreate){
            return(
                <UserForm updateShow={this.updateShowFromChild} mode='create'/>
            );
        } else if(this.state.showEdit){
            return(
                <UserForm email={this.state.selectedEmail} id={this.state.selectedId} updateShow={this.updateShowFromChild} mode='edit'/>
            );
        } else if(this.state.showDelete){
            return(
                <DeleteUser email={this.state.selectedEmail} id={this.state.selectedId} updateShow={this.updateShowFromChild} />
            );
        } else {
            return null;
        }
    }

    updateShowFromChild = (currentValueOfShow) => {
        if(this.state.showCreate){
            this.setState({ showCreate: currentValueOfShow })
        } else if(this.state.showEdit){
            this.setState({ showEdit: currentValueOfShow })
        } else if(this.state.showDelete){
            this.setState({ showDelete: currentValueOfShow })
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
                    {this.renderUsers()}
                    {this.showModal()}
                </>
            );
        } else {
            return (<h3>{this.state.auth.payload}</h3>);
        }
    }
    
    // TODO: Figure out how to make modal re-openable
    render() {
        console.log('SHOW: ' + this.state.showEdit + ' ' + this.state.showDelete + ' ')
        return(
            <>
                <AppNavBar />
                <div className="ui-container">
                    {this.renderContent()}
                </div>
            </>
        );
    }

    componentWillUnmount() {
        this._isMounted = false;
    }
};

const mapStateToProps = (state) => {
    return{
        users: Object.values(state.users),
        authLoaded: state.auth.loaded,
        isSignedIn: state.auth.isSignedIn,
        userPerms: state.auth.userPerms
    };
};

export default connect(mapStateToProps, { fetchUsers, fetchAllUsers })(ModifyUsers);