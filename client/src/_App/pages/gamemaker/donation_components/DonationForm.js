import React from 'react';
import { connect } from 'react-redux';
import { Form, Button, Modal } from 'react-bootstrap';
import DatePicker from 'react-datepicker';

import { 
    fetchDonation, 
    createDonation, 
    updateDonation,
    donationUpdateTributeStats
} from '../../../../actions';

class DonationForm extends React.Component {
    _isMounted = false;

    constructor(props){
        super(props);
        const now = new Date();
        const year = now.getFullYear();
        const month = (now.getMonth() + 1).toLocaleString(undefined, {minimumIntegerDigits: 2});
        const day = now.getDate().toLocaleString(undefined, {minimumIntegerDigits: 2});

        this.state = {
            tribute_email: '',
            donor_name: '',
            method: '',
            date: `${year}-${month}-${day}`,
            dateFormatted: `${month}-${day}-${year}`,
            originalAmount: '',
            amount: '',
            tags: '',
            // Validation
            emailValid: 1,
            donorValid: 1,
            methodValid: 1,
            amountValid: 1,
            formValid: 1,
            // Handle the Modal
            showModal: true,
            submitted: false
        };

        this.handleTribute = this.handleTribute.bind(this);
        this.handleDonor = this.handleDonor.bind(this);
        this.handleMethod = this.handleMethod.bind(this);
        this.handleDate = this.handleDate.bind(this);
        this.handleAmount = this.handleAmount.bind(this);
        this.handleTags = this.handleTags.bind(this);
    }

    async componentDidMount(){
        this._isMounted = true;
        if(this.props.mode === 'edit'){
            const response = await this.props.fetchDonation(this.props.id);
            if(!response){
                this.setState({ apiError: true });
                return;
            }

            const donation = this.props.donation;
            
            var [year, month, day] = donation.date.split('-');
            day = day.split('T')[0];
            if(this._isMounted){
                this.setState({
                    tribute_email: donation.tribute_email,
                    donor_name: donation.donor_name,
                    date: `${year}-${month}-${day}`,
                    dateFormatted: `${month}-${day}-${year}`,
                    method: donation.method,
                    originalAmount: donation.amount,
                    amount: donation.amount,
                    tags: donation.tags,
                    emailValid: 0,
                    methodValid: 0,
                    donorValid: 0,
                    amountValid: 0
                })
            }
        }
    }

    handleTribute(event){
        const input = event.target.value;
        this.setState({ tribute_email: input });
        if(input === ''){
            this.setState({ emailValid: 2 });
        } else {
            this.setState({ emailValid: 0 });
        }
    }
    handleDonor(event){
        const input = event.target.value;
        this.setState({ donor_name: input });
        if(input.replace(/\s/g, '') === ''){
            this.setState({ donorValid: 2 });
        } else {
            this.setState({ donorValid: 0 });
        }
    }
    handleMethod(event){
        const input = event.target.value;
        this.setState({ method: input });
        if(input.replace(/\s/g, '') === ''){
            this.setState({ methodValid: 2 });
        } else {
            this.setState({ methodValid: 0 });
        }
    }
    handleDate(date){
        const day = date.getDate().toLocaleString(undefined, { minimumIntegerDigits: 2 });
        const month = (date.getMonth() + 1).toLocaleString(undefined, { minimumIntegerDigits: 2 });
        const year = date.getFullYear();
        this.setState({ 
            date: `${year}-${month}-${day}`,
            dateFormatted: `${month}-${day}-${year}`
        });
    }
    handleAmount(event){
        const input = event.target.value
        this.setState({ amount: input });
        if(input === ''){
            this.setState({ amountValid: 2 });
        } else if(isNaN(input)){
            this.setState({ amountValid: 3 });
        } else if(Math.floor(input) <= 0){
            this.setState({ amountValid: 4 });
        } else {
            this.setState({ amountValid: 0 });
        }
    }
    handleTags(event){
        this.setState({ tags: event.target.value });
    }

