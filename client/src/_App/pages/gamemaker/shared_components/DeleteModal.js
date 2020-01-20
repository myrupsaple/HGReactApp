import React from 'react';
import { Modal, Button } from 'react-bootstrap';

class DeleteModal extends React.Component {
    // PARAMS: id, description, actionType, onConfirm, onSubmitCallback
    state = {
        showModal: true,
        confirmed: false
    }

    handleClose = () => {
        this.props.onSubmitCallback();
        this.setState({ showModal: false });
    }

    onConfirm = () => {
        this.props.onConfirm(this.props.id);
        this.setState({ confirmed: true });
        setTimeout(() => this.handleClose(), 1000);
    }

    renderBody = () => {
        if(this.state.confirmed){
            return 'Entry deleted successfully';
        } else {
            return(
                <>
                    <div>Are you sure you would like to delete this item?</div>
                    <div>{this.props.description}</div>
                </>
            );
        }
    }

    renderFooter = () => {
        if(this.state.confirmed){
            return null;
        } else {
            return(
                <>
                    <Button variant="danger" onClick={this.onConfirm}>Confirm</Button>
                    <Button variant="info" onClick={this.handleClose}>Cancel</Button>
                </>
            );
        }
    }

    render(){
        return(
            <Modal show={this.state.showModal} onHide={this.handleClose}>
                <Modal.Header>
                    <Modal.Title>Delete {this.props.actionType}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {this.renderBody()}
                </Modal.Body>
                <Modal.Footer>
                    {this.renderFooter()}
                </Modal.Footer>
            </Modal>
        );
    }
};

export default DeleteModal;