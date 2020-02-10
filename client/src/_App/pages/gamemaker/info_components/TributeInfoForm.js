import React from 'react';
import { connect } from 'react-redux';
import { Form, Button, Modal } from 'react-bootstrap';

import { createTribute, updateTribute, fetchTribute } from '../../../../actions';

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
            // Validation
            firstNameValid: 1,
            lastNameValid: 1,
            emailValid: 1,
            phoneValid: 1,
            partnerValid: 1,
            mentorValid: 1,
            formValid: 1,
            // Handle the Modal
            showModal: true,
            submitted: false,
            // API error handling
            apiError: false
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
                paidRegistration: this.props.payload.paidRegistration,
                firstNameValid: 0,
                lastNameValid: 0,
                emailValid: 0,
                phoneValid: 0,
                partnerValid: 0,
                mentorValid: 0
            })
        }
    }

    handleFirstName(event) {
        const input = event.target.value;
        this.setState({ first_name: input });
        if(input === ''){
            return null;
        } else if(input.replace(/\s/) === ''){
            this.setState({ firstNameValid: 2 });
        } else {
            this.setState({ firstNameValid: 0 });
        }
    }
    handleLastName(event) {
        const input = event.target.value;
        this.setState({ last_name: input });
        if(input === ''){
            return null;
        } else if(input.replace(/\s/) === ''){
            this.setState({ lastNameValid: 2 });
        } else {
            this.setState({ lastNameValid: 0 });
        }
    }
    handleEmail(event) {
        const input = event.target.value.toLowerCase();
        this.setState({ email: input });
        if(input.replace(/\s/) === ''){
            this.setState({ emailValid: 2 });
        } else if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(input)){
            this.setState({ emailValid: 3 });
        } else {
            this.setState({ emailValid: 0 });
        }
    }
    handlePhone(event) {
        const input = event.target.value.replace(/\(/g, '').replace(/\)/g, '').replace(/-/g, '').replace(/\s/g, '');
        this.setState({ phone: input });
        if(input === ''){
            this.setState({ phoneValid: 2 });
        } else if(isNaN(input)){
            this.setState({ phoneValid: 3 });
        } else if(input.length < 10){
            this.setState({ phoneValid: 4 });
        } else if(input.length > 10){
            this.setState({ phoneValid: 5 });
        } else {
            this.setState({ phoneValid: 0 });
        }
    }
    handleDistrict(event) {
        this.setState({ district: event.target.value });
    }
    handleDistrictPartner(event) {
        const input = event.target.value.toLowerCase();
        this.setState({ districtPartner: input });
        if(input.replace(/\s/) === ''){
            this.setState({ partnerValid: 2 });
        } else if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(input)){
            this.setState({ partnerValid: 3 });
        } else {
            this.setState({ partnerValid: 0 });
        }
    }
    handleArea(event) {
        this.setState({ area: event.target.value });
    }
    handleMentor(event) {
        const input = event.target.value.toLowerCase();
        this.setState({ mentor: input });
        if(input.replace(/\s/) === ''){
            this.setState({ mentorValid: 2 });
        } else if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(input)){
            this.setState({ mentorValid: 3 });
        } else {
            this.setState({ mentorValid: 0 });
        }
    }
    handlePaidRegistration(event) {
        this.setState({ paidRegistration: event.target.value });
    }    


    handleFormSubmit = async () => {
        if(this.state.firstNameValid === 1){
            this.setState({ firstNameValid: 2 });
        }
        if(this.state.lastNameValid === 1){
            this.setState({ lastNameValid: 2 });
        }
        if(this.state.emailValid === 1){
            this.setState({ emailValid: 2 });
        }
        if(this.state.phoneValid === 1){
            this.setState({ phoneValid: 2 });
        }
        if(this.state.partnerValid === 1){
            this.setState({ partnerValid: 2 });
        }
        if(this.state.mentorValid === 1){
            this.setState({ mentorValid: 2 });
        }

        if(this.state.firstNameValid + this.state.lastNameValid + this.state.emailValid +
            this.state.phoneValid + this.state.partnerValid + this.state.mentorValid !== 0){
            this.setState({ formValid: 2 });
            return null;
        }

        if(this.props.mode === 'create'){
            const response = await this.props.fetchTribute(this.state.email);
            if(!response){
                this.setState({ apiError: true });
                return null;
            }
            if(Object.entries(this.props.tribute).length !== 0){
                this.setState({ emailValid: 4, formValid: 2 });
                return null;
            }
        }

        const sendUser = {
            first_name: encodeURIComponent(this.state.first_name),
            last_name: encodeURIComponent(this.state.last_name),
            email: encodeURIComponent(this.state.email),
            phone: this.state.phone,
            district: this.state.district,
            districtPartner: this.state.districtPartner,
            area: this.state.area,
            mentor: this.state.mentor,
            paidRegistration: this.state.paidRegistration
        }

        var error = false;
        if(this.props.mode === 'edit'){
            sendUser.id = this.state.id;
            const response = await this.props.updateTribute(sendUser);
            if(!response){
                this.setState({ apiError: true });
                error = true;
            }
        } else if(this.props.mode === 'create') {
            const response = await this.props.createTribute(sendUser);
            if(!response){
                this.setState({ apiError: true });
                error = true;
            }
        }

        if(error){
            return null;
        }

        if(this._isMounted){
            this.setState({ submitted: true });
        }

        setTimeout(() => this.handleClose(), 1000);
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

    renderForm = () => {
        if(this.state.submitted) {
            const message = this.props.mode === 'edit' ? 'Updated' : 'Created';
            return(
                <h5>Tribute {message} Successfully!</h5>
            );
        } else if(this.props.mode === 'edit' && !this.props.tribute.email){
            return <h3>An error occured while retrieving tribute data. Please try again.</h3> 
        } 
        return (
            <Form>
                <Form.Row>
                    <div className="col-6"><Form.Group controlId="first-name">
                        <Form.Label>First Name*</Form.Label>
                        <Form.Control value={this.state.first_name}
                            onChange={this.handleFirstName}
                            autoComplete="off"
                        />
                        {this.renderFirstNameValidation()}
                    </Form.Group></div>
                    <div className="col-6"><Form.Group controlId="last-name">
                        <Form.Label>Last Name*</Form.Label>
                        <Form.Control value={this.state.last_name}
                            onChange={this.handleLastName}
                            autoComplete="off"
                        />
                        {this.renderLastNameValidation()}
                    </Form.Group></div>
                </Form.Row>
                <Form.Row>
                    <div className="col-12"><Form.Group controlId="email">
                        <Form.Label>Email*</Form.Label>
                        <Form.Control defaultValue={this.state.email}
                            onChange={this.handleEmail}
                            autoComplete="off"
                        />
                        {this.renderEmailValidation()}
                    </Form.Group></div>
                </Form.Row>
                <Form.Row>
                    <div className="col-12"><Form.Group controlId="phone">
                        <Form.Label>Phone Number*</Form.Label>
                        <Form.Control defaultValue={this.state.phone}
                            onChange={this.handlePhone}
                            autoComplete="off"
                        />
                        {this.renderPhoneValidation()}
                    </Form.Group></div>
                </Form.Row>
                <Form.Row>
                    <div className="col-12"><Form.Group controlId="partner-email">
                        <Form.Label>District Partner Email*</Form.Label>
                        <Form.Control defaultValue={this.state.districtPartner}
                            onChange={this.handleDistrictPartner}
                            autoComplete="off"
                        />
                        {this.renderPartnerValidation()}
                    </Form.Group></div>
                </Form.Row>
                <Form.Row>
                    <div className="col-12"><Form.Group controlId="mentor-email">
                        <Form.Label>Mentor Email*</Form.Label>
                        <Form.Control defaultValue={this.state.mentor}
                            onChange={this.handleMentor}
                            autoComplete="off"
                        />
                        {this.renderMentorValidation()}
                    </Form.Group></div>
                </Form.Row>
                <Form.Row>
                    <div className="col-4"><Form.Group control-group="district">
                        <Form.Label>District*</Form.Label>
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
                        <Form.Label>Area*</Form.Label>
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
                        <Form.Label>Paid Registration?*</Form.Label>
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
    
    renderFirstNameValidation = () => {
        if(this.state.firstNameValid === 2){
            return(
                <p className="coolor-text-red" style={{ fontSize: "8pt" }}>
                    <span role="img" aria-label="check/x">&#10071;</span> First name is required
                </p>
            );
        } else if(this.state.firstNameValid === 0) {
            return(
                <p className="coolor-text-green" style={{ fontSize: "8pt" }}>
                    <span role="img" aria-label="check/x">&#10003;</span> First name
                </p>
            );
        } else {
            return null;
        }
    }
    renderLastNameValidation = () => {
        if(this.state.lastNameValid === 2){
            return(
                <p className="coolor-text-red" style={{ fontSize: "8pt" }}>
                    <span role="img" aria-label="check/x">&#10071;</span> Last name is required
                </p>
            );
        } else if(this.state.lastNameValid === 0) {
            return(
                <p className="coolor-text-green" style={{ fontSize: "8pt" }}>
                    <span role="img" aria-label="check/x">&#10003;</span> Last name
                </p>
            );
        } else {
            return null;
        }
    }
    renderPhoneValidation = () => {
        if(this.state.phoneValid === 2){
            return(
                <p className="coolor-text-red" style={{ fontSize: "8pt" }}>
                    <span role="img" aria-label="check/x">&#10071;</span> Phone number is required
                </p>
            );
        } else if (this.state.phoneValid === 3){
            return(
                <p className="coolor-text-red" style={{ fontSize: "8pt" }}>
                    <span role="img" aria-label="check/x">&#10071;</span> Invalid phone number
                </p>
            );
        } else if(this.state.phoneValid === 4) {
            return(
                <p className="coolor-text-red" style={{ fontSize: "8pt" }}>
                    <span role="img" aria-label="check/x">&#10071;</span> Phone number is too short (should be 10 numbers)
                </p>
            );
        } else if(this.state.phoneValid === 5) {
            return(
                <p className="coolor-text-red" style={{ fontSize: "8pt" }}>
                    <span role="img" aria-label="check/x">&#10071;</span> Phone number is too long (should be 10 numbers)
                </p>
            );
        } else if(this.state.phoneValid === 0) {
            return(
                <p className="coolor-text-green" style={{ fontSize: "8pt" }}>
                    <span role="img" aria-label="check/x">&#10003;</span> Phone number
                </p>
            );
        } else {
            return null;
        }
    }
    renderEmailValidation = () => {
        if(this.state.emailValid === 2){
            return(
                <p className="coolor-text-red" style={{ fontSize: "8pt" }}>
                    <span role="img" aria-label="check/x">&#10071;</span> Tribute email is required
                </p>
            );
        } else if (this.state.emailValid === 3){
            return(
                <p className="coolor-text-red" style={{ fontSize: "8pt" }}>
                    <span role="img" aria-label="check/x">&#10071;</span> Invalid tribute email
                </p>
            );
        } else if (this.state.emailValid === 4){
            return(
                <p className="coolor-text-red" style={{ fontSize: "8pt" }}>
                    <span role="img" aria-label="check/x">&#10071;</span> This email is already registered
                </p>
            );
        } else if(this.state.emailValid === 0) {
            return(
                <p className="coolor-text-green" style={{ fontSize: "8pt" }}>
                    <span role="img" aria-label="check/x">&#10003;</span> Tribute email
                </p>
            );
        } else {
            return null;
        }
    }
    renderPartnerValidation = () => {
        if(this.state.partnerValid === 2){
            return(
                <p className="coolor-text-red" style={{ fontSize: "8pt" }}>
                    <span role="img" aria-label="check/x">&#10071;</span> Partner email is required
                </p>
            );
        } else if (this.state.partnerValid === 3){
            return(
                <p className="coolor-text-red" style={{ fontSize: "8pt" }}>
                    <span role="img" aria-label="check/x">&#10071;</span> Invalid partner email
                </p>
            );
        } else if(this.state.partnerValid === 0) {
            return(
                <p className="coolor-text-green" style={{ fontSize: "8pt" }}>
                    <span role="img" aria-label="check/x">&#10003;</span> Partner email
                </p>
            );
        } else {
            return null;
        }
    }
    renderMentorValidation = () => {
        if(this.state.mentorValid === 2){
            return(
                <p className="coolor-text-red" style={{ fontSize: "8pt" }}>
                    <span role="img" aria-label="check/x">&#10071;</span> Mentor email is required
                </p>
            );
        } else if (this.state.mentorValid === 3){
            return(
                <p className="coolor-text-red" style={{ fontSize: "8pt" }}>
                    <span role="img" aria-label="check/x">&#10071;</span> Invalid mentor email
                </p>
            );
        } else if(this.state.mentorValid === 0) {
            return(
                <p className="coolor-text-green" style={{ fontSize: "8pt" }}>
                    <span role="img" aria-label="check/x">&#10003;</span> Mentor email
                </p>
            );
        } else {
            return null;
        }
    }
    renderFormValidation = () => {
        if(this.state.submitted){
            return null;
        } else if(this.props.mode === 'edit' && !this.props.tribute.email){
            return null;
        } 
        if(this.state.firstNameValid + this.state.lastNameValid + this.state.emailValid + 
            this.state.phoneValid + this.state.partnerValid + this.state.mentorValid === 0) {
            return(
                <p className="coolor-text-green" style={{ fontSize: "12pt" }}>
                    <span role="img" aria-label="check/x">&#10003;</span> Ready to submit? 
                </p>
            );
        } else if(this.state.formValid === 2){
            return(
                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                    <p className="coolor-text-red" style={{ fontSize: "12pt" }}>
                        <span role="img" aria-label="check/x">&#10071;</span> Please fix the indicated fields.
                    </p>
                </div>
            );
        } else {
            return null;
        }
    }

    renderActions = () => {
        if(this.state.submitted){
            return null;
        } else {
            return(
                <>
                    {this.renderApiError()}
                    <Button variant="danger" onClick={this.handleClose}>Cancel</Button>
                    <Button variant="info" onClick={this.handleFormSubmit}>Confirm</Button>
                </>
            );
        }
    }

    handleClose = () => {
        if(this._isMounted){
            this.setState({ showModal: false });
        }
        this.props.onSubmitCallback();
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
        console.log(this.state);
        return(
            <>
                <Modal show={this.state.showModal} onHide={this.handleClose}>
                    <Modal.Header>
                        <Modal.Title>{this.renderModalHeader()}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>{this.renderForm()}</Modal.Body>
                    <Modal.Footer>
                        {this.renderFormValidation()}
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

const mapStateToProps = state => {
    return {
        tribute: state.selectedTribute
    };
}

export default connect(mapStateToProps, { createTribute, updateTribute, fetchTribute })(TributeInfoForm);