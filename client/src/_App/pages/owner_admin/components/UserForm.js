import React from 'react';
import { connect } from 'react-redux';
import { Form, Button, Modal } from 'react-bootstrap';

import { fetchUser, updateUser, createUser } from '../../../../actions';

class UserForm extends React.Component {
    _isMounted = false;

    constructor(props){
        super(props);
        this.state = { 
            first_name: '',
            last_name: '',
            email: '',
            permissions: 'Tribute',
            showModal: true, 
            submitted: false
        };

        this.handleFirstName = this.handleFirstName.bind(this);
        this.handleLastName = this.handleLastName.bind(this);
        this.handleEmail = this.handleEmail.bind(this);
        this.handlePermissions = this.handlePermissions.bind(this);
        this.handleFormSubmit = this.handleFormSubmit.bind(this);
    }

    async componentDidMount() {
        this._isMounted = true;
        if(this.props.mode === 'edit'){
            await this.props.fetchUser(this.props.email, this.props.id);
    
            if(this._isMounted){
                this.setState({
                    first_name: this.props.user.first_name,
                    last_name: this.props.user.last_name,
                    email: this.props.email,
                    permissions: this.props.user.permissions
                });
            }
        }
    }

    handleFirstName(event) {
        this.setState({ first_name: event.target.value });
    }
    handleLastName(event) {
        this.setState({ last_name: event.target.value });
    }
    handleEmail(event) {
        this.setState({ email: event.target.value });
    }
    handlePermissions(event) {
        this.setState({ permissions: event.target.value });
    }

    renderModalHeader(){
        if(this.props.mode === 'edit'){
            return 'Edit User';
        } else if(this.props.mode === 'create'){
            return 'Create New User';
        } else {
            return 'Something unexpected happened.';
        }
    }

    renderModalBody() {
        // Use props for first_name to see if the user was successfully loaded
        // (state may not update right away)
        if(this.state.submitted){
            const message = this.props.mode === 'edit' ? 'Updated' : 'Created';
            return(
                <h4>User {message} Successfully!</h4>
            )
        } else if(this.props.mode === 'edit' && !this.props.user.first_name){
            return ( 
                <h3>
                    An error occurred while retrieving user data. Please try again.
                </h3>
            );
        } else {
            return (
                <>
                    {this.renderForm()}
                </>
            );
        }
    }

    renderForm() {
        const allowAdminIfOwner = () => {
            if(this.props.authPerms === 'owner'){
                return <option>Admin</option>;
            } else {
                return null;
            }
        }
        var authChoices = (
            <>
                <option>Tribute</option>
                <option>Helper</option>
                <option>Mentor</option>
                <option>Gamemaker</option>
                {allowAdminIfOwner()}
            </>
        );
        return (
            <Form>
                <Form.Row>
                    <div className="col-4"><Form.Group controlId="first-name">
                        <Form.Label>First Name</Form.Label>
                        <Form.Control defaultValue={this.state.first_name}
                            onChange={this.handleFirstName}
                        />
                    </Form.Group></div>
                    <div className="col-4"><Form.Group controlId="last-name">
                        <Form.Label>Last Name</Form.Label>
                        <Form.Control defaultValue={this.state.last_name}
                            onChange={this.handleLastName}
                        />
                    </Form.Group></div>
                    <div className="col-4"><Form.Group control-group="perms">
                        <Form.Label>Permissions</Form.Label>
                        <Form.Control defaultValue={this.state.permissions}
                            onChange={this.handlePermissions}
                            as="select"
                        >
                            {authChoices}
                        </Form.Control>
                    </Form.Group></div>
                </Form.Row>
                <Form.Row>
                    <div className="col-12"><Form.Group controlId="email">
                        <Form.Label>Email</Form.Label>
                        <Form.Control value={this.state.email}
                            onChange={this.handleEmail}
                            type="email"
                        />
                    </Form.Group></div>
                </Form.Row>
            </Form>
        );
    }

    renderModalFooter(){
        if(this.state.submitted){
            return null;
        }
        return(
            <Form.Row>
                <Button variant="danger" onClick={this.handleClose}>Cancel</Button>
                <Button variant="info" onClick={this.handleFormSubmit}>Confirm</Button>
            </Form.Row>
        );
    }

    handleFormSubmit = () => {
        const validated = (this.state.first_name && this.state.last_name && this.state.email && this.state.permissions);
        if(!validated){
            alert('All fields must be filled in');
            return;
        }
        if(this._isMounted){
            this.setState({ submitted: true })
        }
        
        var formattedPerms = null;
        switch(this.state.permissions){
            case 'Tribute':
                formattedPerms = 'tribute';
                break;
            case 'Helper':
                formattedPerms = 'helper';
                break;
            case 'Mentor':
                formattedPerms = 'mentor';
                break;
            case 'Gamemaker':
                formattedPerms = 'gamemaker';
                break;
            case 'Admin':
                formattedPerms = 'admin';
                break;
            default:
                break;
        }
        if(this.props.mode === 'edit'){
            const userObject = {
                id: this.props.user.id,
                first_name: this.state.first_name,
                last_name: this.state.last_name,
                email: this.state.email,
                permissions: formattedPerms
            };
            this.props.updateUser(userObject);
        } else if(this.props.mode === 'create') {
            const userObject = {
                first_name: this.state.first_name,
                last_name: this.state.last_name,
                email: this.state.email,
                permissions: formattedPerms
            };
            this.props.createUser(userObject);
        }
        setTimeout(() => this.handleClose(), 1000);
    }

    // GOOD EXAMPLE OF PASSING DATA FROM CHILD TO PARENT
    handleClose = () => {
        if(this._isMounted){
            this.setState({ showModal: false });
            this.props.onSubmitCallback();
        }
    }

    render = () => {
        return(
            <Modal show={this.state.showModal} onHide={this.handleClose}>
                <Modal.Header>
                    <Modal.Title>{this.renderModalHeader()}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {this.renderModalBody()}
                </Modal.Body>
                <Modal.Footer>
                    {this.renderModalFooter()}
                </Modal.Footer>
            </Modal>
        )
    }

    componentWillUnmount(){
        this._isMounted = false;
    }
}

const mapStateToProps = state => {
    return { 
        user: state.selectedUser,
        authPerms: state.auth.userPerms
    };
};

export default connect(mapStateToProps, { fetchUser, updateUser, createUser })(UserForm);