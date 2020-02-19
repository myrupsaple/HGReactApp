import React from 'react';
import { connect } from 'react-redux';
import { Form, Button, Modal } from 'react-bootstrap';
import DatePicker from 'react-datepicker';

import { 
    fetchTributes,
    fetchResourceEvent,
    fetchLifeEventByTerms,
    createResourceEvent,
    updateResourceEvent,
    fetchResourceListItemByCode,
    resourceEventUpdateTributeStats,
    resourceEventCreateLifeEvent,
    resourceEventUpdateLifeEvent,
    resourceEventUpdateResourceList
} from '../../../../actions';

class ResourceEventForm extends React.Component {
    _isMounted = false;

    constructor(props){
        super(props);
        const now = new Date();
        const hours = now.getHours().toLocaleString(undefined, { minimumIntegerDigits: 2 });
        const minutes = now.getMinutes().toLocaleString(undefined, { minimumIntegerDigits: 2 });
        const time = 60 * hours + 1 * minutes;

        this.state = {
            tribute: '',
            tribute_email: '',
            // Used to log which tribute used a resource
            tributeName: '',
            type: 'food',
            typeSecondary: 'food',
            method: 'code',
            time: time,
            timeFormatted: `${hours}:${minutes}`,
            notes: 'None',
            // Validation
            emailValid: 1,
            formValid: 1,
            // Handle Modal
            showModal: true,
            submitted: false,
            // API error handling
            apiError: false
        };

        this.handleTribute = this.handleTribute.bind(this);
        this.handleType = this.handleType.bind(this);
        this.handleMethod = this.handleMethod.bind(this);
        this.handleTime = this.handleTime.bind(this);
        this.handleNotes = this.handleNotes.bind(this);
    }

    async componentDidMount(){
        this._isMounted = true;
        if(this.props.mode === 'edit'){
            const response = await this.props.fetchResourceEvent(this.props.id);
            if(!response){
                return null;
            }

            var notes = this.props.resourceEvent.notes;
            if(this.props.resourceEvent.method === 'code' && this.props.resourceEvent.notes.includes('golden')){
                notes = notes.split(' ')[0];
            }
            
            const time = this.props.resourceEvent.time;
            const hours = Math.floor(time/60).toLocaleString(undefined, { minimumIntegerDigits: 2 });
            const minutes = (time % 60).toLocaleString(undefined, { minimumIntegerDigits: 2 });;

            const resourceEvent = this.props.resourceEvent;
            if(this._isMounted){
                this.setState({
                    tribute: `${this.getTributeName(resourceEvent.tribute_email)} || ${resourceEvent.tribute_email}`,
                    tribute_email: resourceEvent.tribute_email,
                    originalEmail: resourceEvent.tribute_email,
                    type: resourceEvent.type,
                    originalType: resourceEvent.type,
                    method: resourceEvent.method,
                    time: time,
                    timeFormatted: `${hours}:${minutes}`,
                    notes: notes,
                    originalNotes: notes,
                    emailValid: 0
                })
            }
        }
    }

