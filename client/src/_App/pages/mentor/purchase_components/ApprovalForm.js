import React from 'react';
import { connect } from 'react-redux';
import { Button, Modal } from 'react-bootstrap';

import {
    fetchPurchaseRequest,
    purchaseUpdateStatus,
    purchaseUpdateFunds
} from '../../../../actions';

class ApprovalForm extends React.Component{
    _isMounted = false;
    constructor(props){
        super(props);
        this.state = {
            showModal: true,
            submitted: false
        }
    }

    componentDidMount = async () => {
        this._isMounted = true;
        await this.props.fetchPurchaseRequest(this.props.id);
    }

    handleClose = () => {
        if(this._isMounted){
            this.setState({ showModal: false });
        }
        this.props.onSubmitCallback();
    }

    renderModalBody = () => {
        if(this.state.submitted){
            return <h3>The purchase request was denied and the tribute's funds were returned.</h3>;
        }
        const purchase = this.props.purchase;
        return(
           <div style={{ marginLeft: "20px" }}>
                <div className="row"><span className="font-weight-bold">Purchasing Tribute:</span><span>&nbsp;{this.getTributeName(purchase.payer_email)}</span></div>
                <div className="row"><span className="font-weight-bold">Receiving Tribute:</span><span>&nbsp;{this.getTributeName(purchase.receiver_email)}</span></div>
                <div className="row"><span className="font-weight-bold">District:</span><span>&nbsp;{this.getMentorName(purchase.mentor_email)}</span></div>
                <div className="row"><span className="font-weight-bold">Time of Request:</span><span>&nbsp;{this.formatTimeFromInt(purchase.time)}</span></div>
                <div className="row"><span className="font-weight-bold">Type:</span><span>&nbsp;{purchase.type}</span></div>
                <div className="row"><span className="font-weight-bold">Description:</span><span>&nbsp;{purchase.secondary_description}</span></div>
                <div className="row"><span className="font-weight-bold">Cost:</span><span>&nbsp;${purchase.cost}</span></div>
                <div className="row"><span className="font-weight-bold">Quantity:</span><span>&nbsp;{purchase.quantity}</span></div>
            </div>
        );
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

    approveRequest = () => {
        const purchase = this.props.purchase;
        if(purchase.type === 'item'){
            // update item
            return 1;
        } else if(purchase.type === 'life'){
            // update life
            return 2;
        } else if(purchase.type === 'resource'){
            // format secondary
            // update resources
            return 3;
        } else if(purchase.type === 'immunity'){
            // update immunity
            return 4;
        } else if(purchase.type === 'transfer'){
            // add funds
            // remove funds
            return 5;
        }
    }

    denyRequest = () => {
        if(this._isMounted){
            this.setState({ submitted: true })
        }
        this.props.purchaseUpdateStatus(this.props.purchase.id, 'denied');
        const amount = this.props.purchase.cost * this.props.purchase.quantity * -1;
        console.log(amount);
        this.props.purchaseUpdateFunds(this.props.purchase.payer_email, amount);
        setTimeout(() => this.handleClose(), 1000);
    }

    renderModalFooter = () => {
        if(this.state.submitted){
            return null;
        }
        return(
            <>
            <Button onClick={this.approveRequest} variant="info">
                Approve
            </Button>
            <Button onClick={this.denyRequest} variant="danger">
                Deny
            </Button>
            </>
        );
    }

    render = () => {
        return(
            <>
                <Modal show={this.state.showModal} onHide={this.handleClose}>
                    <Modal.Header>
                        <Modal.Title>Confirm Purchase Request</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {this.renderModalBody()}
                    </Modal.Body>
                    <Modal.Footer>
                        {this.renderModalFooter()}
                    </Modal.Footer>
                </Modal>
            </>
        );
    }

    componentWillUnmount(){
        this._isMounted = false;
    }
}

const mapStateToProps = state => {
    return {
        purchase: state.selectedPurchase
    };
}

export default connect(mapStateToProps, 
    { 
        fetchPurchaseRequest,
        purchaseUpdateStatus,
        purchaseUpdateFunds
    })(ApprovalForm);