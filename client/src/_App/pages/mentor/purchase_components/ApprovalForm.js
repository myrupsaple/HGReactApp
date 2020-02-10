import React from 'react';
import { connect } from 'react-redux';
import { Button, Modal, Form } from 'react-bootstrap';

import {
    fetchPurchaseRequest,
    purchaseUpdateStatus,
    purchaseUpdateFunds,
    purchaseUpdateItemQuantity,
    purchaseCreateResourceEvent,
    purchaseCreateLifeEvent,
    purchaseUpdateTributeResources,
    purchaseUpdateTributeLives,
    purchaseGiveImmunity
} from '../../../../actions';

class ApprovalForm extends React.Component{
    _isMounted = false;
    constructor(props){
        super(props);
        this.state = {
            showModal: true,
            status: 'pending',
            submitted: false,
            notes: '',
            apiError: false
        }

        this.handleNotes = this.handleNotes.bind(this);
    }

    componentDidMount = async () => {
        this._isMounted = true;
        await this.props.fetchPurchaseRequest(this.props.id);
    }

    handleNotes(event){
        this.setState({ notes: event.target.value });
    }

    handleClose = () => {
        if(this._isMounted){
            this.setState({ showModal: false });
        }
        this.props.onSubmitCallback();
    }

    renderModalBody = () => {
        if(this.state.submitted){
            switch(this.state.status){
                case ('approved'):
                    return <h3>The purchase request was approved</h3>;
                case ('denied'):
                    return <h3>The purchase request was denied and the tribute's funds were returned.</h3>;
                default:
                    return null;                
            }
        } else if(!this.props.purchase.payer_email){
            return <h3>An error occured while retrieving purchase data. Please try again.</h3> 
        } 
        const purchase = this.props.purchase;
        return(
           <div style={{ marginLeft: "20px" }}>
                <div className="row"><span className="font-weight-bold">Purchasing Tribute:</span><span>&nbsp;{this.getTributeName(purchase.payer_email)}</span></div>
                <div className="row"><span className="font-weight-bold">Receiving Tribute:</span><span>&nbsp;{this.getTributeName(purchase.receiver_email)}</span></div>
                <div className="row"><span className="font-weight-bold">District:</span><span>&nbsp;{this.getMentorName(purchase.mentor_email)}</span></div>
                <div className="row"><span className="font-weight-bold">Time of Request:</span><span>&nbsp;{this.formatTimeFromInt(purchase.time)}</span></div>
                <div className="row"><span className="font-weight-bold">Category:</span><span>&nbsp;{this.capitalizeFirst(purchase.category)}</span></div>
                <div className="row"><span className="font-weight-bold">Item:</span><span>&nbsp;{this.capitalizeFirst(purchase.item_name)}</span></div>
                <div className="row"><span className="font-weight-bold">Quantity:</span><span>&nbsp;{purchase.quantity}</span></div>
                <div className="row"><span className="font-weight-bold">Total Cost:</span><span>&nbsp;${purchase.cost}</span></div>
                <Form>
                    <Form.Row>
                        <Form.Label>Notes</Form.Label>
                        <Form.Control value={this.state.notes} onChange={this.handleNotes}/>
                    </Form.Row>
                </Form>
            </div>
        );
    }

    capitalizeFirst(string){
        console.log(string);
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

    approveRequest = async () => {
        if (!this.state.notes.replace(/\s/g, '').length) {
            await this.setState({ notes: 'None' })
        }

        const purchase = this.props.purchase;

        const response = await this.props.purchaseUpdateStatus(purchase.id, 'approved', this.state.notes);
        if(!response){
            this.setState({ apiError: true });
            return null;
        }

        if(purchase.category === 'item'){
            // Item and funds have already been handled. 
        } else if(purchase.category === 'resource'){
            const response = await this.props.purchaseCreateResourceEvent(purchase.receiver_email, purchase.item_name, purchase.time);
            if(!response){
                this.setState({ apiError: true });
                return null;
            }
            const response2 = await this.props.purchaseUpdateTributeResources(purchase.receiver_email, purchase.item_name);
            if(!response2){
                this.setState({ apiError: true });
                return null;
            }
        } else if(purchase.category === 'life'){
            const response = await this.props.purchaseCreateLifeEvent(purchase.receiver_email, purchase.time);
            if(!response){
                this.setState({ apiError: true });
                return null;
            }
            const response2 = await this.props.purchaseUpdateTributeLives(purchase.receiver_email);
            if(!response2){
                this.setState({ apiError: true });
                return null;
            }
        } else if(purchase.category === 'immunity'){
            const response = await this.props.purchaseGiveImmunity(purchase.receiver_email);
            if(!response){
                this.setState({ apiError: true });
                return null;
            }
        } else if(purchase.category === 'transfer'){
            // Only need to add here since the deduction was made during the request
            const response = await this.props.purchaseUpdateFunds(purchase.receiver_email, purchase.cost);
            if(!response){
                this.setState({ apiError: true });
                return null;
            }
        }

        if(this._isMounted){
            this.setState({ submitted: true, status: 'approved' });
        }

        setTimeout(() => this.handleClose(), 1000);
    }

    denyRequest = async () => {
        if (!this.state.notes.replace(/\s/g, '').length) {
            alert('Notes are required to deny a request');
            return;
        }

        if(this.props.purchase.category === 'item'){
            const response = await this.props.purchaseUpdateItemQuantity(this.props.purchase.item_id, this.props.purchase.quantity);
            if(!response){
                this.setState({ apiError: true });
                return null;
            }
        } 

        const response = await this.props.purchaseUpdateStatus(this.props.id, 'denied', this.state.notes);
        if(!response){
            this.setState({ apiError: true });
            return null;
        }
        const amount = this.props.purchase.cost * this.props.purchase.quantity;
        const response2 = await this.props.purchaseUpdateFunds(this.props.purchase.payer_email, amount);
        if(!response2){
            this.setState({ apiError: true });
            return null;
        }

        if(this._isMounted){
            this.setState({ submitted: true, status: 'denied' });
        }

        setTimeout(() => this.handleClose(), 1000);
    }

    renderModalFooter = () => {
        if(this.state.submitted){
            return null;
        } else if(!this.props.purchase.payer_email){
            return <Button onClick={this.handleClose} variant="secondary">Close</Button>;
        } else {
            return(
                <>
                {this.renderApiError()}
                <Button onClick={this.approveRequest} variant="info">
                    Approve
                </Button>
                <Button onClick={this.denyRequest} variant="danger">
                    Deny
                </Button>
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
        purchaseUpdateFunds,
        purchaseUpdateItemQuantity,
        purchaseCreateResourceEvent,
        purchaseCreateLifeEvent,
        purchaseUpdateTributeResources,
        purchaseUpdateTributeLives,
        purchaseGiveImmunity
    })(ApprovalForm);