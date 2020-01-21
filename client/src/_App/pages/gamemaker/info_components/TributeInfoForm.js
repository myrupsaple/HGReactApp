import React from 'react';
import { connect } from 'react-redux';
import { Form, Button, Modal } from 'react-bootstrap';

import { createTribute, updateTribute } from '../../../../actions';

class TributeInfoForm extends React.Component {
    _isMounted = false;
    constructor(props){
        super(props);
        this.state = { showModal: true, submitted: false }

        if(this.props.mode === 'edit'){
            this.state = {
                id: this.props.payload.id,
                first_name: this.props.payload.first_name,
                last_name: this.props.payload.last_name,
                email: this.props.payload.email,
                district: this.props.payload.district,
                districtPartner: this.props.payload.districtPartner,
                area: this.props.payload.area,
                mentor: this.props.payload.mentor,
                paidRegistration: this.props.payload.paidRegistration,
                showModal: true,
                submitted: false
            }
        } else {
            this.state = {
                first_name: '',
                last_name: '',
                email: '',
                district: 1,
                districtPartner: '',
                area: 'Dank Denykstra',
                mentor: '',
                paidRegistration: 1,
                showModal: true,
                submitted: false
            }
        }

        this.handleFirstName = this.handleFirstName.bind(this);
        this.handleLastName = this.handleLastName.bind(this);
        this.handleEmail = this.handleEmail.bind(this);
        this.handleDistrict = this.handleDistrict.bind(this);
        this.handleDistrictPartner = this.handleDistrictPartner.bind(this);
        this.handleArea = this.handleArea.bind(this);
        this.handleMentor = this.handleMentor.bind(this);
        this.handlePaidRegistration = this.handlePaidRegistration.bind(this);

        this.handleClose = this.handleClose.bind(this);
        this.handleFormSubmit = this.handleFormSubmit.bind(this);
    }

    handleFirstName(event) {
        this.setState({ first_name: event.target.value });
    }
    handleLastName(event) {
        this.setState({ last_name: event.target.value });
    }
    handleEmail(event) {
        this.setState({ email: event.target.value });
    }
    handleDistrict(event) {
        this.setState({ district: event.target.value });
    }
    handleDistrictPartner(event) {
        this.setState({ districtPartner: event.target.value });
    }
    handleArea(event) {
        this.setState({ area: event.target.value });
    }
    handleMentor(event) {
        this.setState({ mentor: event.target.value });
    }
    handlePaidRegistration(event) {
        this.setState({ paidRegistration: event.target.value });
    }    

    componentDidMount() {
        this._isMounted = true;
    }

