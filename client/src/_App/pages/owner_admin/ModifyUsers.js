import React from 'react';
import { connect } from 'react-redux';
import { Form, Col, Button } from 'react-bootstrap';

import { setNavBar, fetchUsers, fetchAllUsers } from '../../../actions';
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
            // Both needed to access individual user data
            selectedId: null,
            selectedEmail: null
        };

        this.handleSearchType = this.handleSearchType.bind(this);
        this.handleSearchTerm = this.handleSearchTerm.bind(this);
        this.handleSearchSubmit = this.handleSearchSubmit.bind(this);
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

    handleSearchType(event) {
        this.setState({ searchType: event.target.value })
    }
    handleSearchTerm(event) {
        this.setState({ searchTerm: event.target.value })
    }

    formatSearchType(type) {
        switch(type){
            case 'First Name':
                return 'first_name';
            case 'Last Name':
                return 'last_name';
            case 'Email':
                return 'email';
            case 'Group':
                return 'permissions';
            default:
                return null;
        }
    }

    formatPerms(permission) {
        return permission.slice(0, 1).toUpperCase() + permission.slice(1, permission.length);
    }

    handleSearchSubmit(event) {
        event.preventDefault();

        var searchType = this.formatSearchType(this.state.searchType)
        var searchTerm = this.state.searchTerm;
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
                                <div className="col">{this.formatPerms(user.permissions)}</div>
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
            <div className="col">Group</div>
            <div className="col">Modify User</div>
        </h5>
        )
    }

    renderAdmin = (user) => {
        if(user.permissions === 'owner' || (user.permissions === 'admin' && this.props.authPerms === 'admin')){
            return null;
        }
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
                        <Button 
                        variant="secondary" 
                        className="coolor-bg-purple-lighten-2" 
                        onClick={() => this.setState({ showCreate: true })}
                        >
                            Create User
                        </Button>
                    </Col>
                    <Col>
                        <Button className="coolor-bg-blue-darken-2" onClick={this.fetchAllUsers}>Show All Users</Button>
                    </Col>
                    <Col>
                        <Button className="coolor-bg-blue-lighten-2" type="submit">Search</Button>
                    </Col>
                </Form.Row>
            </Form>
            </>
        )
    }

    fetchAllUsers = () => {
        this.setState({ searchTerm: '' , queried: true });
        this.props.fetchAllUsers()
    }

    showModal = () => {
        if(this.state.showCreate){
            return(
                <UserForm onSubmitCallback={this.onSubmitCallback} mode='create'/>
            );
        } else if(this.state.showEdit){
            return(
                <UserForm email={this.state.selectedEmail} id={this.state.selectedId} onSubmitCallback={this.onSubmitCallback} mode='edit'/>
            );
        } else if(this.state.showDelete){
            return(
                <DeleteUser email={this.state.selectedEmail} id={this.state.selectedId} onSubmitCallback={this.onSubmitCallback} />
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
            this.props.fetchAllUsers();
        } else {
            this.props.fetchUsers(this.formatSearchType(this.state.searchType), this.state.searchTerm);
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
    
    render() {
        return(
            <>
                {this.renderContent()}
            </>
        );
    }

    componentWillUnmount() {
        this._isMounted = false;
    }
};

const mapStateToProps = (state) => {
    return{
        authLoaded: state.auth.loaded,
        authPerms: state.auth.userPerms,
        isSignedIn: state.auth.isSignedIn,
        userPerms: state.auth.userPerms,
        users: Object.values(state.users)
    };
};

export default connect(mapStateToProps, 
    { 
        setNavBar,
        fetchUsers, 
        fetchAllUsers
    })(ModifyUsers);