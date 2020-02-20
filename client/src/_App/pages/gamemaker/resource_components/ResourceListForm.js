import React from 'react';
import { connect } from 'react-redux';
import { Form, Button, Modal } from 'react-bootstrap';

import { 
    fetchResourceListItem, 
    createResourceListItem,
    updateResourceListItem,
    fetchResourceListItemByCode
} from '../../../../actions';

class ResourceListForm extends React.Component {
    _isMounted = false;

    constructor(props){
        super(props);
        this.state = {
            code: '',
            type: 'food',
            timesUsed: 0,
            maxUses: 1,
            usedBy: ' ',
            notes: 'None',
            // Validation
            codeValid: 1,
            maxUsesValid: 1,
            formValid: 1,
            // Handle Modal
            showModal: true,
            submitted: false,
            // API error handling
            apiError: false
        };

        this.handleCode = this.handleCode.bind(this);
        this.handleType = this.handleType.bind(this);
        this.handleMaxUses = this.handleMaxUses.bind(this);
        this.handleNotes = this.handleNotes.bind(this);
    }

    async componentDidMount(){
        this._isMounted = true;
        if(this.props.mode === 'edit'){
            const response = await this.props.fetchResourceListItem(this.props.id);
            if(!response){
                return null;
            }
            
            if(this._isMounted){
                this.setState({
                    code: this.props.selectedResource.code,
                    type: this.props.selectedResource.type,
                    timesUsed: this.props.selectedResource.times_used,
                    maxUses: this.props.selectedResource.max_uses,
                    usedBy: this.props.selectedResource.used_by,
                    notes: this.props.selectedResource.notes,
                    codeValid: 0,
                    maxUsesValid: 0
                })
            }
        }
    }

    handleCode(event){
        const input = event.target.value;
        this.setState({ code: input });
        if(input.replace(/\s/g, '') === ''){
            this.setState({ codeValid: 2 });
        } else{
            this.setState({ codeValid: 0 });
        }
    }
    handleType(event){
        this.setState({ type: event.target.value });
    }
    handleMaxUses(event){
        const input = event.target.value
        this.setState({ maxUses: input });
        if(input === ''){
            this.setState({ maxUsesValid: 2 });
        } else if(isNaN(input)){
            this.setState({ maxUsesValid: 3 });
        } else if(Math.floor(input) <= 0){
            this.setState({ maxUsesValid: 4 });
        } else {
            this.setState({ maxUsesValid: 0 });
        }
    }
    handleNotes(event){
        this.setState({ notes: event.target.value });
    }


    handleFormSubmit = async () => {
        if(this.state.codeValid === 1){
            this.setState({ codeValid: 2 });
        }
        if(this.state.maxUsesValid === 1 && (isNaN(this.state.maxUses) || this.state.maxUses <= 0)){
            this.setState({ maxUsesValid: 2 });
        } else {
            await this.setState({ maxUsesValid: 0 });
        }

        if(this.state.codeValid + this.state.maxUsesValid !== 0){
            this.setState({ formValid: 2 });
            return null;
        }

        if(this.props.mode === 'create'){
            const response = await this.props.fetchResourceListItemByCode(this.state.code);
            if(!response){
                this.setState({ apiError: true });
                return null;
            }
            if(Object.entries(this.props.selectedResource).length !== 0){
                this.setState({ codeValid: 3, formValid: 2 });
                return null;
            }
        }

        const resourceItem = {
            code: encodeURIComponent(this.state.code.toLowerCase()),
            type: this.state.type,
            timesUsed: this.state.timesUsed,
            maxUses: this.state.maxUses,
            usedBy: this.state.usedBy,
            notes: encodeURIComponent(this.state.notes)
        };
        if (!resourceItem.notes.replace(/\s/g, '').length) {
            resourceItem.notes = 'none';
        }

        if(this.props.mode === 'edit'){
            resourceItem.id = this.props.id;
            const response = await this.props.updateResourceListItem(resourceItem);
            if(!response){
                this.setState({ apiError: true });
                return null;
            }
        } else if(this.props.mode === 'create'){
            const response = await this.props.createResourceListItem(resourceItem);
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
            return 'Edit Resource Item';
        } else if(this.props.mode === 'create'){
            return 'Create Resource Item';
        } else {
            return 'Something unexpected happened';
        }
    }

