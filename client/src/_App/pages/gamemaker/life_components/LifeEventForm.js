import React from 'react';
import { connect } from 'react-redux';
import { Form, Button, Modal } from 'react-bootstrap';
import DatePicker from 'react-datepicker';

import { 
    fetchLifeEvent, 
    createLifeEvent,
    updateLifeEvent
} from '../../../../actions';

class LifeEventForm extends React.Component {
    _isMounted = false;

    constructor(props){
        super(props);

        const now = new Date();
        const hours = now.getHours().toLocaleString(undefined, { minimumIntegerDigits: 2 });
        const minutes = now.getMinutes().toLocaleString(undefined, { minimumIntegerDigits: 2 });
        const time = 60 * hours + 1 * minutes;

        this.state = {
            tribute_email: '',
            // Used if a tribute is slain in combat. Specifies the killer
            tributeName: '',
            secondaryInput: '',
            secondaryInputName: '',
            type: 'gained',
            method: '',
            time: time,
            // Used to display the selected time in the time selector input
            timeFormatted: `${hours}:${minutes}`,
            notes: 'None',
            allowNotes: true,
            showModal: true,
            submitted: false
        };

        this.handleTribute = this.handleTribute.bind(this);
        this.handleSecondary = this.handleSecondary.bind(this);
        this.handleType = this.handleType.bind(this);
        this.handleMethod = this.handleMethod.bind(this);
        this.handleTime = this.handleTime.bind(this);
        this.handleNotes = this.handleNotes.bind(this);
    }

    async componentDidMount(){
        this._isMounted = true;
        if(this.props.mode === 'edit'){
            await this.props.fetchLifeEvent(this.props.id);
            
            const time = this.props.lifeEvent.time;
            const hours = Math.floor(time/60).toLocaleString(undefined, { minimumIntegerDigits: 2 });
            const minutes = (time % 60).toLocaleString(undefined, { minimumIntegerDigits: 2 });;
            if(this._isMounted){
                this.setState({
                    tribute_email: this.props.lifeEvent.tribute_email,
                    type: this.props.lifeEvent.type,
                    method: this.props.lifeEvent.method,
                    time: time,
                    timeFormatted: `${hours}:${minutes}`,
                    notes: this.props.lifeEvent.notes
                })
            }
        }
    }

    handleTribute(event){
        if(event.target.value === 'Please Select a Tribute...'){
            this.setState({ tribute_email: '' });
            return;
        }
        const [name, email] = event.target.value.split(' || ');
        if(email === this.state.secondaryInput){
            this.setState({ secondaryInput: '', secondaryInputName: ''})
        }
        this.setState({ tribute_email: email, tributeName: name });
    }
    handleSecondary(event){
        if(event.target.value === 'Please Select a Tribute...'){
            this.setState({ tribute_email: '' });
            return;
        }
        const [name, email] = event.target.value.split(' || ');
        this.setState({ secondaryInput: email, secondaryInputName: name });
    }
    handleType(event){
        const type = event.target.value;
        this.setState({ type: type, secondaryInput: '', secondaryInputName: '' });
        if(type === 'gained'){ 
            this.setState({ 
                method: 'purchased',
                notes: 'None',
                allowNotes: true
            });
        } else if(type === 'lost'){ 
            this.setState({ 
                method: 'combat', 
                notes: 'Combat notes will be automatically generated on form submission', 
                allowNotes: false 
            }) 
        };
    }
    handleMethod(event){
        this.setState({ method: event.target.value });
        if(this.state.method !== 'combat'){
            const object = { target: { value: ' || ' }};
            this.handleSecondary(object);
            this.setState({ 
                notes: 'Combat notes will be automatically generated on form submission',
                allowNotes: false });
        } else {
            this.setState({ 
                method: 'purchased',
                notes: 'None',
                allowNotes: true
            });
        }
    }
    handleTime(date){
        const now = new Date();
        const hours = now.getHours().toLocaleString(undefined, { minimumIntegerDigits: 2 });
        const minutes = now.getMinutes().toLocaleString(undefined, { minimumIntegerDigits: 2 });
        const time = 60 * hours + 1 * minutes;
        this.setState({ 
            time: time,
            timeFormatted: `${hours}:${minutes}`
        });
    }
    handleNotes(event){
        this.setState({ notes: event.target.value });
    }

    handleFormSubmit = async () => {
        if(!this.state.time || !this.state.tribute_email || !this.state.type ||
            !this.state.method || ((this.state.method === 'combat') === (this.state.secondaryInput === ''))){
                alert('Please fill in the required fields');
                return;
            }

        if(this._isMounted){
            this.setState({ submitted: true })
        }

        // Object to be passed to create action handler
        const lifeEventObject = {
            email: this.state.tribute_email,
            type: this.state.type,
            method: this.state.method,
            time: this.state.time,
            notes: this.state.notes
        };

        // Pass an additional object if the method is 'combat' since we want to
        // create a secondary 'combat' type event to track each tribute's kills
        var lifeEventObjectSecondary = {};
        if(lifeEventObject.method === 'combat'){
            // Automatically set notes for both objects if the method is 'combat'
            lifeEventObject.notes = `${this.state.tributeName} was slain by ${this.state.secondaryInputName}`;
            lifeEventObjectSecondary = {
                email: this.state.secondaryInput,
                type: 'combat',
                method: 'NA',
                time: this.state.time,
                notes: `${this.state.secondaryInputName} slaid ${this.state.tributeName}`
            }
        } else if (!lifeEventObject.notes.replace(/\s/g, '').length) {
            // If not combat, and notes are full of whitespaces, change to 'none'
            lifeEventObject.notes = 'none';
        }

        // Dispatch actions
        if(this.props.mode === 'edit'){
            lifeEventObject.id = this.props.id;
            await this.props.updateLifeEvent(lifeEventObject);

            if(this.state.method === 'combat'){
                lifeEventObjectSecondary.id = this.props.id + 1;
                this.props.updateLifeEvent(lifeEventObjectSecondary);
            }
        } else if(this.props.mode === 'create'){
            await this.props.createLifeEvent(lifeEventObject);

            if(this.state.method === 'combat'){
                this.props.createLifeEvent(lifeEventObjectSecondary);
            }
        }
        setTimeout(() => this.handleClose(), 1000);
    }

