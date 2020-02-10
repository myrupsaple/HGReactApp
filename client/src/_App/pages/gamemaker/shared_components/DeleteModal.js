import React from 'react';
import { Modal, Button } from 'react-bootstrap';

class DeleteModal extends React.Component {
    // PARAMS: id, description, actionType, onConfirm, onSubmitCallback
    _isMounted = false;
    
    constructor(props){
        super(props);
        this.state = {
            showModal: true,
            confirmed: false,
            apiError: false
        }
    }

    componentDidMount(){
        this._isMounted = true;
    }

    handleClose = () => {
        this.props.onSubmitCallback();
        if(this._isMounted){
            this.setState({ showModal: false });
        }
    }

    onConfirm = async () => {
        const response = await this.props.onConfirm(this.props.id);
        if(!response){
            this.setState({ apiError: true });
            return null;
        }

        if(this._isMounted){
            this.setState({ confirmed: true });
        }
        setTimeout(() => this.handleClose(), 1000);
    }

    renderBody = () => {
        if(this.state.confirmed){
            return 'Entry deleted successfully';
        } else if(this.state.apiError){
            return 'An error occurred during deletion. Please try again later';
        } else {
            return(
                <>
                    <div>Are you sure you would like to delete this item?</div>
                </>
            );
        }
    }

    renderFooter = () => {
        if(this.state.apiError) {
            return(
                <>
                    <Button variant="secondary" onClick={this.handleClose}>Close</Button>
                </>
            );
        } else if(this.state.confirmed){
            return null;
        } else {
            return(
                <>
                    <Button variant="danger" onClick={this.onConfirm}>Confirm</Button>
                    <Button variant="secondary" onClick={this.handleClose}>Cancel</Button>
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

    componentWillUnmount(){
        this._isMounted = false;    
    }
};

export default DeleteModal;