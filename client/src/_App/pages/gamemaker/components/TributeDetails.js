import React from 'react';
import { connect } from 'react-redux';
import { Button, Modal } from 'react-bootstrap';

import { fetchTribute, updateTribute, createTribute } from '../../../../actions';
import TributeInfoForm from './TributeInfoForm';

class TributeDetails extends React.Component {
    _isMounted = false;

    constructor(props){
        super(props);
        this.state = {};
    }

    async componentDidMount() {
        this._isMounted = true;
        await this.props.fetchTribute(this.props.email, this.props.id);
    
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
            });
        }
    }

    renderModalBody() {
        // Use props for first_name to see if the user was successfully loaded
        // (state may not update right away)
        if(this._isMounted && !this.props.tribute.first_name){
            return ( 
                <h3>
                    An error occurred while retrieving user data. Please try again.
                </h3>
            );
        }
        return (
            <>
                {this.renderDetails()}
            </>
        );
    }

    renderDetails = () => {
        const paidReg = this.state.paidRegistration === 1 ? 'yes' : 'no';
        return(
            <>
                <p className="font-weight-bold">Name:</p><p>{this.state.first_name} {this.state.last_name}</p>
                <p className="font-weight-bold">Email:</p><p>{this.state.email}</p>
                <p className="font-weight-bold">District:</p><p>{this.state.district}</p>
                <p className="font-weight-bold">District Partner:</p><p>{this.state.districtPartner}</p>
                <p className="font-weight-bold">Area:</p><p>{this.state.area}</p>
                <p className="font-weight-bold">Mentor:</p><p>{this.state.mentor}</p>
                <p className="font-weight-bold">Paid Registration:</p><p>{paidReg}</p>
            </>
        );
    }

    renderActions(){
        return(
            <Button variant="info" onClick={this.displayEdit}>Edit Tribute Info</Button>
        );
    }

    dismissEdit = () => {
        this.handleClose();
    };

    displayEdit = async () => {
        await this.setState({ showEdit: true });
    }
    
    handleClose = async () => {
        await this.setState({ showModal: false });
        this.props.updateShow(this.state.show);
    }

    payload(){
        return(
            {
                id: this.props.id,
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
                    <TributeInfoForm payload={this.payload()} mode="edit" onDismiss={this.dismissEdit}/>
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