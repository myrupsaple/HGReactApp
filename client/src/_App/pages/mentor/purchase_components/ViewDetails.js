import React from 'react';
import { connect } from 'react-redux';
import { Button } from 'react-bootstrap';

import {
    fetchPurchaseRequest
} from '../../../../actions';
import { Modal } from 'react-bootstrap';

class ViewDetails extends React.Component{
    _isMounted = false;
    constructor(props){
        super(props);
        this.state = {
            showModal: true
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
        const purchase = this.props.purchase;
        console.log(purchase);
        return(
           <div style={{ marginLeft: "20px" }}>
                <div className="row"><span className="font-weight-bold">Purchasing Tribute:</span><span>&nbsp;{this.getTributeName(purchase.payer_email)}</span></div>
                <div className="row"><span className="font-weight-bold">Receiving Tribute:</span><span>&nbsp;{this.getTributeName(purchase.receiver_email)}</span></div>
                <div className="row"><span className="font-weight-bold">District:</span><span>&nbsp;{this.getMentorName(purchase.mentor_email)}</span></div>
                <div className="row"><span className="font-weight-bold">Time of Request:</span><span>&nbsp;{this.formatTimeFromInt(purchase.time)}</span></div>
                <div className="row"><span className="font-weight-bold">Category:</span><span>&nbsp;{purchase.category}</span></div>
                <div className="row"><span className="font-weight-bold">Item:</span><span>&nbsp;{purchase.item_name}</span></div>
                <div className="row"><span className="font-weight-bold">Cost:</span><span>&nbsp;${purchase.cost}</span></div>
                <div className="row"><span className="font-weight-bold">Quantity:</span><span>&nbsp;{purchase.quantity}</span></div>
                <div className="row"><span className="font-weight-bold">Status:</span><span>&nbsp;{purchase.status}</span></div>
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

    renderModalFooter = () => {
        return(
            <>
            <Button onClick={this.handleClose} variant="danger">
                Close
            </Button>
            </>
        );
    }

    render = () => {
        return(
            <>
                <Modal show={this.state.showModal} onHide={this.handleClose}>
                    <Modal.Header>
                        <Modal.Title>View Purchase Request Details</Modal.Title>
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
        fetchPurchaseRequest
    })(ViewDetails);