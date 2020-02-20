import React from 'react';
import { connect } from 'react-redux';
import { Form, Button, Modal } from 'react-bootstrap';
import DatePicker from 'react-datepicker';

import {
    fetchServerTime,
    fetchGlobalEvent, 
    createGlobalEvent, 
    updateGlobalEvent
} from '../../../../actions';

class GameEventForm extends React.Component {
    _isMounted = false;

    constructor(props){
        super(props);
        const startTime = new Date(Date.parse(this.props.gameState.start_time));
        const hours = startTime.getHours();
        const minutes = startTime.getMinutes();
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
            disableTime: false,
            code: '',
            serverTime: 0,
            // Validation
            typeValid: 1,
            descriptionValid: 1,
            messageValid: 1,
            time1Valid: 0,
            time2Valid: 0,
            formValid: 1,
            // Handle the Modal
            showModal: true,
            firstSubmit: false,
            finalConfirm: false
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
                    code: globalEvent.action_code,
                    status: globalEvent.status,
                    typeValid: 0,
                    descriptionValid: 0,
                    messageValid: 0,
                    time1Valid: 0,
                    time2Valid: 0
                })
                if(globalEvent.status === 'completed'){
                    this.setState({ disableTime: true });
                }
            }
        }

        const dateString = await this.props.fetchServerTime();
        const date = new Date(Date.parse(dateString));
        const time = date.getHours() * 60 + date.getMinutes() * 1;
        this.setState({ serverTime: time });

        // Render any warnings on the time components due to passed time
        const hours2 = Math.floor(this.state.time1 / 60);
        const minutes2 = this.state.time1 % 60;
        const hours3 = Math.floor(this.state.time2 / 60);
        const minutes3 = this.state.time2 % 60;
        const time2 = new Date();
        time2.setHours(hours2);
        time2.setMinutes(minutes2);
        const time3 = new Date();
        time3.setHours(hours3);
        time3.setMinutes(minutes3);
        this.handleTime1(time2);
        this.handleTime2(time3);
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
                this.setState({ code: 0 });
                break;
            case 'food_required':
                this.setState({ code: 1 });
                break;
            case 'water_required':
                this.setState({ code: 2 });
                break;
            case 'medicine_required':
                this.setState({ code: 3 });
                break;
            case 'special_event':
                this.setState({ code: 4 });
                break;
            case 'announcement':
                this.setState({ code: 5 });
                break;
            default:
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
        const time = hours * 60 + minutes;
        const timeFormatted = `${hours.toLocaleString(undefined, { minimumIntegerDigits: 2 })}:${minutes.toLocaleString(undefined, { minimumIntegerDigits: 2 })}`
        this.setState({ 
            time1: time,
            time1Formatted: timeFormatted
        });
        if(time > this.state.time2){
            this.setState({ time1Valid: 3, time2Valid: 3 });
        } else {
            if(this.state.time2Valid === 3){
                this.setState({ time2Valid: 0 })
            }
            if(time <= this.state.serverTime){
                this.setState({ time1Valid: 2 });
            } else {
                this.setState({ time1Valid: 0 });
            }
        }
    }
    handleTime2(date){
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const time = hours * 60 + minutes;
        const timeFormatted = `${hours.toLocaleString(undefined, { minimumIntegerDigits: 2 })}:${minutes.toLocaleString(undefined, { minimumIntegerDigits: 2 })}`
        this.setState({ 
            time2: time,
            time2Formatted: timeFormatted
        });
        if(time < this.state.time1){
            this.setState({ time2Valid: 3, time1Valid: 3 });
        } else {
            if(this.state.time1Valid === 3){
                this.setState({ time1Valid: 0 })
            }
            if(time <= this.state.serverTime){
                this.setState({ time2Valid: 2 });
            } else {
                this.setState({ time2Valid: 0 });
            }
        }
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
        var time1Valid = 0;
        var time2Valid = 0;
        if(this.state.time1Valid !== 2){
            time1Valid = this.state.time1Valid;
        }
        if(this.state.time2Valid !== 2){
            time2Valid = this.state.time2Valid;
        }

        if(this.state.typeValid + this.state.descriptionValid + this.state.messageValid +
            time1Valid + time2Valid !== 0){
            this.setState({ formValid: 2 });
            return null;
        }

        if(this._isMounted && !this.state.firstSubmit){
            this.setState({ firstSubmit: true, formValid: 1 });
            return null;
        }

        const globalEvent = {
            type: this.state.type,
            description: encodeURIComponent(this.state.description),
            message: encodeURIComponent(this.state.message),
            notification_time: this.state.time1,
            event_end_time: this.state.time2,
            action_code: this.state.code,
        };
        if (!globalEvent.description.replace(/\s/g, '').length) {
            globalEvent.description = 'none';
        }
        if (!globalEvent.message.replace(/\s/g, '').length) {
            globalEvent.message = 'none';
        }

        if(this.props.mode === 'edit'){
            globalEvent.id = this.props.id;
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
            this.setState({ finalConfirm: true })
        }

        setTimeout(() => this.handleClose(), 1000);
    }

    renderModalHeader(){
        if(this.props.mode === 'edit'){
            return 'Edit Global Event';
        } else if(this.props.mode === 'create'){
            return 'Create Global Event';
        } else if(this.props.firstSubmit){
                const mode = this.props.mode === 'edit' ? 'Update' : 'Create';
                return `Confirm Event ${mode}`;
        } else {
            return 'Something unexpected happened';
        }
    }

    renderModalBody(){
        const message = this.props.mode === 'edit' ? 'edited' : 'created';
        if(this.props.mode === 'edit' && !this.props.globalEvent.type){
            return <h3>An error occured while retrieving global event data. Please try again.</h3> 
        } else if(!this.state.firstSubmit){
            return <>{this.renderForm()}</>
        } else if(!this.state.finalConfirm){
            const mode = this.props.mode === 'edit' ? 'update' : 'create';
            return(
                <>
                    Are you sure you would like to {mode} this global event?
                    {this.renderWarnings()}
                    {this.renderGlobalEventSummary()}
                </>
            )
        } else {
            return(
                <h4>Global Event {message} successfully!</h4>
            );
        } 
    }

    renderGlobalEventSummary = () => {
        return(
            <div style={{ marginLeft: "20px" }}>
                <div className="row"><span className="font-weight-bold">Type:</span><span>&nbsp;{this.state.type}</span></div>
                <div className="row"><span className="font-weight-bold">Description:</span><span>&nbsp;{this.state.description}</span></div>
                <div className="row"><span className="font-weight-bold">Message:</span><span>&nbsp;{this.state.message}</span></div>
                <div className="row"><span className="font-weight-bold">Notification Time:</span><span>&nbsp;{this.state.time1Formatted}</span></div>
                <div className="row"><span className="font-weight-bold">Event End Time:</span><span>&nbsp;{this.state.time2Formatted}</span></div>
            </div>
        );
    }
    
    renderWarnings = () => {
        if(this.state.serverTime > this.state.time2){
            return(
                <h5 className="coolor-text-red">
                    Warning: The end time for this event has already passed.
                    Proceeding will cause immediate execution of the action without
                    prior notice to the tributes.
                </h5>
            );
        } else if(this.state.serverTime > this.state.time1){
            return(
                <h5 className="coolor-text-red">
                    Warning: The notification time for this event has already passed.
                    Proceeding will immediately make this event visible to tributes.
                </h5>
            );
        } else {
            return null;
        }
    }

    renderForm(){
        const gameTime = new Date(Date.parse(this.props.gameState.start_time));
        const date1 = new Date();
        date1.setHours(gameTime.getHours());
        date1.setMinutes(gameTime.getMinutes());
        const date2 = new Date();
        date2.setHours(gameTime.getHours() + 5);
        date2.setMinutes(gameTime.getMinutes());
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
                            <option value="special_event">Create a Special Event</option>
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
                            // minTime={date1}
                            // maxTime={date2}
                            timeIntervals={2}
                            value={this.state.time1Formatted}
                            onChange={this.handleTime1}
                            dateFormat="hh:mm aa"
                            disabled={this.state.disableTime}
                        />
                        {this.renderTime1Validation()}
                    </Form.Group></div>
                    <div className="col-6"><Form.Group controlId="time2">
                        <Form.Label>Event End Time*</Form.Label>    
                        <DatePicker
                            showTimeSelect
                            showTimeSelectOnly
                            // minTime={date1}
                            // maxTime={date2}
                            timeIntervals={2}
                            value={this.state.time2Formatted}
                            onChange={this.handleTime2}
                            dateFormat="hh:mm aa"
                            disabled={this.state.disableTime && !this.props.globalEvent.type.includes('_cost_start')}
                        />
                        {this.renderTime2Validation()}
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
    renderTime1Validation = () =>{
        if(this.state.time1Valid === 2){
            return(
                <p className="coolor-text-yellow-darken-3" style={{ fontSize: "8pt" }}>
                    <span role="img" aria-label="check/x">&#9888;</span> Notification time has already passed
                </p>
            );
        } else if(this.state.time1Valid === 3){
            return(
                <p className="coolor-text-red" style={{ fontSize: "8pt" }}>
                    <span role="img" aria-label="check/x">&#10071;</span> Notification time must come before event end time
                </p>
            );
        } else if(this.state.time1Valid === 0) {
            return(
                <p className="coolor-text-green" style={{ fontSize: "8pt" }}>
                    <span role="img" aria-label="check/x">&#10003;</span> Time
                </p>
            );
        } else {
            return null;
        }
    }
    renderTime2Validation = () =>{
        if(this.state.time2Valid === 2){
            return(
                <p className="coolor-text-yellow-darken-3" style={{ fontSize: "8pt" }}>
                    <span role="img" aria-label="check/x">&#9888;</span> Event end time has already passed
                </p>
            );
        } else if(this.state.time2Valid === 3){
            return(
                <p className="coolor-text-red" style={{ fontSize: "8pt" }}>
                    <span role="img" aria-label="check/x">&#10071;</span> Event end time must come before notification time
                </p>
            );
        } else if(this.state.time2Valid === 0) {
            return(
                <p className="coolor-text-green" style={{ fontSize: "8pt" }}>
                    <span role="img" aria-label="check/x">&#10003;</span> Time
                </p>
            );
        } else {
            return null;
        }
    }
    renderFormValidation = () =>{
        var time1Valid = 0;
        var time2Valid = 0;
        if(this.state.time1Valid !== 2){
            time1Valid = this.state.time1Valid;
        }
        if(this.state.time2Valid !== 2){
            time2Valid = this.state.time2Valid;
        }

        if(this.state.finalConfirm){
            return null;
        } else if(this.props.mode === 'edit' && !this.props.globalEvent.type){
            return null;
        } 
        if(this.state.typeValid + this.state.descriptionValid + this.state.messageValid + 
            time1Valid + time2Valid === 0) {
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
        if(this.state.finalConfirm){
            return null;
        } else if(this.state.firstSubmit){
            return(
                <>
                    <Button variant="secondary" onClick={() => this.setState({ firstSubmit: false })}>Cancel</Button>
                    <Button variant="danger" onClick={this.handleFormSubmit}>Yes, I'm Sure</Button>
                </>
            );
        } else {
            return(
                <>
                    {this.renderFormValidation()}
                    {this.renderApiError()}
                    <Button variant="danger" onClick={this.handleClose}>Cancel</Button>
                    <Button variant="info" onClick={this.handleFormSubmit}>Submit</Button>
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
        globalEvent: state.selectedGlobalEvent
    };
}

export default connect(mapStateToProps, { 
    fetchServerTime,
    fetchGlobalEvent, 
    createGlobalEvent, 
    updateGlobalEvent
})(GameEventForm);