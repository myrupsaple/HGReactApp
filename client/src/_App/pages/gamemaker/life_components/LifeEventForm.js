import React from 'react';
import { connect } from 'react-redux';
import { Form, Button, Modal } from 'react-bootstrap';
import DatePicker from 'react-datepicker';

import { 
    fetchLifeEvent, 
    createLifeEvent,
    updateLifeEvent,
    lifeEventUpdateTributeStatsLives,
    lifeEventUpdateTributeStatsKills
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
            method: 'purchased',
            time: time,
            // Used to display the selected time in the time selector input
            timeFormatted: `${hours}:${minutes}`,
            notes: 'None',
            allowNotes: true,
            // Form validation
            emailValid: 1,
            secondaryValid: 0,
            formValid: 1,
            // Modal handling
            showModal: true,
            submitted: false,
            // API error handling
            apiError: false
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
            const response = await this.props.fetchLifeEvent(this.props.id);
            if(!response){
                return null;
            }
            
            const time = this.props.lifeEvent.time;
            const hours = Math.floor(time/60).toLocaleString(undefined, { minimumIntegerDigits: 2 });
            const minutes = (time % 60).toLocaleString(undefined, { minimumIntegerDigits: 2 });;

            const lifeEvent = this.props.lifeEvent;
            console.log(lifeEvent);
            if(this._isMounted){
                this.setState({
                    tribute_email: lifeEvent.tribute_email,
                    originalEmail: lifeEvent.tribute_email,
                    type: lifeEvent.type,
                    originalType: lifeEvent.type,
                    method: lifeEvent.method,
                    originalMethod: lifeEvent.method,
                    time: time,
                    timeFormatted: `${hours}:${minutes}`,
                    notes: lifeEvent.notes,
                    emailValid: 0
                })
                // if(lifeEvent.method === 'combat'){
                //     this.setState({

                //     })
                // }
            }
        }
    }

    handleTribute(event){
        if(event.target.value === ''){
            this.setState({ tribute_email: '' });
            this.setState({ emailValid: 2 });
            return;
        } else {
            const [name, email] = event.target.value.split(' || ');
            this.setState({ tribute_email: email, tributeName: name, emailValid: 0 });
            if(email === this.state.secondaryInput){
                this.setState({ secondaryInput: '', secondaryInputName: '', secondaryValid: 3 });
            }
        }
    }
    handleSecondary(event){
        if(event.target.value === ''){
            this.setState({ tribute_email: '', secondaryValid: 2 });
            return;
        } else {
            const [name, email] = event.target.value.split(' || ');
            this.setState({ secondaryInput: email, secondaryInputName: name, secondaryValid: 0 });
        }
    }
    handleType(event){
        const type = event.target.value;
        this.setState({ type: type, secondaryInput: '', secondaryInputName: '' });
        if(type === 'gained'){ 
            this.setState({ 
                method: 'purchased',
                notes: 'None',
                allowNotes: true,
                secondaryValid: 0
            });
        } else if(type === 'lost'){ 
            this.setState({ 
                method: 'combat', 
                notes: 'Combat notes will be automatically generated on form submission', 
                allowNotes: false,
                secondaryValid: 1
            }) 
        };
    }
    handleMethod(event){
        const input = event.target.value;

        this.setState({ method: input });
        if(input === 'combat'){
            const object = { target: { value: ' || ' }};
            this.handleSecondary(object);
            this.setState({ 
                notes: 'Combat notes will be automatically generated on form submission',
                allowNotes: false,
                secondaryValid: 1
            });
        } else {
            this.setState({ 
                notes: 'None',
                allowNotes: true,
                secondaryValid: 0
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
        if(this.state.emailValid === 1){
            this.setState({ emailValid: 2 });
        }
        if(this.state.method === 'combat'){
            if(this.state.secondaryValid === 1){
                this.setState({ secondaryValid: 2 });
            } else {
                this.setState({ secondaryValid: 0 });
            }
        }
        if(this.state.emailValid + this.state.secondaryValid !== 0){
            this.setState({ formValid: 2 });
            return;
        }

        // Object to be passed to create action handler
        const lifeEvent = {
            email: this.state.tribute_email,
            type: this.state.type,
            method: this.state.method,
            time: this.state.time,
            notes: encodeURIComponent(this.state.notes)
        };

        // Pass an additional object if the method is 'combat' since we want to
        // create a secondary 'combat' type event to track each tribute's kills
        var lifeEventSecondary = {};
        if(lifeEvent.method === 'combat'){
            // Automatically set notes for both objects if the method is 'combat'
            lifeEvent.notes = `${this.state.tributeName} was slain by ${this.state.secondaryInputName}`;
            lifeEventSecondary = {
                email: this.state.secondaryInput,
                type: 'combat',
                method: 'NA',
                time: this.state.time,
                notes: `${this.state.secondaryInputName} slaid ${this.state.tributeName}`
            }
        } else if (!lifeEvent.notes.replace(/\s/g, '').length) {
            // If not combat, and notes are full of whitespaces, change to 'none'
            lifeEvent.notes = 'none';
        }

        // Dispatch actions
        if(this.props.mode === 'edit'){
            lifeEvent.id = this.props.id;
            const response = await this.props.updateLifeEvent(lifeEvent);
            if(!response){
                this.setState({ apiError: true });
                return null;
            }

            const response2 = await this.props.lifeEventUpdateTributeStatsLives(
                this.state.originalEmail, this.state.originalType, this.state.originalMethod, 'delete');
            if(!response2){
                this.setState({ apiError: true });
                return null;
            }
            const response3 = await this.props.lifeEventUpdateTributeStatsLives(
                lifeEvent.email, lifeEvent.type, lifeEvent.method, 'create');
            if(!response3){
                this.setState({ apiError: true });
                return null;
            }

            if(this.state.method === 'combat'){
                lifeEventSecondary.id = this.props.id + 1;
                const response = await this.props.updateLifeEvent(lifeEventSecondary);
                if(!response){
                    this.setState({ apiError: true });
                    return null;
                }

                const response2 = await this.props.lifeEventUpdateTributeStatsKills(
                    lifeEventSecondary.email, 'create');
                if(!response2){
                    this.setState({ apiError: true });
                    return null;
                }
            }
        } else if(this.props.mode === 'create'){
            const response = await this.props.createLifeEvent(lifeEvent);
            if(!response){
                this.setState({ apiError: true });
                return null;
            }

            const response2 = await this.props.lifeEventUpdateTributeStatsLives(
                lifeEvent.email, lifeEvent.type, lifeEvent.method, 'create');
            if(!response2){
                this.setState({ apiError: true });
                return null;
            }

            if(this.state.method === 'combat'){
                const response = await this.props.createLifeEvent(lifeEventSecondary);
                if(!response){
                    this.setState({ apiError: true });
                    return null;
                }

                const response2 = await this.props.lifeEventUpdateTributeStatsKills(
                    lifeEventSecondary.email, 'create');
                if(!response2){
                    this.setState({ apiError: true });
                    return null;
                }
            }
        }

        if(this._isMounted){
            this.setState({ submitted: true })
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
                    <div className="col-4"><Form.Group controlId="time">
                        <Form.Label>Life Event Time*</Form.Label>
                        <DatePicker
                            showTimeSelect
                            showTimeSelectOnly
                            minTime={date1}
                            maxTime={date2}
                            timeIntervals={2}
                            value={this.state.timeFormatted}
                            onChange={this.handleTime}
                            dateFormat="hh:mm aa"
                        />
                    </Form.Group></div>
                </Form.Row>
                <Form.Row>
                    <div className="col-12"><Form.Group controlId="tribute">
                        <Form.Label>Tribute Name*</Form.Label>    
                        <Form.Control 
                            defaultValue={this.state.tribute_email} 
                            onChange={this.handleTribute} 
                            as="select" autoComplete="off"
                        >
                            {this.renderNameChoices()}
                        </Form.Control>
                        {this.renderEmailValidation()}
                    </Form.Group></div>
                </Form.Row>
                <Form.Row>
                    <div className="col-6"><Form.Group controlId="type">
                        <Form.Label>Event Type*</Form.Label>    
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
                        <Form.Label>Method*</Form.Label>    
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
    renderEmailValidation = () => {
        if(this.state.emailValid === 2){
            return(
                <p className="coolor-text-red" style={{ fontSize: "8pt" }}>
                    <span role="img" aria-label="check/x">&#10071;</span> Tribute is required
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
    renderSecondaryValidation = () => {
        if(this.state.secondaryValid === 2){
            return(
                <p className="coolor-text-red" style={{ fontSize: "8pt" }}>
                    <span role="img" aria-label="check/x">&#10071;</span> Killer is required
                </p>
            );
        } else if (this.state.secondaryValid === 3){
            return(
                <p className="coolor-text-red" style={{ fontSize: "8pt" }}>
                    <span role="img" aria-label="check/x">&#10071;</span> Killer cannot match victim
                </p>
            );
        } else if(this.state.secondaryValid === 0) {
            return(
                <p className="coolor-text-green" style={{ fontSize: "8pt" }}>
                    <span role="img" aria-label="check/x">&#10003;</span> Killer
                </p>
            );
        } else {
            return null;
        }
    }
    renderFormValidation = () => {
        if(this.state.submitted){
            return null;
        } else if(this.props.mode === 'edit' && !this.props.lifeEvent.tribute_email){
            return null;
        } 
        if(this.state.emailValid + this.state.secondaryValid === 0) {
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

    renderNameChoices(){
        const tributes = this.props.tributes;
        tributes.sort((a, b) => {
            if(a.first_name > b.first_name) return 1;
            else if(a.first_name < b.first_name) return -1;
            else return 0;
        })
        return (
        <>
            <option value="">Please Select a Tribute...</option>
            {tributes.map(tribute => {
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
                    value={this.state.method}
                    onChange={this.handleMethod}
                    as="select"
                >
                    <option value="purchased">Purchased</option>
                    <option value="roulette_resource">Roulette Resource</option>
                    <option value="other">Other (Specify in notes)</option>
                </Form.Control>
            );
        } else if (this.state.type === 'lost'){
            return(
                <Form.Control 
                    value={this.state.method}
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
                    {this.renderSecondaryValidation()}
                </Form.Group></div>
            </Form.Row>
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
        lifeEvent: state.selectedLifeEvent,
        gameState: state.gameState
    };
}

export default connect(mapStateToProps, 
{ 
    fetchLifeEvent,
    createLifeEvent,
    updateLifeEvent,
    lifeEventUpdateTributeStatsLives,
    lifeEventUpdateTributeStatsKills
})(LifeEventForm);