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

        if(this._isMounted){
            this.setState({
                first_name: this.props.user.first_name,
                last_name: this.props.user.last_name,
                email: this.props.user.email,
                permissions: this.props.user.permissions,
                firstConfirm: false,
                show: true,
                submitted: false
            });
        }
    }
    
    renderModal = () => {
        var modalBody = null;
        var renderActions = null;
        if(this.state.submitted){
            modalBody = <h4>User Deleted Successfully!</h4>;
            renderActions = null;
        } else if(!this.props.user.first_name){
            modalBody = ( 
                <h4>
                    An error occurred while retrieving user data. Please try again.
                </h4>
            );
            renderActions = (
                <Button variant="secondary" onClick={this.handleClose}>Cancel</Button>
            );
        } else if (!this.state.firstConfirm){
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
        } else {
            modalBody = (
                <h4>
                    Are you sure? This will delete the user's account information only.
                    This action cannot be undone (but you can always re-create the user).
                </h4>
            );
            renderActions = (
                <>
                    <Button variant="danger" onClick={this.handleFinalConfirm}>I Understand, Confirm Delete</Button>
                    <Button variant="secondary" onClick={this.handleClose}>Cancel</Button>
                </>
            );
        }
        if(!this.state.firstConfirm || this.state.submitted){
            return (
                <Modal show={this.state.show} onHide={this.handleClose}>
                    <Modal.Header>
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
                    <Modal.Header>
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
        this.setState({ submitted: true });
        setTimeout(() => this.handleClose(), 1000);
    }
    
    handleClose = async () => {
        if(this._isMounted){
            await this.setState({ firstConfirm: false, show: false });
            this.props.onSubmitCallback();
        }
    }

    render(){
        return(
            <>
                {this.renderModal()}
            </>
        )
    }

    componentWillUnmount(){
        this._isMounted = false;
    }
}

const mapStateToProps = state => {
    return { 
        user: state.selectedUser,

    };
};

export default connect(mapStateToProps, { fetchUser, deleteUser })(DeleteUser);