import React from 'react';
import { connect } from 'react-redux';
import { Form, Button, Modal } from 'react-bootstrap';

import { fetchUser, updateUser } from '../../../../../actions';

class EditUser extends React.Component {
    _isMounted = false;

    constructor(props){
        super(props);
        this.state = {};

        this.handleFirstName = this.handleFirstName.bind(this);
        this.handleLastName = this.handleLastName.bind(this);
        this.handleEmail = this.handleEmail.bind(this);
        this.handlePermissions = this.handlePermissions.bind(this);
        this.handleEditSubmit = this.handleEditSubmit.bind(this);
    }

    async componentDidMount() {
        this._isMounted = true;
        await this.props.fetchUser(this.props.email, this.props.id);

        if(this._isMounted){
            this.setState({
                first_name: this.props.user.first_name,
                last_name: this.props.user.last_name,
                email: this.props.email,
                permissions: this.props.user.permissions,
                show: true
            });
        }
    }

    handleFirstName(event) {
        this.setState({ first_name: event.target.value });
        console.log(this.state.first_name);
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

    renderModalBody() {
        if(!this.props.user.first_name){
            return ( 
                <h3>
                    An error occurred while retrieving user data. Please try again.
                </h3>
            );
        }
        return (
            <>
                {this.renderForm()}
            </>
        );
    }

    renderForm() {
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
                        <Form.Control value={this.state.permissions}
                            onChange={this.handlePermissions}
                            as="select"
                        >
                            <option>Tribute</option>
                            <option>Helper</option>
                            <option>Mentor</option>
                            <option>Gamemaker</option>
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

    renderActions(){
        return(
            <Form.Row>
                <Button variant="danger" onClick={this.handleClose}>Cancel</Button>
                <Button variant="info" onClick={this.handleEditSubmit}>Confirm</Button>
            </Form.Row>
        );
    }
    
    // GOOD EXAMPLE OF PASSING DATA FROM CHILD TO PARENT
    handleClose = async () => {
        await this.setState({ show: false });
        this.props.updateShow(this.state.show);
    }

    handleEditSubmit() {
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
            default:
                break;
        }
        const sendUser = {
            id: this.props.user.id,
            first_name: this.state.first_name,
            last_name: this.state.last_name,
            email: this.state.email,
            permissions: formattedPerms
        }
        this.props.updateUser(sendUser);
        this.handleClose();
    }

    render = () => {
        return(
            <Modal show={this.state.show} onHide={this.handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit User</Modal.Title>
                </Modal.Header>
                <Modal.Body>{this.renderModalBody()}</Modal.Body>
                <Modal.Footer>
                    {this.renderActions()}
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
        user: state.selectedUser
    };
};

export default connect(mapStateToProps, { fetchUser, updateUser })(EditUser);