    handleFormSubmit = async () => {
        if(this.state.emailValid === 1){
            this.setState({ emailValid: 2 });
        }
        if(this.state.donorValid === 1){
            this.setState({ donorValid: 2 });
        }
        if(this.state.methodValid === 1){
            this.setState({ methodValid: 2 });
        }
        if(this.state.amountValid === 1){
            this.setState({ amountValid: 2 });
        }

        if(this.state.emailValid + this.state.donorValid + this.state.methodValid + this.state.amountValid !== 0){
            this.setState({ formValid: 2 });
            return null;
        }

        const donationObject = {
            email: this.state.tribute_email,
            donor: encodeURIComponent(this.state.donor_name),
            method: encodeURIComponent(this.state.method),
            date: this.state.date,
            amount: this.state.amount,
            tags: encodeURIComponent(this.state.tags) 
        };
        if (!donationObject.tags.replace(/\s/g, '').length) {
            donationObject.tags = 'none';
        }

        if(this.props.mode === 'edit'){
            donationObject.id = this.props.id;
            const response = await this.props.updateDonation(donationObject);
            if(!response){
                this.setState({ apiError: true });
                return null;
            }
        } else if(this.props.mode === 'create'){
            const response = await this.props.createDonation(donationObject);
            if(!response){
                this.setState({ apiError: true });
                return null;
            }
        }

        const response = await this.props.donationUpdateTributeStats(this.state.tribute_email, this.state.amount - this.state.originalAmount);
        if(!response){
            this.setState({ apiError: true });
            return null;
        }

        if(this._isMounted){
            this.setState({ submitted: true })
        }

        setTimeout(() => this.handleClose(), 1000);
    }

    renderModalHeader(){
        if(this.props.mode === 'edit'){
            return 'Edit Donation Info';
        } else if(this.props.mode === 'create'){
            return 'Enter Donation Info';
        } else {
            return 'Something unexpected happened';
        }
    }

    renderModalBody(){
        const message = this.props.mode === 'edit' ? 'edited' : 'created';
        if(this.state.submitted){
            return(
                <h4>Donation {message} successfully!</h4>
            );
        } else if(this.props.mode === 'edit' && !this.props.donation.tribute_email){
            return <h3>An error occured while retrieving donation data. Please try again.</h3> 
        } else {
            return <>{this.renderForm()}</>
        }
    }

    renderForm(){
        return(
            <Form>
                <Form.Row>
                    <div className="col-4"><Form.Group controlId="date">
                        <Form.Label>Donation Date*</Form.Label>
                        <DatePicker dateFormat="MM-dd-yyyy" 
                            value={this.state.dateFormatted}
                            onSelect={this.handleDate}
                        />
                    </Form.Group></div>
                </Form.Row>
                <Form.Row>
                    <div className="col-12"><Form.Group controlId="tribute">
                        <Form.Label>Tribute Name*</Form.Label>    
                        <Form.Control 
                            value={this.state.tribute_email} 
                            onChange={this.handleTribute} 
                            as="select"
                            disabled={this.props.mode === "edit"}
                        >
                            {this.renderNameChoices()}
                        </Form.Control>
                        {this.renderEmailValidation()}
                    </Form.Group></div>
                </Form.Row>
                <Form.Row>
                    <div className="col-12"><Form.Group controlId="donor">
                        <Form.Label>Donor Name*</Form.Label>    
                        <Form.Control 
                            value={this.state.donor_name}
                            autoComplete="off"
                            onChange={this.handleDonor}
                        />
                        {this.renderDonorValidation()}
                    </Form.Group></div>
                </Form.Row>
                <Form.Row>
                    <div className="col-6"><Form.Group controlId="method">
                        <Form.Label>Donation Method*</Form.Label>    
                        <Form.Control 
                            value={this.state.method}
                            onChange={this.handleMethod}
                            autoComplete="off"
                        />
                        {this.renderMethodValidation()}
                    </Form.Group></div>
                    <div className="col-6"><Form.Group controlId="amount">
                        <Form.Label>Amount*</Form.Label>    
                        <Form.Control 
                            value={this.state.amount}
                            onChange={this.handleAmount}
                            autoComplete="off"
                        />
                        {this.renderAmountValidation()}
                    </Form.Group></div>
                </Form.Row>
                <Form.Row>
                    <div className="col-12"><Form.Group controlId="tags">
                        <Form.Label>Tags</Form.Label>    
                        <Form.Control 
                            value={this.state.tags}
                            autoComplete="off"
                            onChange={this.handleTags}
                        />
                    </Form.Group></div>
                </Form.Row>
            </Form>
        );
    }

