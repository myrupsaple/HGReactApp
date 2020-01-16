import React from 'react';
import { connect } from 'react-redux';
import { Button, Modal } from 'react-bootstrap';

import { fetchUser, deleteUser } from '../../../../actions';

class DeleteUser extends React.Component {
    _isMounted = false;

    constructor(props){
        super(props);
        this.state = {};
    }

    async componentDidMount() {
        this._isMounted = true;
        await this.props.fetchUser(this.props.email, this.props.id);

        console.log(this.props.email);
        console.log(this.props.user);

        if(this._isMounted){
            this.setState({
                first_name: this.props.user.first_name,
                last_name: this.props.user.last_name,
                email: this.props.user.email,
                permissions: this.props.user.permissions,
                firstConfirm: false,
                show: true
            });
        }
    }

    handleFirstName(event) {
        this.setState({ first_name: event.target.value })
    }
    handleLastName(event) {
        this.setState({ last_name: event.target.value })
    }
    handleEmail(event) {
        this.setState({ email: event.target.value })
    }
    handlePermissions(event) {
        this.setState({ permissions: event.target.value })
    }
    
    renderModal = () => {
        var modalBody = null;
        var renderActions = null;
        if(!this.props.user.first_name){
            modalBody = ( 
                <h3>
                    An error occurred while retrieving user data. Please try again.
                </h3>
            );
            renderActions = (
                <Button variant="secondary" onClick={this.handleClose}>Cancel</Button>
            );
        } else if (this.state.firstConfirm){
            modalBody = (
                <h4>
                    Are you absolutely sure? This will delete all of the user's data.
                    This cannot be undone.
                    
                    Well, we *might* be able to undo it, but it will be a pain.
                </h4>
            );
            renderActions = (
                <>
                    <Button variant="danger" onClick={this.handleFinalConfirm}>I Understand, Confirm Delete</Button>
                    <Button variant="secondary" onClick={this.handleClose}>Cancel</Button>
                </>
            );
        } else {
            modalBody = (
                <h4>
                    Are you sure you would like to delete the account {this.props.user.email} for {this.props.user.first_name} {this.props.user.last_name}?
                </h4>
            );
            renderActions = (
                <>
                    <Button variant="secondary" onClick={this.handleClose}>Cancel</Button>
                    <Button variant="danger" onClick={this.handleDeleteSubmit}>Delete</Button>
                </>
            );
        }
        if(!this.state.firstConfirm){
            return (
                <Modal show={this.state.show} onHide={this.handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Delete User</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>{modalBody}</Modal.Body>
                    <Modal.Footer>
                        {renderActions}
                    </Modal.Footer>
                </Modal>
            );
        } else {
            return (
                <Modal show={this.state.show} onHide={this.handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Delete User</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>{renderActions}</Modal.Body>
                    <Modal.Footer>
                        {modalBody}
                    </Modal.Footer>
                </Modal>
            );
        }
    }
    
    handleDeleteSubmit = (event) => {
        this.setState({ firstConfirm: true });
    }

    handleFinalConfirm = () => {
        this.props.deleteUser(this.props.user.id);
        this.handleClose();
    }
    
    handleClose = async () => {
        await this.setState({ firstConfirm: false, show: false });
        console.log(this.state.show);
        this.props.updateShow(this.state.show);
    }

    render(){
        //console.log(this.props.user);
        return(
            <>
                
                {this.renderModal()}
            </>
        )
    }

    componentWillUnmount(){
        console.log('unmounted');
        this._isMounted = false;
    }
}

const mapStateToProps = state => {
    return { 
        user: state.selectedUser
    };
};

export default connect(mapStateToProps, { fetchUser, deleteUser })(DeleteUser);