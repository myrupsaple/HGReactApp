import React from 'react';
import { connect } from 'react-redux';
import { Form, Modal, Button } from 'react-bootstrap';

import { 
    fetchServerTime,
    fetchTributes,
    createResourceEvent,
    fetchResourceListItemByCode,
    fetchLifeEventByTerms,
    resourceEventUpdateTributeStats,
    resourceEventCreateLifeEvent,
    resourceEventUpdateResourceList
} from '../../../../actions';

class ResourceEventForm extends React.Component {
    _isMounted = false;

    constructor(props){
        super(props);

        this.state = {
            type: 'food',
            typeSecondary: 'food',
            code: 'None',
            // Validation
            emailValid: 1,
            formValid: 1,
            // Handle Modal
            showModal: true,
            firstSubmit: false,
            finalConfirm: false,
            // API error handling
            apiError: false
        };

        this.handleType = this.handleType.bind(this);
        this.handleTypeSecondary = this.handleTypeSecondary.bind(this);
        this.handleCode = this.handleCode.bind(this);
    }

    async componentDidMount(){
        this._isMounted = true;
    }

    handleType(event){
        const input = event.target.value;
        if(input === 'golden'){
            this.setState({ type: 'golden', typeSecondary: 'golden-food' })
        } else {
            this.setState({ type: input, typeSecondary: input });
        }
    }
    handleTypeSecondary(event){
        const input = event.target.value;
        this.setState({ typeSecondary: `golden-${input}` })
    }
    handleCode(event){
        this.setState({ code: event.target.value });
    }

    handleFormSubmit = async (event) => {
        event.preventDefault()

        const dateString = await this.props.fetchServerTime();
        const time = new Date(Date.parse(dateString));
        const timeAsInt = time.getHours() * 60 + time.getMinutes();
        const resourceEventObject = {
            email: this.props.email,
            type: this.state.typeSecondary,
            method: 'code',
            time: timeAsInt,
            notes: encodeURIComponent(this.state.code)
        };

        const code = resourceEventObject.notes.toLowerCase();

        const response1 = await this.props.fetchResourceListItemByCode(code);
        if(!response1){
            this.setState({ apiError: true });
            return null;
        } else {
            this.setState({ apiError: false });
        }
        // If empty, code was invalid
        if(Object.keys(this.props.resource).length === 0){
            this.setState({ formValid: 3 });
            return null;
        } else if(this.props.resource.type !== resourceEventObject.type && this.props.resource.type !== 'golden'){
            this.setState({ formValid: 4 });
            return null;
        } else if(this.props.resource.times_used >= this.props.resource.max_uses){
            this.setState({ formValid: 5 });
            return null;
        }

        if(resourceEventObject.type.includes('golden')){
            resourceEventObject.type = resourceEventObject.type.split('-')[1];
            resourceEventObject.notes = resourceEventObject.notes + ' (golden)';
        }

        // Give an error if an identical life event is found since this is the only way of accessing the paired event
        const response2 = await this.props.fetchLifeEventByTerms(resourceEventObject.email, resourceEventObject.time, resourceEventObject.notes);
        if(!response2){
            this.setState({ apiError: true });
            return null;
        } else if(Object.keys(this.props.lifeEvent).length !== 0){
            this.setState({ formValid: 6 });
        }

        // Point of no return
        if(this._isMounted && !this.state.firstSubmit){
            this.setState({ firstSubmit: true, formValid: 1 });
            return null;
        }

        const response3 = await this.props.createResourceEvent(resourceEventObject);
        if(!response3){
            this.setState({ apiError: true });
            return null;
        }

        // Tribute stats updating
        const response4 = await this.props.resourceEventUpdateTributeStats(resourceEventObject.email,
            resourceEventObject.type, 'create');
        if(!response4){
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

        // Resource list counts updating
        const response5 = await this.props.fetchTributes();
        if(!response5){
            this.setState({ apiError: true });
            return null;
        }
        const response6 = await this.props.resourceEventUpdateResourceList(
            this.getTributeName(resourceEventObject.email), code, 'create');
        if(!response6){
            this.setState({ apiError: true });
            return null;
        }

        if(this._isMounted){
            this.setState({ finalConfirm: true })
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
        if(!this.props.firstSubmit){
            return 'Submit Resource Code';
        } else {
            return `Confirm Resource Submission`;
        }
    }

    renderModalBody(){
        if(this.state.finalConfirm){
            return(
                <h4>Resource submitted successfully!</h4>
            );
        } else if(this.state.firstSubmit){
            const resource = this.props.resource;
            return(
                <>
                    Are you sure you would like to submit this resource?
                    <div style={{ marginLeft: "20px" }}>
                        <div className="row"><span className="font-weight-bold">Resource Type:</span><span>&nbsp;{resource.type}</span></div>
                        <div className="row"><span className="font-weight-bold">Using As:</span><span>&nbsp;{this.state.typeSecondary}</span></div>
                        <div className="row"><span className="font-weight-bold">Resource Code:</span><span>&nbsp;{resource.code}</span></div>
                        <div className="row"><span className="font-weight-bold">Uses Remaining:</span><span>&nbsp;{resource.max_uses - resource.times_used}</span></div>
                    </div>
                </>
            );
        } else {
            return <>{this.renderForm()}</>
        }
    }

    renderForm = () => {
        return(
            <Form onSubmit={this.handleFormSubmit}>
                <Form.Row>
                    <div className="col-6"><Form.Group controlId="type">
                        <Form.Label>Resource Type*</Form.Label>    
                        <Form.Control 
                            value={this.state.type}
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
                    <div className="col-12"><Form.Group controlId="code">
                        <Form.Label>Code</Form.Label>    
                        <Form.Control 
                            value={this.state.code}
                            onChange={this.handleCode}
                            autoComplete="off"
                        />
                    </Form.Group></div>
                </Form.Row>
            </Form>
        );
    }

    renderFormValidation = () => {
        if(this.state.finalConfirm){
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
                        <span role="img" aria-label="check/x">&#10071;</span> Please try again in a couple of minutes.
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

    renderMethodChoices(type){
        if(type.split('-')[0] === 'golden'){
            return(
                <>
                <Form.Label>Use As*</Form.Label>    
                <Form.Control 
                    value={this.state.type.split('-')[1]}
                    onChange={this.handleTypeSecondary}
                    as="select"
                    disabled={this.props.mode === 'edit'}
                >
                    <option value="food">Food</option>
                    <option value="water">Water</option>
                    <option value="medicine">Medicine</option>
                </Form.Control>
                </>
            );
            
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
        }
        return(
            <>
                {this.renderFormValidation()}
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
        lifeEvent: state.selectedLifeEvent,
        resource: state.selectedResource,
        tributes: Object.values(state.tributes)
    };
}

export default connect(mapStateToProps, 
{ 
    fetchServerTime,
    fetchTributes,
    createResourceEvent,
    fetchResourceListItemByCode,
    fetchLifeEventByTerms,
    resourceEventUpdateTributeStats,
    resourceEventCreateLifeEvent,
    resourceEventUpdateResourceList
})(ResourceEventForm);