    renderEmailValidation = () =>{
        if(this.state.emailValid === 2){
            return(
                <p className="coolor-text-red" style={{ fontSize: "8pt" }}>
                    <span role="img" aria-label="check/x">&#10071;</span> Email is required
                </p>
            );
        } else if(this.state.emailValid === 0) {
            return(
                <p className="coolor-text-green" style={{ fontSize: "8pt" }}>
                    <span role="img" aria-label="check/x">&#10003;</span> Tribute
                </p>
            );
        } else {
            return null;
        }
    }
    renderDonorValidation = () =>{
        if(this.state.donorValid === 2){
            return(
                <p className="coolor-text-red" style={{ fontSize: "8pt" }}>
                    <span role="img" aria-label="check/x">&#10071;</span> Donor name is required
                </p>
            );
        } else if(this.state.donorValid === 0) {
            return(
                <p className="coolor-text-green" style={{ fontSize: "8pt" }}>
                    <span role="img" aria-label="check/x">&#10003;</span> Donor name
                </p>
            );
        } else {
            return null;
        }
    }
    renderMethodValidation = () =>{
        if(this.state.methodValid === 2){
            return(
                <p className="coolor-text-red" style={{ fontSize: "8pt" }}>
                    <span role="img" aria-label="check/x">&#10071;</span> Donation method is required
                </p>
            );
        } else if(this.state.methodValid === 0) {
            return(
                <p className="coolor-text-green" style={{ fontSize: "8pt" }}>
                    <span role="img" aria-label="check/x">&#10003;</span> Method
                </p>
            );
        } else {
            return null;
        }
    }
    renderAmountValidation = () =>{
        if(this.state.amountValid === 2){
            return(
                <p className="coolor-text-red" style={{ fontSize: "8pt" }}>
                    <span role="img" aria-label="check/x">&#10071;</span> Amount is required
                </p>
            );
        } else if (this.state.amountValid === 3){
            return(
                <p className="coolor-text-red" style={{ fontSize: "8pt" }}>
                    <span role="img" aria-label="check/x">&#10071;</span> Amount must be a number
                </p>
            );
        } else if(this.state.amountValid === 4) {
            return(
                <p className="coolor-text-red" style={{ fontSize: "8pt" }}>
                    <span role="img" aria-label="check/x">&#10071;</span> Amount must be positive
                </p>
            );
        } else if(this.state.amountValid === 0) {
            return(
                <p className="coolor-text-green" style={{ fontSize: "8pt" }}>
                    <span role="img" aria-label="check/x">&#10003;</span> Amount
                </p>
            );
        } else {
            return null;
        }
    }
    renderFormValidation = () =>{
        if(this.state.submitted){
            return null;
        } else if(this.props.mode === 'edit' && !this.props.donation.tribute_email){
            return null;
        } 
        if(this.state.emailValid + this.state.donorValid + 
            this.state.methodValid + this.state.amountValid === 0) {
            return(
                <p className="coolor-text-green" style={{ fontSize: "12pt" }}>
                    <span role="img" aria-label="check/x">&#10003;</span> Ready to submit?
                </p>
            );
        } else if(this.state.formValid === 2){
            return(
                <p className="coolor-text-red" style={{ fontSize: "12pt" }}>
                    <span role="img" aria-label="check/x">&#10071;</span> Please fix the indicated fields
                </p>
            );
        } else {
            return null;
        }
    }

    renderNameChoices(){
        const tributes = this.props.tributes;
        tributes.sort((a, b) => {
            if(a.first_name > b.first_name) return 1;
            else if(a.first_name < b.first_name) return -1;
            else return 0;
        })
        return (
        <>
            <option value="">Please select a recipient...</option>
            <option value="No Assignment">No Assignment</option>
            {tributes.map(tribute => {
                return (
                <option key={tribute.id} value={tribute.email}>
                    {tribute.first_name} {tribute.last_name} || {tribute.email}
                </option>
                );
            })}
        </>
        );
    }

    renderModalFooter(){
        if(this.state.submitted){
            return null;
        }
        return(
            <>
                {this.renderApiError()}
                <Button variant="danger" onClick={this.handleClose}>Cancel</Button>
                <Button variant="info" onClick={this.handleFormSubmit}>Submit</Button>
            </>
        );
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

    handleClose = () => {
        if(this._isMounted){
            this.setState({ showModal: false });
            this.props.onSubmitCallback();
        }
    }

    render = () => {
        console.log(this.state);
        return(
            <Modal show={this.state.showModal} onHide={this.handleClose}>
                <Modal.Header>
                    <Modal.Title>{this.renderModalHeader()}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {this.renderModalBody()}
                </Modal.Body>
                <Modal.Footer>
                    {this.renderFormValidation()}
                    {this.renderModalFooter()}
                </Modal.Footer>
            </Modal>
        );
    }

    componentWillUnmount(){
        this._isMounted = false;
    }
}

const mapStateToProps = state => {
    return {
        donation: state.selectedDonation
    };
}

export default connect(mapStateToProps, { 
    fetchDonation, 
    createDonation, 
    updateDonation,
    donationUpdateTributeStats
})(DonationForm);