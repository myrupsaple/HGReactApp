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
            confirmed: false,
            apiError: false
        }
    }

    componentDidMount = async () => {
        this._isMounted = true;
        const response = await this.props.fetchPurchaseRequest(this.props.id);
        if(!response){
            this.setState({ apiError: true });
            return null;
        }
    }

    handleClose = () => {
        this.props.onSubmitCallback();
        if(this._isMounted){
            this.setState({ showModal: false });
        }
    }

    onConfirm = async () => {
        const response = await this.props.deletePurchaseRequest(this.props.id);
        if(!response){
            this.setState({ apiError: true });
            return null;
        }
    
        if(this._isMounted){
            this.setState({ confirmed: true });
        }

        const purchase = this.props.selectedPurchase;

        const response2 = await this.props.purchaseUpdateFunds(purchase.payer_email, purchase.cost);
        if(!response2){
            this.setState({ apiError: true });
            return null;
        }

        if(purchase.category === 'item'){
            const response = await this.props.purchaseUpdateItemQuantity(purchase.item_id, purchase.quantity);
            if(!response){
                this.setState({ apiError: true });
                return null;
            }
        }

        setTimeout(() => this.handleClose(), 1000);
    }

    renderBody = () => {
        if(this.state.apiError){
            return 'An error occurred. Please try again later.'
        } else if(this.state.confirmed){
            return 'Entry deleted successfully';
        } else if (Object.keys(this.props.selectedPurchase).length === 0){
            return 'Attempting to load purchase info...';
        } else {
            const purchase = this.props.selectedPurchase;
            console.log(purchase);
            return(
                <>
                    <div>
                        Are you sure you would like to delete this purchase request?
                        <div style={{ marginLeft: "20px" }}>
                            <div className="row"><span className="font-weight-bold">Purchasing Tribute:</span><span>&nbsp;{this.getTributeName(purchase.payer_email)}</span></div>
                            <div className="row"><span className="font-weight-bold">Receiving Tribute:</span><span>&nbsp;{this.getTributeName(purchase.receiver_email)}</span></div>
                            <div className="row"><span className="font-weight-bold">District:</span><span>&nbsp;{this.getMentorName(purchase.mentor_email)}</span></div>
                            <div className="row"><span className="font-weight-bold">Time of Request:</span><span>&nbsp;{this.formatTimeFromInt(purchase.time)}</span></div>
                            <div className="row"><span className="font-weight-bold">Category:</span><span>&nbsp;{this.capitalizeFirst(purchase.category)}</span></div>
                            <div className="row"><span className="font-weight-bold">Item:</span><span>&nbsp;{this.capitalizeFirst(purchase.item_name)}</span></div>
                            <div className="row"><span className="font-weight-bold">Cost:</span><span>&nbsp;${purchase.cost}</span></div>
                            <div className="row"><span className="font-weight-bold">Quantity:</span><span>&nbsp;{purchase.quantity}</span></div>
                            <div className="row"><span className="font-weight-bold">Status:</span><span>&nbsp;{this.capitalizeFirst(purchase.status)}</span></div>
                        </div>
                        {this.getTributeName(purchase.payer_email)} will be refunded ${purchase.cost}.
                    </div>
                </>
            );
        }
    }
    capitalizeFirst(string){
        return string.slice(0, 1).toUpperCase() + string.slice(1, string.length).toLowerCase();
    }
    getTributeName = (email) => {
        for (let tribute of this.props.tributes){
            if(email === tribute.email){
                return (tribute.first_name + ' ' + tribute.last_name);
            }
        }
        return 'Unrecognized Tribute';
    }
    getMentorName = (email) => {
        for (let user of this.props.mentors){
            if(email === user.email){
                return (user.first_name + ' ' + user.last_name);
            }
        }
        return 'Unrecognized Tribute';
    }
    formatTimeFromInt(time){
        const hours = Math.floor(time / 60);
        const minutes = (time % 60).toLocaleString(undefined, { minimumIntegerDigits: 2 });
        return(`${hours}:${minutes}`);
    }

    renderFooter = () => {
        if(this.state.apiError){
            return <Button variant="secondary" onClick={this.handleClose}>Close</Button>
        } else if(this.state.confirmed){
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