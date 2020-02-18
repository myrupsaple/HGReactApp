import React from 'react';
import { connect } from 'react-redux';
import { Form, Button, Modal } from 'react-bootstrap';
import DatePicker from 'react-datepicker';

import { 
    fetchGlobalEvent, 
    createGlobalEvent, 
    updateGlobalEvent
} from '../../../../actions';

class GameEventForm extends React.Component {
    _isMounted = false;

    constructor(props){
        super(props);
        const now = new Date();
        const hours = now.getHours();
        const minutes = now.getMinutes();
        const time1Formatted = `${hours.toLocaleString(undefined, { minimumIntegerDigits: 2 })}:${minutes.toLocaleString(undefined, { minimumIntegerDigits: 2 })}`;
        const time2Formatted = `${(hours + 1).toLocaleString(undefined, { minimumIntegerDigits: 2 })}:${minutes.toLocaleString(undefined, { minimumIntegerDigits: 2 })}`;

        const time = hours * 60 + minutes;

        this.state = {
            type: '',
            description: '',
            message: '',
            time1: time,
            time1Formatted: time1Formatted,
            time2: time + 60,
            time2Formatted: time2Formatted,
            code1: '',
            code2: '',
            status: 'hidden',
            // Validation
            typeValid: 1,
            descriptionValid: 1,
            messageValid: 1,
            formValid: 1,
            // Handle the Modal
            showModal: true,
            submitted: false
        };

        this.handleType = this.handleType.bind(this);
        this.handleDescription = this.handleDescription.bind(this);
        this.handleMessage = this.handleMessage.bind(this);
        this.handleTime1 = this.handleTime1.bind(this);
        this.handleTime2 = this.handleTime2.bind(this);
    }

    async componentDidMount(){
        this._isMounted = true;
        if(this.props.mode === 'edit'){
            const response = await this.props.fetchGlobalEvent(this.props.id);
            if(!response){
                this.setState({ apiError: true });
                return;
            }

            const globalEvent = this.props.globalEvent;
            const time1Hours = Math.floor(globalEvent.notification_time / 60).toLocaleString(undefined, { minimumIntegerDigits: 2 });
            const time1Minutes = (globalEvent.notification_time % 60).toLocaleString(undefined, { minimumIntegerDigits: 2 });
            const time2Hours = Math.floor(globalEvent.event_end_time / 60).toLocaleString(undefined, { minimumIntegerDigits: 2 });
            const time2Minutes = (globalEvent.event_end_time % 60).toLocaleString(undefined, { minimumIntegerDigits: 2 });
            
            if(this._isMounted){
                this.setState({
                    type: globalEvent.type,
                    description: globalEvent.description,
                    message: globalEvent.message,
                    time1: globalEvent.notification_time,
                    time1Formatted: `${time1Hours}:${time1Minutes}`,
                    time2: globalEvent.event_end_time,
                    time2Formatted: `${time2Hours}:${time2Minutes}`,
                    code1: globalEvent.start_action_code,
                    code2: globalEvent.end_action_code,
                    status: globalEvent.status,
                    typeValid: 0,
                    descriptionValid: 0,
                    messageValid: 0
                })
            }
        }
    }

