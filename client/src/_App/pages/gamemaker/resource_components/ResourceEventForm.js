import React from 'react';
import { connect } from 'react-redux';
import { Form, Button, Modal } from 'react-bootstrap';
import DatePicker from 'react-datepicker';

import { 
    fetchResourceEvent, 
    createResourceEvent,
    updateResourceEvent,
    fetchTributes,
    resourceEventUpdateTributeStats,
    resourceEventUpdateLifeEvents,
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
            tribute_email: '',
            // Used if a tribute is slain in combat. Specifies the killer
            tributeName: '',
            type: 'food',
            method: 'code',
            time: time,
            timeFormatted: `${hours}:${minutes}`,
            notes: 'None',
            showModal: true,
            submitted: false
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
            await this.props.fetchResourceEvent(this.props.id);
            
            const time = this.props.resourceEvent.time;
            const hours = Math.floor(time/60).toLocaleString(undefined, { minimumIntegerDigits: 2 });
            const minutes = (time % 60).toLocaleString(undefined, { minimumIntegerDigits: 2 });;
            if(this._isMounted){
                this.setState({
                    tribute_email: this.props.resourceEvent.tribute_email,
                    originalEmail: this.props.resourceEvent.tribute_email,
                    type: this.props.resourceEvent.type,
                    originalType: this.props.resourceEvent.type,
                    method: this.props.resourceEvent.method,
                    time: time,
                    timeFormatted: `${hours}:${minutes}`,
                    notes: this.props.resourceEvent.notes,
                    originalNotes: this.props.resourceEvent.notes
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
        this.setState({ tribute_email: email, tributeName: name });
    }
    handleType(event){
        const input = event.target.value;
        if(input === 'golden'){
            this.setState({ type: `golden-food`, method: 'code' })
        } else {
            this.setState({ type: input });
        }
    }
    handleMethod(event){
        const input = event.target.value;
        if(this.state.type === 'golden'){
            this.setState({ type: `golden-${input}` })
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
        if(!this.state.time || !this.state.tribute_email || !this.state.type ||
            !this.state.method){
                alert('Please fill in the required fields');
                return;
            }

        if(this._isMounted){
            this.setState({ submitted: true })
        }        

        const resourceEventObject = {
            email: this.state.tribute_email,
            type: this.state.type,
            method: this.state.method,
            time: this.state.time,
            notes: this.state.notes
        };
        if(this.state.type.split('-')[0] === 'golden'){
            resourceEventObject.notes = resourceEventObject.notes + ' (golden used)';
        }

        if (!resourceEventObject.notes.replace(/\s/g, '').length) {
            resourceEventObject.notes = 'none';
        }

        if(this.props.mode === 'edit'){
            resourceEventObject.id = this.props.id;
            await this.props.updateResourceEvent(resourceEventObject);
            
            // Tribute stats updating
            await this.props.resourceEventUpdateTributeStats(this.state.originalEmail,
                this.state.originalType, 'delete');
            await this.props.resourceEventUpdateTributeStats(this.state.tribute_email,
                this.state.type, 'create');
            
            // Life events updating
            if(this.state.type === 'life'){
                await this.props.resourceEventUpdateLifeEvents(this.state.tribute_email,
                this.state.time, 'create');
            }

            // Resource list counts updating (will delete 'used_by' if updated)
            if(this.state.method === 'code'){
                await this.props.fetchTributes();
                await this.props.resourceEventUpdateResourceList(
                    this.state.originalNotes, 'NA', 'delete');
                await this.props.resourceEventUpdateResourceList(
                    this.state.notes.toLowerCase(), this.getTributeName(this.state.tribute_email), 'create');
            }
        } else if(this.props.mode === 'create'){
            await this.props.createResourceEvent(resourceEventObject);

            // Tribute stats updating
            await this.props.resourceEventUpdateTributeStats(this.state.tribute_email,
                this.state.type, 'create');

            // Life events updating
            if(this.state.type === 'life'){
                await this.props.resourceEventUpdateLifeEvents(this.state.tribute_email,
                this.state.time, 'create');
            }
            // Resource list counts updating (there is no undo for this action if edited)
            if(this.state.method === 'code'){
                await this.props.fetchTributes();
                await this.props.resourceEventUpdateResourceList(
                    this.state.notes.toLowerCase(), this.getTributeName(this.state.tribute_email), 'create');
            }
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
        return(
            <Form>
                <Form.Row>
                    <div className="col-4"><Form.Group controlId="time">
                        <Form.Label>Resource Event Time*</Form.Label>
                        <DatePicker
                            showTimeSelect
                            showTimeSelectOnly
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
                        <Form.Label>Resource Type*</Form.Label>    
                        <Form.Control 
                            defaultValue="gained"
                            onChange={this.handleType}
                            as="select"
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
                        <Form.Label>Notes</Form.Label>    
                        <Form.Control 
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
                    defaultValue="gained"
                    onChange={this.handleMethod}
                    as="select"
                >
                    <option value="food">Food</option>
                    <option value="water">Water</option>
                    <option value="medicine">Medicine</option>
                </Form.Control>
                </>
            );
            
        } else if(type !== 'life'){
            return(
                <>
                <Form.Label>Method*</Form.Label>    
                <Form.Control 
                defaultValue="gained"
                onChange={this.handleMethod}
                as="select"
                >
                    <option value="code">Code</option>
                    <option value="purchased">Purchased</option>
                    <option value="other">Other</option>
                </Form.Control>
                </>
            );
        } else {
            return (
                <>
                <Form.Label>Method*</Form.Label>    
                <Form.Control 
                defaultValue="gained"
                onChange={this.handleMethod}
                as="select"
                >
                    <option value="code">Code</option>
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
            <Form.Row>
                <Button variant="danger" onClick={this.handleClose}>Cancel</Button>
                <Button variant="info" onClick={this.handleFormSubmit}>Submit</Button>
            </Form.Row>
        );
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
        resourceEvent: state.selectedResourceEvent
    };
}

export default connect(mapStateToProps, 
{ 
    fetchResourceEvent,
    fetchTributes,
    createResourceEvent,
    updateResourceEvent,
    resourceEventUpdateTributeStats,
    resourceEventUpdateLifeEvents,
    resourceEventUpdateResourceList
})(ResourceEventForm);