    handleTribute(event){
        const input = event.target.value;
        if(input === ''){
            this.setState({ tribute: input, tribute_email: '', emailValid: 2 });
            return null;
        } else {
            const [name, email] = input.split(' || ');
            this.setState({ tribute: input, tribute_email: email, tributeName: name, emailValid: 0 });
        }
    }
    handleType(event){
        const input = event.target.value;
        if(input === 'golden'){
            this.setState({ type: 'golden', typeSecondary: 'golden-food', method: 'code' })
        } else {
            this.setState({ type: input, typeSecondary: input });
        }
    }
    handleMethod(event){
        const input = event.target.value;
        if(this.state.type === 'golden'){
            // Method pre-set to 'code' when 'golden' was selected as the type
            this.setState({ typeSecondary: `golden-${input}` })
        } else {
            this.setState({ method: input });
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

        if(this.state.emailValid !== 0){
            this.setState({ formValid: 2 });
            return null;
        }       

        const resourceEventObject = {
            email: this.state.tribute_email,
            type: this.state.secondaryType,
            method: this.state.method,
            time: this.state.time,
            notes: encodeURIComponent(this.state.notes)
        };

        var code = '';
        if(resourceEventObject.method === 'code'){
            code = resourceEventObject.notes.toLowerCase();

            if(this.props.mode === 'create'){
                const response = await this.props.fetchResourceListItemByCode(code);
                if(!response){
                    this.setState({ apiError: true });
                    return null;
                } else {
                    this.setState({ apiError: false });
                }
                // If empty, code was invalid
                if(Object.keys(this.props.code).length === 0){
                    this.setState({ formValid: 3 });
                    return null;
                } else if(this.props.code.type !== resourceEventObject.type && this.props.code.type !== 'golden'){
                    this.setState({ formValid: 4 });
                    return null;
                } else if(this.props.code.times_used >= this.props.code.max_uses){
                    this.setState({ formValid: 5 });
                    return null;
                }
            }

            if(resourceEventObject.type.includes('golden')){
                resourceEventObject.type = resourceEventObject.type.split('-')[1];
                resourceEventObject.notes = resourceEventObject.notes + ' (golden)';
            }
        }
        
        if (!resourceEventObject.notes.replace(/\s/g, '').length) {
            resourceEventObject.notes = 'none';
        }

        // Give an error if an identical life event is found since this is the only way of accessing the paired event
        const response = await this.props.fetchLifeEventByTerms(resourceEventObject.email, resourceEventObject.time, resourceEventObject.notes);
        if(!response){
            this.setState({ apiError: true });
            return null;
        } else if(Object.keys(this.props.lifeEvent).length !== 0 && this.props.mode === 'create'){
            this.setState({ formValid: 6 });
        }

        if(this.props.mode === 'edit'){
            resourceEventObject.id = this.props.id;
            const response = await this.props.updateResourceEvent(resourceEventObject);
            if(!response){
                this.setState({ apiError: true });
                return null;
            }
            
            // Tribute stats updating
            const response2 = await this.props.resourceEventUpdateTributeStats(this.state.originalEmail,
                this.state.originalType, 'delete');
            if(!response2){
                this.setState({ apiError: true });
                return null;
            }
            const response3 = await this.props.resourceEventUpdateTributeStats(resourceEventObject.email,
                resourceEventObject.type, 'create');
            if(!response3){
                this.setState({ apiError: true });
                return null;
            }
            
            // Life events updating
            if(resourceEventObject.type === 'life'){
                console.log("UPDATED")
                const response = await this.props.resourceEventUpdateLifeEvent(this.state.originalEmail, 
                    resourceEventObject.email, resourceEventObject.time, resourceEventObject.notes);
                if(!response){
                    this.setState({ apiError: true });
                    return null;
                }
            }

            // Resource list counts updating (will delete 'used_by' if updated)
            if(resourceEventObject.method === 'code'){
                const response = await this.props.fetchTributes();
                if(!response){
                    this.setState({ apiError: true });
                    return null;
                }
                const response2 = await this.props.resourceEventUpdateResourceList(
                    this.state.originalNotes, code, 'edit');
                if(!response2){
                    this.setState({ apiError: true });
                    return null;
                }
                const response3 = await this.props.resourceEventUpdateResourceList(
                    this.getTributeName(resourceEventObject.email), code, 'create');
                if(!response3){
                    this.setState({ apiError: true });
                    return null;
                }
            }
        } else if(this.props.mode === 'create'){
            const response = await this.props.createResourceEvent(resourceEventObject);
            if(!response){
                this.setState({ apiError: true });
                return null;
            }

            // Tribute stats updating
            const response2 = await this.props.resourceEventUpdateTributeStats(resourceEventObject.email,
                resourceEventObject.type, 'create');
            if(!response2){
                this.setState({ apiError: true });
                return null;
            }

            // Life events updating
            if(resourceEventObject.type === 'life'){
                const response = await this.props.resourceEventCreateLifeEvent(resourceEventObject.email,
                resourceEventObject.time, resourceEventObject.notes);
                if(!response){
                    this.setState({ apiError: true });
                    return null;
                }
            }
            // Resource list counts updating (there is no undo for this action if edited)
            if(resourceEventObject.method === 'code'){
                const response = await this.props.fetchTributes();
                if(!response){
                    this.setState({ apiError: true });
                    return null;
                }
                const response2 = await this.props.resourceEventUpdateResourceList(
                    this.getTributeName(resourceEventObject.email), code, 'create');
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

    getTributeName = (email) => {
        if(email === 'No Assignment'){
            return 'No Assignment';
        }
        for (let tribute of this.props.tributes){
            if(email === tribute.email){
                return (tribute.first_name + ' ' + tribute.last_name);
            }
        }
        return 'Unrecognized Tribute';
    }

    renderModalHeader(){
        if(this.props.mode === 'edit'){
            return 'Edit Resource Event Info';
        } else if(this.props.mode === 'create'){
            return 'Enter Resource Event Info';
        } else {
            return 'Something unexpected happened';
        }
    }

    renderModalBody(){
        const message = this.props.mode === 'edit' ? 'edited' : 'created';
        if(this.state.submitted){
            return(
                <h4>Resource Event {message} successfully!</h4>
            );
        } else if(this.props.mode === 'edit' && !this.props.resourceEvent.tribute_email){
            return <h3>An error occured while retrieving resource event data. Please try again.</h3> 
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
                        <Form.Label>Resource Event Time*</Form.Label>
                        <DatePicker
                            showTimeSelect
                            showTimeSelectOnly
                            minTime={date1}
                            maxTime={date2}
                            timeIntervals={2}
                            value={this.state.timeFormatted}
                            onChange={this.time}
                            dateFormat="hh:mm aa"
                        />
                    </Form.Group></div>
                </Form.Row>
                <Form.Row>
                    <div className="col-12"><Form.Group controlId="tribute">
                        <Form.Label>Tribute Name*</Form.Label>    
                        <Form.Control 
                            value={this.state.tribute} 
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
                        <Form.Label>Resource Type*</Form.Label>    
                        <Form.Control 
                            value={this.state.type}
                            onChange={this.handleType}
                            as="select"
                            disabled={this.props.mode === 'edit'}
                        >
                            <option value="food">Food</option>
                            <option value="water">Water</option>
                            <option value="medicine">Medicine</option>
                            <option value="roulette">Roulette</option>
                            <option value="life">Life</option>
                            <option value="golden">Golden</option>
                        </Form.Control>
                    </Form.Group></div>
                    <div className="col-6"><Form.Group controlId="method">
                        {this.renderMethodChoices(this.state.type)}
                    </Form.Group></div>
                    <div className="col-12"><Form.Group controlId="notes">
                        <Form.Label>Notes (If a code was used, enter the code here)</Form.Label>    
                        <Form.Control 
                            value={this.state.notes}
                            autoComplete="off"
                            onChange={this.handleNotes}
                            disabled={this.props.mode === 'edit'}
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
                    <span role="img" aria-label="check/x">&#10071;</span> Please select a tribute
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
    renderFormValidation = () => {
        if(this.state.submitted){
            return null;
        } else if(this.props.mode === 'edit' && !this.props.resourceEvent.tribute_email){
            return null;
        } 
        
        if(this.state.formValid === 3){
            return(
                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                    <p className="coolor-text-red" style={{ fontSize: "12pt" }}>
                        <span role="img" aria-label="check/x">&#10071;</span> You entered an invalid resource code.
                    </p>
                </div>
            );
        } else if(this.state.formValid === 4){
            return(
                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                    <p className="coolor-text-red" style={{ fontSize: "12pt" }}>
                        <span role="img" aria-label="check/x">&#10071;</span> Resource type does not match the code you entered.
                    </p>
                </div>
            );
        } else if(this.state.formValid === 5){
            return(
                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                    <p className="coolor-text-red" style={{ fontSize: "12pt" }}>
                        <span role="img" aria-label="check/x">&#10071;</span> This resource has been used the maximum number of times.
                    </p>
                </div>
            );
        } else if(this.state.formValid === 6){
            return(
                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                    <p className="coolor-text-red" style={{ fontSize: "12pt" }}>
                        <span role="img" aria-label="check/x">&#10071;</span> Please select a different time.
                    </p>
                </div>
            );
        } else if(this.state.emailValid === 0) {
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
        return (
        <>
            <option value="">Please Select a Tribute...</option>
            {this.props.tributes.map(tribute => {
                return (
                <option key={tribute.id} value={`${tribute.first_name} ${tribute.last_name} || ${tribute.email}`}>
                    {tribute.first_name} {tribute.last_name} || {tribute.email}
                </option>
                );
            })}
        </>
        );
    }

    renderMethodChoices(type){
        if(type.split('-')[0] === 'golden'){
            return(
                <>
                <Form.Label>Use As*</Form.Label>    
                <Form.Control 
                    value={this.state.type.split('-')[1]}
                    onChange={this.handleMethod}
                    as="select"
                    disabled={this.props.mode === 'edit'}
                >
                    <option value="food">Food</option>
                    <option value="water">Water</option>
                    <option value="medicine">Medicine</option>
                </Form.Control>
                </>
            );
            
        } else {
            return(
                <>
                <Form.Label>Method*</Form.Label>    
                <Form.Control 
                value={this.state.method}
                onChange={this.handleMethod}
                as="select"
                disabled={this.props.mode === 'edit'}
                >
                    <option value="code">Code</option>
                    <option value="purchased">Purchased</option>
                    <option value="other">Other</option>
                </Form.Control>
                </>
            );
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
        resourceEvent: state.selectedResourceEvent,
        lifeEvent: state.selectedLifeEvent,
        code: state.selectedResource,
    };
}

export default connect(mapStateToProps, 
{ 
    fetchTributes,
    fetchResourceEvent,
    fetchLifeEventByTerms,
    createResourceEvent,
    updateResourceEvent,
    fetchResourceListItemByCode,
    resourceEventUpdateTributeStats,
    resourceEventCreateLifeEvent,
    resourceEventUpdateLifeEvent,
    resourceEventUpdateResourceList
})(ResourceEventForm);