    handleType(event){
        const input = event.target.value;
        this.setState({ type: input });
        if(input === ''){
            this.setState({ typeValid: 2 });
        } else {
            this.setState({ typeValid: 0 });
        }

        switch(input){
            case '':
                this.setState({ code1: 0, code2: 0 });
                break;
            case 'food_required':
                this.setState({ code1: 1, code2: 2 });
                break;
            case 'water_required':
                this.setState({ code1: 3, code2: 4 });
                break;
            case 'medicine_required':
                this.setState({ code1: 5, code2: 6 });
                break;
            case 'announcement':
                this.setState({ code1: 8, code2: 0 });
                break;

        }
    }
    handleDescription(event){
        const input = event.target.value;
        this.setState({ description: input });
        if(input.replace(/\s/g, '') === ''){
            this.setState({ descriptionValid: 2 });
        } else {
            this.setState({ descriptionValid: 0 });
        }
    }
    handleMessage(event){
        const input = event.target.value;
        this.setState({ message: input });
        if(input.replace(/\s/g, '') === ''){
            this.setState({ messageValid: 2 });
        } else {
            this.setState({ messageValid: 0 });
        }
    }
    handleTime1(date){
        const hours = date.getHours();
        const minutes = date.getMinutes();
        console.log(hours * 60 + minutes);
        const timeFormatted = `${hours.toLocaleString(undefined, { minimumIntegerDigits: 2 })}:${minutes.toLocaleString(undefined, { minimumIntegerDigits: 2 })}`
        this.setState({ 
            time1: hours * 60 + minutes,
            time1Formatted: timeFormatted
        });
    }
    handleTime2(date){
        const hours = date.getHours();
        const minutes = date.getMinutes();
        console.log(hours * 60 + minutes);
        const timeFormatted = `${hours.toLocaleString(undefined, { minimumIntegerDigits: 2 })}:${minutes.toLocaleString(undefined, { minimumIntegerDigits: 2 })}`
        this.setState({ 
            time2: hours * 60 + minutes,
            time2Formatted: timeFormatted
        });
    }

    handleFormSubmit = async () => {
        if(this.state.typeValid === 1){
            this.setState({ typeValid: 2 });
        }
        if(this.state.descriptionValid === 1){
            this.setState({ descriptionValid: 2 });
        }
        if(this.state.messageValid === 1){
            this.setState({ messageValid: 2 });
        }

        if(this.state.typeValid + this.state.descriptionValid + this.state.messageValid !== 0){
            this.setState({ formValid: 2 });
            return null;
        }

        const globalEvent = {
            type: this.state.type,
            description: encodeURIComponent(this.state.description),
            message: encodeURIComponent(this.state.message),
            notification_time: this.state.time1,
            event_end_time: this.state.time2,
            start_action_code: this.state.code1,
            end_action_code: this.state.code2
        };
        if (!globalEvent.description.replace(/\s/g, '').length) {
            globalEvent.description = 'none';
        }
        if (!globalEvent.message.replace(/\s/g, '').length) {
            globalEvent.message = 'none';
        }

        if(this.props.mode === 'edit'){
            globalEvent.id = this.props.id;
            globalEvent.status = this.state.status;
            const response = await this.props.updateGlobalEvent(globalEvent);
            if(!response){
                this.setState({ apiError: true });
                return null;
            }
        } else if(this.props.mode === 'create'){
            const response = await this.props.createGlobalEvent(globalEvent);
            if(!response){
                this.setState({ apiError: true });
                return null;
            }
        }

        if(this._isMounted){
            this.setState({ submitted: true })
        }

        setTimeout(() => this.handleClose(), 1000);
    }

    renderModalHeader(){
        if(this.props.mode === 'edit'){
            return 'Edit Global Event';
        } else if(this.props.mode === 'create'){
            return 'Create Global Event';
        } else {
            return 'Something unexpected happened';
        }
    }

    renderModalBody(){
        const message = this.props.mode === 'edit' ? 'edited' : 'created';
        if(this.state.submitted){
            return(
                <h4>Global Event {message} successfully!</h4>
            );
        } else if(this.props.mode === 'edit' && !this.props.globalEvent.type){
            return <h3>An error occured while retrieving global event data. Please try again.</h3> 
        } else {
            return <>{this.renderForm()}</>
        }
    }