    renderModalBody(){
        const message = this.props.mode === 'edit' ? 'edited' : 'created';
        if(this.state.submitted){
            return(
                <h4>Resource {message} successfully!</h4>
            );
        } else if(this.props.mode === 'edit' && !this.props.selectedResource.code){
            return <h3>An error occured while retrieving resource list data. Please try again.</h3> 
        } else {
            return <>{this.renderForm()}</>
        }
    }

    renderForm = () => {
        return(
            <Form>
                <Form.Row>
                    <div className="col-12"><Form.Group controlId="tribute">
                        <Form.Label>Resource Code (case insensitive)*</Form.Label>    
                        <Form.Control 
                            value={this.state.code} 
                            onChange={this.handleCode} 
                            autoComplete="off"
                        />
                        {this.renderCodeValidation()}
                    </Form.Group></div>
                </Form.Row>
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
                        <Form.Label>Maximum Uses*</Form.Label>
                        <Form.Control 
                            value={this.state.maxUses}
                            onChange={this.handleMaxUses}
                        />
                        {this.renderMaxUsesValidation()}
                    </Form.Group></div>
                </Form.Row>
                <Form.Row>
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
    
    renderCodeValidation = () => {
        if(this.state.codeValid === 2){
            return(
                <p className="coolor-text-red" style={{ fontSize: "8pt" }}>
                    <span role="img" aria-label="check/x">&#10071;</span> Code is required
                </p>
            );
        } else if(this.state.codeValid === 3){
            return(
                <p className="coolor-text-red" style={{ fontSize: "8pt" }}>
                    <span role="img" aria-label="check/x">&#10071;</span> Code already exists
                </p>
            );
        } else if(this.state.codeValid === 0) {
            return(
                <p className="coolor-text-green" style={{ fontSize: "8pt" }}>
                    <span role="img" aria-label="check/x">&#10003;</span> Code
                </p>
            );
        } else {
            return null;
        }
    }
    renderMaxUsesValidation = () => {
        if(this.state.maxUsesValid === 2){
            return(
                <p className="coolor-text-red" style={{ fontSize: "8pt" }}>
                    <span role="img" aria-label="check/x">&#10071;</span> Max uses is required
                </p>
            );
        } else if (this.state.maxUsesValid === 3){
            return(
                <p className="coolor-text-red" style={{ fontSize: "8pt" }}>
                    <span role="img" aria-label="check/x">&#10071;</span> Max uses must be a number
                </p>
            );
        } else if (this.state.maxUsesValid === 4){
            return(
                <p className="coolor-text-red" style={{ fontSize: "8pt" }}>
                    <span role="img" aria-label="check/x">&#10071;</span> Max uses must be positive
                </p>
            );
        } else if(this.state.maxUsesValid === 0) {
            return(
                <p className="coolor-text-green" style={{ fontSize: "8pt" }}>
                    <span role="img" aria-label="check/x">&#10003;</span> Max uses
                </p>
            );
        } else {
            return null;
        }
    }
    renderFormValidation = () => {
        if(this.state.submitted){
            return null;
        } else if(this.props.mode === 'edit' && !this.props.selectedResource.code){
            return null;
        } 
        if(this.state.codeValid + this.state.maxUsesValid === 0) {
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
        selectedResource: state.selectedResource
    };
}

export default connect(mapStateToProps, 
{ 
    fetchResourceListItem,
    createResourceListItem,
    updateResourceListItem,
    fetchResourceListItemByCode
})(ResourceListForm);