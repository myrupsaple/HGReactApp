import React from 'react';
import { connect } from 'react-redux';
import { Form, Button, Modal } from 'react-bootstrap';

import { createTribute, updateTribute } from '../../../../actions';

class TributeInfoForm extends React.Component {
    _isMounted = false;

    constructor(props){
        super(props);

        this.state = {
            first_name: '',
            last_name: '',
            email: '',
            phone: '',
            district: 1,
            districtPartner: '',
            area: 'dank_denykstra',
            mentor: '',
            paidRegistration: 1,
            showModal: true,
            submitted: false
        }

        this.handleFirstName = this.handleFirstName.bind(this);
        this.handleLastName = this.handleLastName.bind(this);
        this.handleEmail = this.handleEmail.bind(this);
        this.handlePhone = this.handlePhone.bind(this);
        this.handleDistrict = this.handleDistrict.bind(this);
        this.handleDistrictPartner = this.handleDistrictPartner.bind(this);
        this.handleArea = this.handleArea.bind(this);
        this.handleMentor = this.handleMentor.bind(this);
        this.handlePaidRegistration = this.handlePaidRegistration.bind(this);

        this.handleClose = this.handleClose.bind(this);
        this.handleFormSubmit = this.handleFormSubmit.bind(this);
    }

    componentDidMount(){
        this._isMounted = true;

        if(this.props.mode === 'edit' && this._isMounted){
            this.setState({
                id: this.props.payload.id,
                first_name: this.props.payload.first_name,
                last_name: this.props.payload.last_name,
                email: this.props.payload.email,
                phone: this.props.payload.phone,
                district: this.props.payload.district,
                districtPartner: this.props.payload.districtPartner,
                area: this.props.payload.area,
                mentor: this.props.payload.mentor,
                paidRegistration: this.props.payload.paidRegistration
            })
        }
    }

    handleFirstName(event) {
        this.setState({ first_name: event.target.value });
    }
    handleLastName(event) {
        this.setState({ last_name: event.target.value });
    }
    handleEmail(event) {
        this.setState({ email: event.target.value.toLowerCase() });
    }
    handlePhone(event) {
        this.setState({ phone: event.target.value.replace(/\D/g,'') });
    }
    handleDistrict(event) {
        this.setState({ district: event.target.value });
    }
    handleDistrictPartner(event) {
        this.setState({ districtPartner: event.target.value.toLowerCase() });
    }
    handleArea(event) {
        this.setState({ area: event.target.value });
    }
    handleMentor(event) {
        this.setState({ mentor: event.target.value.toLowerCase() });
    }
    handlePaidRegistration(event) {
        this.setState({ paidRegistration: event.target.value });
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
                        <Form.Control value={this.state.first_name}
                            onChange={this.handleFirstName}
                            autoComplete="off"
                        />
                    </Form.Group></div>
                    <div className="col-6"><Form.Group controlId="last-name">
                        <Form.Label>Last Name</Form.Label>
                        <Form.Control value={this.state.last_name}
                            onChange={this.handleLastName}
                            autoComplete="off"
                        />
                    </Form.Group></div>
                </Form.Row>
                <Form.Row>
                    <div className="col-12"><Form.Group controlId="email">
                        <Form.Label>Email</Form.Label>
                        <Form.Control defaultValue={this.state.email}
                            onChange={this.handleEmail}
                            autoComplete="off"
                        />
                    </Form.Group></div>
                </Form.Row>
                <Form.Row>
                    <div className="col-12"><Form.Group controlId="phone">
                        <Form.Label>Phone Number</Form.Label>
                        <Form.Control defaultValue={this.state.phone}
                            onChange={this.handlePhone}
                            autoComplete="off"
                        />
                    </Form.Group></div>
                </Form.Row>
                <Form.Row>
                    <div className="col-12"><Form.Group controlId="partner-email">
                        <Form.Label>District Partner Email</Form.Label>
                        <Form.Control defaultValue={this.state.districtPartner}
                            onChange={this.handleDistrictPartner}
                            autoComplete="off"
                        />
                    </Form.Group></div>
                </Form.Row>
                <Form.Row>
                    <div className="col-12"><Form.Group controlId="mentor-email">
                        <Form.Label>Mentor Email</Form.Label>
                        <Form.Control defaultValue={this.state.mentor}
                            onChange={this.handleMentor}
                            autoComplete="off"
                        />
                    </Form.Group></div>
                </Form.Row>
                <Form.Row>
                    <div className="col-4"><Form.Group control-group="district">
                        <Form.Label>District</Form.Label>
                        <Form.Control 
                            value={this.state.district}
                            onChange={this.handleDistrict}
                            as="select"
                        >
                            {/* TODO: Make this dynamic */}
                            <option value={1}>1</option>
                            <option value={2}>2</option>
                            <option value={3}>3</option>
                            <option value={4}>4</option>
                            <option value={5}>5</option>
                            <option value={6}>6</option>
                            <option value={7}>7</option>
                            <option value={8}>8</option>
                        </Form.Control>
                    </Form.Group></div>
                    <div className="col-4"><Form.Group control-group="area">
                        <Form.Label>Area</Form.Label>
                        <Form.Control
                            value={this.state.area}
                            onChange={this.handleArea}
                            as="select"
                        >
                            {/* TODO: Make this dynamic */}
                            <option value="dank_denykstra">Dank Denykstra</option>
                            <option value="sunsprout">SunSprout</option>
                            <option value="hedrick">Hedrick</option>
                            <option value="rieber">Rieber</option>
                            <option value="off_campus">Off Campus</option>
                        </Form.Control>
                    </Form.Group></div>  
                    <div className="col-4"><Form.Group control-group="paid-registration">
                        <Form.Label>Paid Registration?</Form.Label>
                        <Form.Control
                            value={this.state.paidRegistration}
                            onChange={this.handlePaidRegistration}
                            as="select"
                        >
                            <option value={1}>Yes</option>
                            <option value={0}>No</option>
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
            this.state.phone && this.state.district && this.state.districtPartner && 
            this.state.area && this.state.mentor);
        if(!validated){
            alert('All fields must be filled in');
            return;
        }
        if(this._isMounted){
            this.setState({ submitted: true });
        }
        const sendUser = {
            first_name: this.state.first_name,
            last_name: this.state.last_name,
            email: this.state.email,
            phone: this.state.phone,
            district: this.state.district,
            districtPartner: this.state.districtPartner,
            area: this.state.area,
            mentor: this.state.mentor,
            paidRegistration: this.state.paidRegistration
        }
        if(this.props.mode === 'edit'){
            sendUser.id = this.state.id;
            this.props.updateTribute(sendUser);
        } else if(this.props.mode === 'create') {
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

    render = () => {
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