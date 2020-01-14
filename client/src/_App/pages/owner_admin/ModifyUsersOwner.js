import React from 'react';
import { connect } from 'react-redux';
import { Form, Col, Button } from 'react-bootstrap';

import { fetchUsers, fetchAllUsers } from '../../../actions';
import AppNavBar from '../../components/AppNavBar';
import EditUser from './components/EditUser';
import DeleteUser from './components/DeleteUser';

class ModifyUsersOwner extends React.Component {
    constructor(props){
        super(props);
        this.state = { 
            queried: false,
            searchType: 'First Name',
            searchTerm: '',
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
        this.handleRetrieveAll = this.handleRetrieveAll.bind(this);
        this.showModal = this.showModal.bind(this);
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
    
    handleRetrieveAll(){
        this.props.fetchAllUsers();
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
            </Form>
            <Form.Row>
                <Col>
                    <Button variant="primary" onClick={this.handleRetrieveAll}>Show All Users</Button>
                </Col>
                <Col>
                    <Button variant="primary" type="submit">Submit</Button>
                </Col>
            </Form.Row>
            </>
        )
    }

    showModal(){
        if(this.state.showEdit){
            return(
                <EditUser email={this.state.selectedEmail} id={this.state.selectedId} updateShow={this.updateShowFromChild} />
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
        if(this.state.showEdit){
            console.log('ess ' + currentValueOfShow);
            this.setState({ showEdit: currentValueOfShow })
        } else if(this.state.showDelete){
            this.setState({ showDelete: currentValueOfShow })
        }
    };
    
    // TODO: Figure out how to make modal re-openable
    render() {
        console.log('SHOW: ' + this.state.showEdit + ' ' + this.state.showDelete + ' ')
        return(
            <>
                <AppNavBar />
                {this.renderSearchForm()}
                {this.renderUsers()}
                {this.showModal()}
                {this.modalLogic}
            </>
        );
    }
};

const mapStateToProps = (state) => {
    return{
        users: Object.values(state.users)
    };
};

export default connect(mapStateToProps, { fetchUsers, fetchAllUsers })(ModifyUsersOwner);