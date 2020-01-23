import React from 'react';
import { connect } from 'react-redux';
import { Form, Button, Modal } from 'react-bootstrap';
import DatePicker from 'react-datepicker';

import { fetchDonation, createDonation, updateDonation } from '../../../../actions';

class DonationForm extends React.Component {
    _isMounted = false;

    constructor(props){
        super(props);
        const now = new Date();
        const year = now.getFullYear();
        const month = (now.getMonth() + 1).toLocaleString(undefined, {minimumIntegerDigits: 2});
        const day = now.getDate().toLocaleString(undefined, {minimumIntegerDigits: 2});

        this.state = {
            tribute_email: 'No Assignment',
            donor_name: '',
            method: '',
            date: `${year}-${month}-${day}`,
            us_date: `${month}-${day}-${year}`,
            amount: '',
            tags: '',
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
            await this.props.fetchDonation(this.props.id);
            
            const dmy = this.props.donation.date.split('-');
            if(this._isMounted){
                this.setState({
                    tribute_email: this.props.donation.tribute_email,
                    donor_name: this.props.donation.donor_name,
                    date: `${dmy[2]}-${dmy[0]}-${dmy[1]}`,
                    us_date: `${dmy[0]}-${dmy[1]}-${dmy[2]}`,
                    method: this.props.donation.method,
                    amount: this.props.donation.amount,
                    tags: this.props.donation.tags
                })
            }
        }
    }

    handleTribute(event){
        if(event.target.value === 'No Assignment'){
            this.setState({ tribute_email: event.target.value });
        } else {
            this.setState({ tribute_email: event.target.value.split('|| ')[1] })
        }
    }
    handleDonor(event){
        this.setState({ donor_name: event.target.value });
    }
    handleMethod(event){
        this.setState({ method: event.target.value });
    }
    handleDate(date){
        const day = date.getDate().toLocaleString(undefined, {minimumIntegerDigits: 2});
        const month = (date.getMonth() + 1).toLocaleString(undefined, {minimumIntegerDigits: 2});
        const year = date.getFullYear();
        this.setState({ 
            date: `${year}-${month}-${day}`,
            us_date: `${month}-${day}-${year}`
        });
    }
    handleAmount(event){
        this.setState({ amount: event.target.value });
    }
    handleTags(event){
        this.setState({ tags: event.target.value });
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

    renderNameChoices(){
        return (
        <>
            <option>No Assignment</option>
            {this.props.tributes.map(tribute => {
                return (
                <option key={tribute.id}>
                    {tribute.first_name} {tribute.last_name} || {tribute.email}
                </option>
                );
            })}
        </>
        );
    }

    renderForm(){
        return(
            <Form>
                <Form.Row>
                    <div className="col-4"><Form.Group controlId="date">
                        <Form.Label>Donation Date</Form.Label>
                        <DatePicker dateFormat="MM-dd-yyyy" 
                            value={this.state.us_date}
                            onSelect={this.handleDate}
                        />
                    </Form.Group></div>
                </Form.Row>
                <Form.Row>
                    <div className="col-12"><Form.Group controlId="tribute">
                        <Form.Label>Tribute Name</Form.Label>    
                        <Form.Control 
                            defaultValue={this.state.tribute_email} 
                            onChange={this.handleTribute} 
                            as="select" autoComplete="off"
                        >
                            {this.renderNameChoices()}
                        </Form.Control>
                    </Form.Group></div>
                </Form.Row>
                <Form.Row>
                    <div className="col-12"><Form.Group controlId="donor">
                        <Form.Label>Donor Name</Form.Label>    
                        <Form.Control 
                            defaultValue={this.state.donor_name}
                            autoComplete="off"
                            onChange={this.handleDonor}
                        />
                    </Form.Group></div>
                </Form.Row>
                <Form.Row>
                    <div className="col-6"><Form.Group controlId="method">
                        <Form.Label>Donation Method</Form.Label>    
                        <Form.Control 
                            defaultValue={this.state.method}
                            onChange={this.handleMethod}
                            autoComplete="off"
                        />
                    </Form.Group></div>
                    <div className="col-6"><Form.Group controlId="amount">
                        <Form.Label>Amount</Form.Label>    
                        <Form.Control 
                            defaultValue={this.state.amount}
                            onChange={this.handleAmount}
                            autoComplete="off"
                        />
                    </Form.Group></div>
                </Form.Row>
                <Form.Row>
                    <div className="col-12"><Form.Group controlId="tags">
                        <Form.Label>Tags</Form.Label>    
                        <Form.Control 
                            defaultValue={this.state.tags}
                            autoComplete="off"
                            onChange={this.handleTags}
                        />
                    </Form.Group></div>
                </Form.Row>
            </Form>
        );
    }

    renderModalFooter(){
        if(this.state.submitted){
            return null;
        }
        return(
            <Form.Row>
                <Button variant="danger" onClick={this.handleClose}>Cancel</Button>
                <Button variant="info" onClick={this.handleFormSubmit}>Submit</Button>
            </Form.Row>
        );
    }

    handleFormSubmit = () => {
        if(!this.state.date || !this.state.tribute_email || !this.state.donor_name ||
            !this.state.method || !this.state.amount){
                alert('Please fill in the required fields');
                return;
            }

        if(this._isMounted){
            this.setState({ submitted: true })
        }

        if(this.props.mode === 'edit'){
            const donationObject = {
                id: this.props.id,
                email: this.state.tribute_email,
                donor: this.state.donor_name,
                method: this.state.method,
                date: this.state.date,
                amount: this.state.amount,
                tags: this.state.tags
            };
            this.props.updateDonation(donationObject);
        } else if(this.props.mode === 'create'){
            const donationObject = {
                email: this.state.tribute_email,
                donor: this.state.donor_name,
                method: this.state.method,
                date: this.state.date,
                amount: this.state.amount,
                tags: this.state.tags
            };
            this.props.createDonation(donationObject);
        }
        setTimeout(() => this.handleClose(), 1000);
    }

    handleClose = () => {
        if(this._isMounted){
            this.setState({ showModal: false });
            this.props.onSubmitCallback();
        }
    }

    render(){
        return(
            <Modal show={this.state.showModal} onHide={this.handleClose}>
                <Modal.Header>
                    <Modal.Title>{this.renderModalHeader()}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {this.renderModalBody()}
                </Modal.Body>
                <Modal.Footer>
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
    fetchDonation, createDonation, updateDonation 
})(DonationForm);