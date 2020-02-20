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
            permissions: '',
            // Validation
            firstNameValid: 1,
            lastNameValid: 1,
            emailValid: 1,
            permissionsValid: 1,
            formValid: 1,
            // Handle the modal
            showModal: true, 
            submitted: false,
            // API error handling
            apiError: false
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
            const response = await this.props.fetchUser(this.props.email);
            if(!response){
                this.setState({ apiError: true });
                return null;
            }
    
            if(this._isMounted){
                this.setState({
                    first_name: this.props.user.first_name,
                    last_name: this.props.user.last_name,
                    email: this.props.email,
                    permissions: this.props.user.permissions,
                    firstNameValid: 0,
                    lastNameValid: 0,
                    emailValid: 0,
                    permissionsValid: 0
                });
            }
        }
    }

    handleFirstName(event) {
        const input = event.target.value;
        this.setState({ first_name: event.target.value });
        if(input.replace(/\s/g, '') === ''){
            this.setState({ firstNameValid: 2 });
        } else{
            this.setState({ firstNameValid: 0 });
        }
    }
    handleLastName(event) {
        const input = event.target.value;
        this.setState({ last_name: event.target.value });
        if(input.replace(/\s/g, '') === ''){
            this.setState({ lastNameValid: 2 });
        } else {
            this.setState({ lastNameValid: 0 });
        }
    }
    handleEmail(event) {
        const input = event.target.value;
        this.setState({ email: input });
        if(input.replace(/\s/g, '') === ''){
            this.setState({ emailValid: 2 });
        } else if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(input)){
            this.setState({ emailValid: 3 });
        } else {
            this.setState({ emailValid: 0 });
        }
    }
    handlePermissions(event) {
        const input = event.target.value;
        this.setState({ permissions: input });
        if(input.replace(/\s/g, '') === ''){
            this.setState({ permissionsValid: 2 });
        } else {
            this.setState({ permissionsValid: 0 });
        }
    }

    handleFormSubmit = async () => {
        if(this.state.firstNameValid === 1){
            this.setState({ firstNameValid: 2 });
        }
        if(this.state.lastNameValid === 1){
            this.setState({ lastNameValid: 2 });
        }
        if(this.state.emailValid === 1){
            this.setState({ emailValid: 2 });
        }
        if(this.state.permissionsValid === 1){
            this.setState({ permissionsValid: 2 });
        }

        if(this.state.firstNameValid + this.state.lastNameValid + this.state.emailValid + this.state.permissionsValid !== 0){
            this.setState({ formValid: 2 });
            return null;
        }

        if(this.props.mode === 'create'){
            await this.props.fetchUser(this.state.email);
            if(Object.entries(this.props.user).length !== 0){
                this.setState({ emailValid: 4, formValid: 2 });
                return null;
            }
        }
        
        const userObject = {
            first_name: encodeURIComponent(this.state.first_name),
            last_name: encodeURIComponent(this.state.last_name),
            email: encodeURIComponent(this.state.email),
            permissions: this.state.permissions
        };

        var error = false;
        if(this.props.mode === 'edit'){
            userObject.id = this.props.user.id;
            const response = await this.props.updateUser(userObject);
            if(!response){
                this.setState({ apiError: true });
                error = true;
            }
        } else if(this.props.mode === 'create') {
            const response = await this.props.createUser(userObject);
            if(!response){
                this.setState({ apiError: true });
                error = true;
            }
        }

        if(error){
            return null;
        }

        if(this._isMounted){
            this.setState({ submitted: true })
        }
        setTimeout(() => this.handleClose(), 1000);
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
        const allowAdminAssignmentIfOwner = () => {
            if(this.props.authPerms === 'owner'){
                return <option value='admin'>Admin</option>;
            } else {
                return null;
            }
        }
        var authChoices = (
            <>
                {this.showDefault()}
                <option value='tribute'>Tribute</option>
                <option value='helper'>Helper</option>
                <option value='mentor'>Mentor</option>
                <option value='gamemaker'>Gamemaker</option>
                {allowAdminAssignmentIfOwner()}
            </>
        );
        return (
            <Form>
                <Form.Row>
                    <div className="col-4"><Form.Group controlId="first-name">
                        <Form.Label>First Name*</Form.Label>
                        <Form.Control value={this.state.first_name}
                            onChange={this.handleFirstName}
                            autoComplete="off"
                        />
                        {this.renderFirstNameValidation()}
                    </Form.Group></div>
                    <div className="col-4"><Form.Group controlId="last-name">
                        <Form.Label>Last Name*</Form.Label>
                        <Form.Control value={this.state.last_name}
                            onChange={this.handleLastName}
                            autoComplete="off"
                        />
                        {this.renderLastNameValidation()}
                    </Form.Group></div>
                    <div className="col-4"><Form.Group control-group="perms">
                        <Form.Label>Permissions*</Form.Label>
                        <Form.Control value={this.state.permissions}
                            onChange={this.handlePermissions}
                            as="select"
                            autoComplete="off"
                        >
                            {authChoices}
                        </Form.Control>
                        {this.renderPermsValidation()}
                    </Form.Group></div>
                </Form.Row>
                <Form.Row>
                    <div className="col-12"><Form.Group controlId="email">
                        <Form.Label>Email*</Form.Label>
                        <Form.Control value={this.state.email}
                            onChange={this.handleEmail}
                            type="email"
                            autoComplete="off"
                        />
                        {this.renderEmailValidation()}
                    </Form.Group></div>
                </Form.Row>
            </Form>
        );
    }

    renderFirstNameValidation = () => {
        if(this.state.firstNameValid === 2){
            return(
                <p className="coolor-text-red" style={{ fontSize: "8pt" }}>
                    <span role="img" aria-label="check/x">&#10071;</span> First name is required
                </p>
            );
        } else if(this.state.firstNameValid === 0) {
            return(
                <p className="coolor-text-green" style={{ fontSize: "8pt" }}>
                    <span role="img" aria-label="check/x">&#10003;</span> First name
                </p>
            );
        } else {
            return null;
        }
    }
    renderLastNameValidation = () => {
        if(this.state.lastNameValid === 2){
            return(
                <p className="coolor-text-red" style={{ fontSize: "8pt" }}>
                    <span role="img" aria-label="check/x">&#10071;</span> Last name is required
                </p>
            );
        } else if(this.state.lastNameValid === 0) {
            return(
                <p className="coolor-text-green" style={{ fontSize: "8pt" }}>
                    <span role="img" aria-label="check/x">&#10003;</span> Last name
                </p>
            );
        } else {
            return null;
        }
    }
    renderPermsValidation = () => {
        if(this.state.permissionsValid === 2){
            return(
                <p className="coolor-text-red" style={{ fontSize: "8pt" }}>
                    <span role="img" aria-label="check/x">&#10071;</span> Please choose a permissions group
                </p>
            );
        } else if(this.state.permissionsValid === 0) {
            return(
                <p className="coolor-text-green" style={{ fontSize: "8pt" }}>
                    <span role="img" aria-label="check/x">&#10003;</span> Permissions
                </p>
            );
        } else {
            return null;
        }
    }
    renderEmailValidation = () => {
        if(this.state.emailValid === 2){
            return(
                <p className="coolor-text-red" style={{ fontSize: "8pt" }}>
                    <span role="img" aria-label="check/x">&#10071;</span> Email is required
                </p>
            );
        } else if (this.state.emailValid === 3){
            return(
                <p className="coolor-text-red" style={{ fontSize: "8pt" }}>
                    <span role="img" aria-label="check/x">&#10071;</span> Invalid email
                </p>
            );
        } else if(this.state.emailValid === 4) {
            return(
                <p className="coolor-text-red" style={{ fontSize: "8pt" }}>
                    <span role="img" aria-label="check/x">&#10071;</span> Email already registered
                </p>
            );
        } else if(this.state.emailValid === 0) {
            return(
                <p className="coolor-text-green" style={{ fontSize: "8pt" }}>
                    <span role="img" aria-label="check/x">&#10003;</span> Email
                </p>
            );
        } else {
            return null;
        }
    }
    renderFormValidation = () => {
        if(this.state.submitted){
            return null;
        } else if(this.props.mode === 'edit' && !this.props.user.first_name){
            return null;
        } 
        if(this.state.firstNameValid + this.state.lastNameValid + 
            this.state.permissionsValid + this.state.emailValid === 0) {
            return(
                <p className="coolor-text-green" style={{ fontSize: "12pt" }}>
                    <span role="img" aria-label="check/x">&#10003;</span> Ready to submit? 
                </p>
            );
        } else if(this.state.formValid === 2){
            return(
                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                    <p className="coolor-text-red" style={{ fontSize: "12pt" }}>
                        <span role="img" aria-label="check/x">&#10071;</span> Please fix the indicated fields.
                    </p>
                </div>
            );
        } else {
            return null;
        }
    }

    showDefault = () => {
        if(this.state.permissions === ''){
            return(<option value=''>Please select...</option>);
        }
        return null;
    }

    renderModalFooter(){
        if(this.state.submitted){
            return null;
        } else if(this.state.apiError){
            return (
                <>
                    {this.renderApiError()}
                    <Button variant="danger" onClick={this.handleClose}>Close</Button>
                </>
                );
        } else {
            return(
                <>
                {this.renderApiError()}
                <Form.Row>
                    <Button variant="danger" onClick={this.handleClose}>Cancel</Button>
                    <Button variant="info" onClick={this.handleFormSubmit}>Confirm</Button>
                </Form.Row>
                </>
            );
        }
    }

    renderApiError = () => {
        if(this.state.apiError){
            return (
                <div className="row coolor-text-red">
                    An error occurred. Please try again.
                </div>
            );
        } else {
            return null;
        }
    }

    // GOOD EXAMPLE OF PASSING DATA FROM CHILD TO PARENT
    handleClose = () => {
        if(this._isMounted){
            this.setState({ showModal: false });
            this.props.onSubmitCallback();
        }
    }

    render(){
        return(
            <Modal show={this.state.showModal} onHide={this.handleClose}>
                <Modal.Header>
                    <Modal.Title>
                        {this.renderModalHeader()}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {this.renderModalBody()}
                </Modal.Body>
                <Modal.Footer>
                    {this.renderFormValidation()}
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