    renderForm(){
        return(
            <Form>
                <Form.Row>
                    <div className="col-12"><Form.Group controlId="type">
                        <Form.Label>Event Type*</Form.Label>
                        <Form.Control
                            value={this.state.type}
                            onChange={this.handleType}
                            as="select"
                            disabled={this.state.type.includes('_cost_start')}
                        >
                            <option value="">Please select an event...</option>
                            <option value="food_required">Require Food Resource</option>
                            <option value="water_required">Require Water Resource</option>
                            <option value="medicine_required">Require Medicine Resource</option>
                            <option value="announcement">Schedule an Announcement</option>
                        </Form.Control>
                        {this.renderTypeValidation()}
                    </Form.Group></div>
                </Form.Row>
                <Form.Row>
                    <div className="col-12"><Form.Group controlId="description">
                        <Form.Label>Description*</Form.Label>    
                        <Form.Control 
                            value={this.state.description} 
                            onChange={this.handleDescription} 
                            placeholder="Description of the event"
                        />
                        {this.renderDescriptionValidation()}
                    </Form.Group></div>
                </Form.Row>
                <Form.Row>
                    <div className="col-12"><Form.Group controlId="message">
                        <Form.Label>Message*</Form.Label>    
                        <Form.Control 
                            value={this.state.message}
                            autoComplete="off"
                            onChange={this.handleMessage}
                            placeholder="Message that will be sent to the tributes at the notification time."
                        />
                        {this.renderMessageValidation()}
                    </Form.Group></div>
                </Form.Row>
                <Form.Row>
                    <div className="col-6"><Form.Group controlId="time1">
                        <Form.Label>Notification Time*</Form.Label>    
                        <DatePicker
                            showTimeSelect
                            showTimeSelectOnly
                            value={this.state.time1Formatted}
                            onChange={this.handleTime1}
                            dateFormat="hh:mm aa"
                        />
                    </Form.Group></div>
                    <div className="col-6"><Form.Group controlId="time2">
                        <Form.Label>Event End Time*</Form.Label>    
                        <DatePicker
                            showTimeSelect
                            showTimeSelectOnly
                            value={this.state.time2Formatted}
                            onChange={this.handleTime2}
                            dateFormat="hh:mm aa"
                        />
                    </Form.Group></div>
                </Form.Row>
            </Form>
        );
    }

    renderTypeValidation = () =>{
        if(this.state.typeValid === 2){
            return(
                <p className="coolor-text-red" style={{ fontSize: "8pt" }}>
                    <span role="img" aria-label="check/x">&#10071;</span> Type is required
                </p>
            );
        } else if(this.state.typeValid === 0) {
            return(
                <p className="coolor-text-green" style={{ fontSize: "8pt" }}>
                    <span role="img" aria-label="check/x">&#10003;</span> Type
                </p>
            );
        } else {
            return null;
        }
    }
    renderDescriptionValidation = () =>{
        if(this.state.descriptionValid === 2){
            return(
                <p className="coolor-text-red" style={{ fontSize: "8pt" }}>
                    <span role="img" aria-label="check/x">&#10071;</span> Description is required
                </p>
            );
        } else if(this.state.descriptionValid === 0) {
            return(
                <p className="coolor-text-green" style={{ fontSize: "8pt" }}>
                    <span role="img" aria-label="check/x">&#10003;</span> Description
                </p>
            );
        } else {
            return null;
        }
    }
    renderMessageValidation = () =>{
        if(this.state.messageValid === 2){
            return(
                <p className="coolor-text-red" style={{ fontSize: "8pt" }}>
                    <span role="img" aria-label="check/x">&#10071;</span> Message is required
                </p>
            );
        } else if(this.state.messageValid === 0) {
            return(
                <p className="coolor-text-green" style={{ fontSize: "8pt" }}>
                    <span role="img" aria-label="check/x">&#10003;</span> Message
                </p>
            );
        } else {
            return null;
        }
    }
    renderFormValidation = () =>{
        if(this.state.submitted){
            return null;
        } else if(this.props.mode === 'edit' && !this.props.globalEvent.type){
            return null;
        } 
        if(this.state.typeValid + this.state.descriptionValid + this.state.messageValid === 0) {
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
        globalEvent: state.selectedGlobalEvent
    };
}

export default connect(mapStateToProps, { 
    fetchGlobalEvent, 
    createGlobalEvent, 
    updateGlobalEvent
})(GameEventForm);