    renderForm = () => {
        if(this.state.submitted) {
            const message = this.props.mode === 'edit' ? 'Updated' : 'Created';
            return(
                <h5>Tribute {message} Successfully!</h5>
            );
        }
        return (
            <Form>
                <Form.Row>
                    <div className="col-6"><Form.Group controlId="first-name">
                        <Form.Label>First Name</Form.Label>
                        <Form.Control defaultValue={this.state.first_name}
                            onChange={this.handleFirstName}
                            autoComplete="off"
                        />
                    </Form.Group></div>
                    <div className="col-6"><Form.Group controlId="last-name">
                        <Form.Label>Last Name</Form.Label>
                        <Form.Control defaultValue={this.state.last_name}
                            onChange={this.handleLastName}
                            autoComplete="off"
                        />
                    </Form.Group></div>
                </Form.Row>
                <Form.Row>
                    <div className="col-12"><Form.Group controlId="email">
                        <Form.Label>Email</Form.Label>
                        <Form.Control value={this.state.email}
                            onChange={this.handleEmail}
                            autoComplete="off"
                            type="email"
                        />
                    </Form.Group></div>
                </Form.Row>
                <Form.Row>
                    <div className="col-12"><Form.Group controlId="partner-email">
                        <Form.Label>District Partner Email</Form.Label>
                        <Form.Control value={this.state.districtPartner}
                            onChange={this.handleDistrictPartner}
                            autoComplete="off"
                            type="email"
                        />
                    </Form.Group></div>
                </Form.Row>
                <Form.Row>
                    <div className="col-12"><Form.Group controlId="mentor-email">
                        <Form.Label>Mentor Email</Form.Label>
                        <Form.Control value={this.state.mentor}
                            onChange={this.handleMentor}
                            autoComplete="off"
                            type="email"
                        />
                    </Form.Group></div>
                </Form.Row>
                <Form.Row>
                    <div className="col-4"><Form.Group control-group="perms">
                        <Form.Label>District</Form.Label>
                        <Form.Control 
                            defaultValue={this.state.district}
                            onChange={this.handleDistrict}
                            as="select"
                        >
                            {/* TODO: Make this dynamic */}
                            <option>1</option>
                            <option>2</option>
                            <option>3</option>
                            <option>4</option>
                        </Form.Control>
                    </Form.Group></div>
                    <div className="col-4"><Form.Group control-group="area">
                        <Form.Label>Area</Form.Label>
                        <Form.Control
                            defaultValue={this.state.area}
                            onChange={this.handleArea}
                            as="select"
                        >
                            {/* TODO: Make this dynamic */}
                            <option>Dank Denykstra</option>
                            <option>SunSprout</option>
                            <option>Hedrick</option>
                            <option>Rieber</option>
                            <option>Off Campus</option>
                        </Form.Control>
                    </Form.Group></div>  
                    <div className="col-4"><Form.Group control-group="paid-registration">
                        <Form.Label>Paid Registration?</Form.Label>
                        <Form.Control
                            defaultValue={this.state.paidRegistration === 1 ? "Yes" : "No"}
                            onChange={this.handlePaidRegistration}
                            as="select"
                        >
                            {/* TODO: Make this dynamic */}
                            <option>Yes</option>
                            <option>No</option>
                        </Form.Control>
                    </Form.Group></div>  
                </Form.Row>
            </Form>
        );
    }

    renderActions = () => {
        if(this.state.submitted){
            return null;
        } else {
            return(
                <Form.Row>
                    <Button variant="danger" onClick={this.handleClose}>Cancel</Button>
                    <Button variant="info" onClick={this.handleFormSubmit}>Confirm</Button>
                </Form.Row>
            );
        }
    }

    handleFormSubmit = () => {
        const validated = (this.state.first_name && this.state.last_name && this.state.email && 
            this.state.district && this.state.districtPartner && this.state.area && 
            this.state.mentor);
        if(!validated){
            alert('All fields must be filled in');
            return;
        }
        if(this._isMounted){
            this.setState({ submitted: true });
        }
        const paidReg = this.state.paidRegistration === 'Yes' ? 1 : 0; 
        var sendUser = {};
        if(this.props.mode === 'edit'){
            sendUser = {
                id: this.state.id,
                first_name: this.state.first_name,
                last_name: this.state.last_name,
                email: this.state.email,
                district: this.state.district,
                districtPartner: this.state.districtPartner,
                area: this.state.area,
                mentor: this.state.mentor,
                paidRegistration: paidReg
            }
            this.props.updateTribute(sendUser);
        } else if(this.props.mode === 'create') {
            sendUser = {
                first_name: this.state.first_name,
                last_name: this.state.last_name,
                email: this.state.email,
                district: this.state.district,
                districtPartner: this.state.districtPartner,
                area: this.state.area,
                mentor: this.state.mentor,
                paidRegistration: paidReg
            }
            this.props.createTribute(sendUser);
        }
        setTimeout(() => this.handleClose(), 1000);
    }

    handleClose = () => {
        if(this._isMounted){
            this.setState({ showModal: false });
            this.props.onSubmitCallback();
        }
    }

    renderModalHeader(){
        if(this.props.mode === 'edit'){
            return 'Edit Tribute';
        } else if(this.props.mode === 'create'){
            return 'Create New Tribute';
        } else {
            return 'Something unexpected happened.';
        }
    }

    render(){
        return(
            <>
                <Modal show={this.state.showModal} onHide={this.handleClose}>
                    <Modal.Header>
                        <Modal.Title>{this.renderModalHeader()}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>{this.renderForm()}</Modal.Body>
                    <Modal.Footer>
                        {this.renderActions()}
                    </Modal.Footer>
                </Modal>
            </>
        );
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

}

export default connect(null, { createTribute, updateTribute })(TributeInfoForm);