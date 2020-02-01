import React from 'react';
import { connect } from 'react-redux';
import { Modal, Button } from 'react-bootstrap';

import { 
    fetchPurchaseRequest,
    deletePurchaseRequest,
    purchaseUpdateFunds,
    purchaseUpdateItemQuantity
} from '../../../../actions';

class DeleteRequest extends React.Component {
    // PARAMS: id, description, actionType, onConfirm, onSubmitCallback
    _isMounted = false;
    
    constructor(props){
        super(props);
        this.state = {
            showModal: true,
            confirmed: false
        }
    }

    componentDidMount = async () => {
        this._isMounted = true;
        this.props.fetchPurchaseRequest(this.props.id);
    }

    handleClose = () => {
        this.props.onSubmitCallback();
        if(this._isMounted){
            this.setState({ showModal: false });
        }
    }

    onConfirm = async () => {
        this.props.deletePurchaseRequest(this.props.id);
    
        if(this._isMounted){
            this.setState({ confirmed: true });
        }

        const purchase = this.props.selectedPurchase;
        this.props.purchaseUpdateFunds(purchase.payer_email, purchase.cost * -1);

        if(purchase.category === 'item'){
            this.props.purchaseUpdateItemQuantity(purchase.item_id, purchase.quantity * -1);
        }

        setTimeout(() => this.handleClose(), 1000);
    }

    renderBody = () => {
        if(this.state.confirmed){
            return 'Entry deleted successfully';
        } else {
            return(
                <>
                    <div>Are you sure you would like to delete this item?</div>
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

    componentWillUnmount(){
        this._isMounted = false;    
    }
};

const mapStateToProps = state => {
    return {
        selectedPurchase: state.selectedPurchase
    };
}

export default connect(mapStateToProps, 
    {
        fetchPurchaseRequest,
        deletePurchaseRequest,
        purchaseUpdateFunds,
        purchaseUpdateItemQuantity
})(DeleteRequest);