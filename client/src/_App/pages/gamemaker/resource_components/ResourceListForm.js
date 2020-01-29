import React from 'react';
import { connect } from 'react-redux';
import { Form, Button, Modal } from 'react-bootstrap';

import { 
    fetchResourceListItem, 
    createResourceListItem,
    updateResourceListItem
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
            usedBy: '{not used}',
            notes: 'None',
            showModal: true,
            submitted: false
        };

        this.handleCode = this.handleCode.bind(this);
        this.handleType = this.handleType.bind(this);
        this.handleMaxUses = this.handleMaxUses.bind(this);
        this.handleNotes = this.handleNotes.bind(this);
    }

    async componentDidMount(){
        this._isMounted = true;
        if(this.props.mode === 'edit'){
            await this.props.fetchResourceListItem(this.props.id);
            
            if(this._isMounted){
                this.setState({
                    code: this.props.selectedResource.code,
                    type: this.props.selectedResource.type,
                    timesUsed: this.props.selectedResource.times_used,
                    maxUses: this.props.selectedResource.max_uses,
                    usedBy: this.props.selectedResource.used_by,
                    notes: this.props.selectedResource.notes,
                })
            }
        }
    }

    handleCode(event){
        this.setState({ code: event.target.value });
    }
    handleType(event){
        this.setState({ type: event.target.value });
    }
    handleMaxUses(event){
        this.setState({ method: event.target.value });
    }
    handleNotes(event){
        this.setState({ notes: event.target.value });
    }


    handleFormSubmit = async () => {
        if(!this.state.code || !this.state.type || !this.state.maxUses){
                alert('Please fill in the required fields');
                return;
            }

        if(this._isMounted){
            this.setState({ submitted: true })
        }

        const resourceItem = {
            code: this.state.code,
            type: this.state.type,
            timesUsed: this.state.timesUsed,
            maxUses: this.state.maxUses,
            usedBy: this.state.usedBy,
            notes: this.state.notes
        };
        if (!resourceItem.notes.replace(/\s/g, '').length) {
            resourceItem.notes = 'none';
        }

        if(this.props.mode === 'edit'){
            resourceItem.id = this.props.id;
            this.props.updateResourceListItem(resourceItem);
        } else if(this.props.mode === 'create'){
            this.props.createResourceListItem(resourceItem);
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
        selectedResource: state.selectedResource
    };
}

export default connect(mapStateToProps, 
{ 
    fetchResourceListItem,
    createResourceListItem,
    updateResourceListItem
})(ResourceListForm);