    renderModalHeader(){
        if(this.props.mode === 'edit'){
            return 'Edit Life Event Info';
        } else if(this.props.mode === 'create'){
            return 'Enter Life Event Info';
        } else {
            return 'Something unexpected happened';
        }
    }

    renderModalBody(){
        const message = this.props.mode === 'edit' ? 'edited' : 'created';
        if(this.state.submitted){
            return(
                <h4>Life Event {message} successfully!</h4>
            );
        } else if(this.props.mode === 'edit' && !this.props.lifeEvent.tribute_email){
            return <h3>An error occured while retrieving life event data. Please try again.</h3> 
        } else {
            return <>{this.renderForm()}</>
        }
    }

    renderForm = () => {
        return(
            <Form>
                <Form.Row>
                    <div className="col-4"><Form.Group controlId="time">
                        <Form.Label>Life Event Time</Form.Label>
                        <DatePicker
                            showTimeSelect
                            showTimeSelectOnly
                            value={this.state.timeFormatted}
                            onChange={this.handleTime}
                            dateFormat="hh:mm aa"
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
                    <div className="col-6"><Form.Group controlId="type">
                        <Form.Label>Event Type</Form.Label>    
                        <Form.Control 
                            defaultValue="gained"
                            onChange={this.handleType}
                            as="select"
                        >
                            <option value="gained">Gained</option>
                            <option value="lost">Lost</option>
                        </Form.Control>
                    </Form.Group></div>
                    <div className="col-6"><Form.Group controlId="method">
                        <Form.Label>Method</Form.Label>    
                            {this.renderMethodChoices()}
                    </Form.Group></div>
                </Form.Row>
                {this.renderSecondaryChoices()}
                <Form.Row>
                    <div className="col-12"><Form.Group controlId="notes">
                        <Form.Label>Notes</Form.Label>    
                        <Form.Control 
                            disabled={!this.state.allowNotes}
                            value={this.state.notes}
                            autoComplete="off"
                            onChange={this.handleNotes}
                        />
                    </Form.Group></div>
                </Form.Row>
            </Form>
        );
    }

    renderNameChoices(){
        return (
        <>
            <option value="">Please Select a Tribute...</option>
            {this.props.tributes.map(tribute => {
                return (
                // Name is needed for automated notes logging for combat events
                <option key={tribute.id} value={`${tribute.first_name} ${tribute.last_name} || ${tribute.email}`}>
                    {tribute.first_name} {tribute.last_name} || {tribute.email}
                </option>
                );
            })}
        </>
        );
    }

    renderMethodChoices = () => {
        if(this.state.type === 'gained'){
            return(
                <Form.Control 
                    defaultValue="purchased"
                    onChange={this.handleMethod}
                    as="select"
                >
                    <option value="purchased">Purchased</option>
                    <option value="life_resource">Life Resource</option>
                    <option value="roulette_resource">Roulette Resource</option>
                    <option value="other">Other (Specify in notes)</option>
                </Form.Control>
            );
        } else if (this.state.type === 'lost'){
            return(
                <Form.Control 
                    defaultValue="combat"
                    onChange={this.handleMethod}
                    as="select"
                >
                    <option value="combat">Combat</option>
                    <option value="food_resource">Food Resource</option>
                    <option value="water_resource">Water Resource</option>
                    <option value="medicine_resource">Medicine Resource</option>
                    <option value="roulette_resource">Roulette Resource</option>
                    <option value="mutts">Mutts (Specify who in notes)</option>
                    <option value="other">Special Event (Specify in notes)</option>
                </Form.Control>
            );
        }
    }
    
    renderSecondaryChoices = () => {
        if(this.state.method !== 'combat'){
            return null;
        }
        return (
            <Form.Row>
                <div className="col-12"><Form.Group controlId="killer">
                    <Form.Label>Who Killed Them?</Form.Label>    
                    <Form.Control 
                        defaultValue={this.state.secondaryInput}
                        onChange={this.handleSecondary}
                        as="select"
                    >
                        <option value="">Please Select a Tribute...</option>
                        {this.props.tributes.map(tribute => {
                            if(tribute.email === this.state.tribute_email){
                                return null;
                            }
                            return (
                            <option key={tribute.id} value={`${tribute.first_name} ${tribute.last_name} || ${tribute.email}`}>
                                {tribute.first_name} {tribute.last_name} || {tribute.email}
                            </option>
                            );
                        })}
                    </Form.Control>
                </Form.Group></div>
            </Form.Row>
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

    handleClose = () => {
        if(this._isMounted){
            this.setState({ showModal: false });
        }
        this.props.onSubmitCallback();
    }

    render = () => {
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
        lifeEvent: state.selectedLifeEvent
    };
}

export default connect(mapStateToProps, 
{ 
    fetchLifeEvent,
    createLifeEvent,
    updateLifeEvent
})(LifeEventForm);