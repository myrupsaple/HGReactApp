import React from 'react';
import { connect } from 'react-redux';
import { Button, Modal } from 'react-bootstrap';

import { fetchTribute, updateTribute, createTribute } from '../../../../actions';
import TributeInfoForm from './TributeInfoForm';
import DeleteTribute from './DeleteTribute';

class TributeDetails extends React.Component {
    _isMounted = false;

    constructor(props){
        super(props);
        this.state = {};
    }

    async componentDidMount() {
        this._isMounted = true;
        await this.props.fetchTribute(this.props.email);
    
        if(this._isMounted){
            this.setState({
                first_name: this.props.tribute.first_name,
                last_name: this.props.tribute.last_name,
                email: this.props.email,
                district: this.props.tribute.district,
                districtPartner: this.props.tribute.districtPartner,
                area: this.props.tribute.area,
                mentor: this.props.tribute.mentor,
                paidRegistration: this.props.tribute.paidRegistration,
                showModal: true,
                showEdit: false,
                showDelete: false
            });
        }
    }

    renderModalBody() {
        // Use if the tribute prop doesn't have a first name, the API is taking
        // too long to respond, or some other error occurred during loading
        if(!this.props.tribute.first_name){
            return ( 
                <h3>
                    An error occurred while retrieving user data. Please try again.
                </h3>
            );
        }

        const paidReg = this.state.paidRegistration === 1 ? 'Yes' : 'No';
        return (
            <div style={{ marginLeft: "20px" }}>
                <div className="row"><span className="font-weight-bold">Name:</span><span>&nbsp;{this.state.first_name} {this.state.last_name}</span></div>
                <div className="row"><span className="font-weight-bold">Email:</span><span>&nbsp;{this.state.email}</span></div>
                <div className="row"><span className="font-weight-bold">District:</span><span>&nbsp;{this.state.district}</span></div>
                <div className="row"><span className="font-weight-bold">District Partner:</span><span>&nbsp;{this.state.districtPartner}</span></div>
                <div className="row"><span className="font-weight-bold">Area:</span><span>&nbsp;{this.formatArea(this.state.area)}</span></div>
                <div className="row"><span className="font-weight-bold">Mentor:</span><span>&nbsp;{this.state.mentor}</span></div>
                <div className="row"><span className="font-weight-bold">Paid Registration:</span><span>&nbsp;{paidReg}</span></div>
            </div>
        );
    }

    // Converts the area from SQL syntax to a more conventional form
    formatArea(area){
        switch(area){
            case 'dank_denykstra':
                return 'Dank Denykstra';
            case 'sunsprout':
                return 'SunSprout';
            case 'hedrick':
                return 'Hedrick';
            case 'rieber':
                return 'Rieber';
            case 'off_campus':
                return 'Off Campus';
        }
    }

    renderActions(){
        return(
            <>
            <Button variant="info" onClick={() => this.setState({ showEdit: true })}>Edit Tribute Info</Button>
            <Button variant="danger" onClick={() => this.setState({ showDelete: true })}>Delete Tribute</Button>
            </>
        );
    }

    // Ensures cleanup of values is completed upon modal closure (tribute info form)
    // This prevents the base state from getting stuck in the 'modal open' state
    onSubmitCallback = () => {
        this.handleClose();
    };
    
    // Closes the modal and performs any cleanup in the base state (tribute info page)
    handleClose = () => {
        if(this._isMounted){
            this.setState({ showModal: false });
        }
        this.props.onSubmitCallback();
    }

    // Values to be sent to the tribute info form if the 'edit' button is clicked
    // These will be used as default values in the form
    payload = () => {
        return(
            {
                id: this.props.tribute.id,
                first_name: this.state.first_name,
                last_name: this.state.last_name,
                email: this.state.email,
                district: this.state.district,
                districtPartner: this.state.districtPartner,
                area: this.state.area,
                mentor: this.state.mentor,
                paidRegistration: this.state.paidRegistration
            }
        );
    }

    renderContent = () => {
        if(this.state.showEdit){
            return(
                <>
                    <TributeInfoForm payload={this.payload()} mode="edit" onSubmitCallback={this.onSubmitCallback}/>
                </>
            );
        } else if(this.state.showDelete) {
            return(
                <>
                    <DeleteTribute id={this.props.tribute.id} email={this.props.tribute.email} onSubmitCallback={this.onSubmitCallback}/>
                </>
            );
        } else {
            return(
                <Modal show={this.state.showModal} onHide={this.handleClose}>
                    <Modal.Header>
                        <Modal.Title>Tribute Details</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>{this.renderModalBody()}</Modal.Body>
                    <Modal.Footer>
                        {this.renderActions()}
                    </Modal.Footer>
                </Modal>
            );
        }
    }    

    render = () => {
        return(
            <>
                {this.renderContent()}
            </>
        );
    }

    componentWillUnmount(){
        this._isMounted = false;
    }
}

const mapStateToProps = state => {
    return { 
        tribute: state.selectedTribute
    };
};

export default connect(mapStateToProps, { fetchTribute, updateTribute, createTribute })(TributeDetails);