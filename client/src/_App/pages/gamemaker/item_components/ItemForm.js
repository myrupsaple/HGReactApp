import React from 'react';
import { connect } from 'react-redux';
import { Form, Button, Modal } from 'react-bootstrap';

import { fetchItem, updateItem, createItem } from '../../../../actions';

class ItemForm extends React.Component {
    _isMounted = false;

    constructor(props){
        super(props);
        this.state = { 
            name: '',
            description: '',
            quantity: 1,
            tier1_cost: 10,
            tier2_cost: 20,
            tier3_cost: 30,
            tier4_cost: 40,
            showModal: true, 
            submitted: false
        };

        this.handleName = this.handleName.bind(this);
        this.handleDescription = this.handleDescription.bind(this);
        this.handleQuantity = this.handleQuantity.bind(this);
        this.handleT1Cost = this.handleT1Cost.bind(this);
        this.handleT2Cost = this.handleT2Cost.bind(this);
        this.handleT3Cost = this.handleT3Cost.bind(this);
        this.handleT4Cost = this.handleT4Cost.bind(this);
    }

    async componentDidMount() {
        this._isMounted = true;
        if(this.props.mode === 'edit'){
            await this.props.fetchItem(this.props.id);
            if(this._isMounted){
                this.setState({
                    name: this.props.selectedItem.item_name,
                    description: this.props.selectedItem.description,
                    quantity: this.props.selectedItem.quantity,
                    tier1_cost: this.props.selectedItem.tier1_cost,
                    tier2_cost: this.props.selectedItem.tier2_cost,
                    tier3_cost: this.props.selectedItem.tier3_cost,
                    tier4_cost: this.props.selectedItem.tier4_cost
                });
            }
        }
    }

    handleName(event) {
        this.setState({ name: event.target.value });
    }
    handleDescription(event) {
        this.setState({ description: event.target.value });
    }
    handleQuantity(event) {
        this.setState({ quantity: event.target.value });
    }
    handleT1Cost(event) {
        this.setState({ tier1_cost: event.target.value });
    }
    handleT2Cost(event) {
        this.setState({ tier2_cost: event.target.value });
    }
    handleT3Cost(event) {
        this.setState({ tier3_cost: event.target.value });
    }
    handleT4Cost(event) {
        this.setState({ tier4_cost: event.target.value });
    }

    handleFormSubmit = () => {
        const validated = (this.state.name && this.state.description && this.state.quantity && 
            this.state.tier1_cost && this.state.tier2_cost && this.state.tier3_cost && this.state.tier4_cost);
        if(!validated){
            alert('All fields must be filled in');
            return;
        }
        if(this._isMounted){
            this.setState({ submitted: true })
        }
        if(this.props.mode === 'edit'){
            const itemObject = {
                id: this.props.selectedItem.id,
                name: this.state.name,
                description: this.state.description,
                quantity: this.state.quantity,
                tier1_cost: this.state.tier1_cost,
                tier2_cost: this.state.tier2_cost,
                tier3_cost: this.state.tier3_cost,
                tier4_cost: this.state.tier4_cost
            };
            this.props.updateItem(itemObject);
        } else if(this.props.mode === 'create') {
            const itemObject = {
                name: this.state.name,
                description: this.state.description,
                quantity: this.state.quantity,
                tier1_cost: this.state.tier1_cost,
                tier2_cost: this.state.tier2_cost,
                tier3_cost: this.state.tier3_cost,
                tier4_cost: this.state.tier4_cost
            };
            this.props.createItem(itemObject);
        }
        setTimeout(() => this.handleClose(), 1000);
    }

    renderModalHeader(){
        if(this.props.mode === 'edit'){
            return 'Edit Item';
        } else if(this.props.mode === 'create'){
            return 'Create New Item';
        } else {
            return 'Something unexpected happened.';
        }
    }

    renderModalBody() {
        // Use props for first_name to see if the item was successfully loaded
        // (state may not update right away)
        if(this.state.submitted){
            const message = this.props.mode === 'edit' ? 'Updated' : 'Created';
            return(
                <h4>Item {message} Successfully!</h4>
            )
        } else if(this.props.mode === 'edit' && !this.props.selectedItem.item_name){
            return ( 
                <h3>
                    An error occurred while retrieving item data. Please try again.
                </h3>
            );
        } else {
            return (
                <>
                    {this.renderForm()}
                </>
            );
        }
    }

    renderForm() {
        return (
            <Form>
                <Form.Row>
                    <div className="coolor-text-red-darken-1">
                        {this.renderSpecialText()}
                    </div>
                </Form.Row>
                <Form.Row>
                    <div className="col-8"><Form.Group controlId="name">
                        <Form.Label>Item name</Form.Label>
                        <Form.Control value={this.state.name}
                            onChange={this.handleName}
                            autoComplete="off"
                            disabled={this.props.id < 1000 ? true : false}
                        />
                    </Form.Group></div>
                    <div className="col-4"><Form.Group controlId="quantity">
                        <Form.Label>Quantity</Form.Label>
                        <Form.Control value={this.state.quantity}
                            onChange={this.handleQuantity}
                            autoComplete="off"
                            disabled={this.props.id < 1000 ? true : false}
                        />
                    </Form.Group></div>
                </Form.Row>
                <Form.Row>
                    <div className="col-12"><Form.Group controlId="description">
                        <Form.Label>Item Description</Form.Label>
                        <Form.Control value={this.state.description}
                            onChange={this.handleDescription}
                            autoComplete="off"
                            disabled={this.props.id < 1000 ? true : false}
                        />
                    </Form.Group></div>
                </Form.Row>
                <Form.Row>
                    <div className="col-3"><Form.Group controlId="tier1-cost">
                        <Form.Label>Tier 1 Cost</Form.Label>
                        <Form.Control value={this.state.tier1_cost}
                            onChange={this.handleT1Cost}
                            autoComplete="off"
                        />
                    </Form.Group></div>
                    <div className="col-3"><Form.Group controlId="tier2-cost">
                        <Form.Label>Tier 1 Cost</Form.Label>
                        <Form.Control value={this.state.tier2_cost}
                            onChange={this.handleT2Cost}
                            autoComplete="off"
                        />
                    </Form.Group></div>
                    <div className="col-3"><Form.Group controlId="tier3-cost">
                        <Form.Label>Tier 1 Cost</Form.Label>
                        <Form.Control value={this.state.tier3_cost}
                            onChange={this.handleT3Cost}
                            autoComplete="off"
                        />
                    </Form.Group></div>
                    <div className="col-3"><Form.Group controlId="tier4-cost">
                        <Form.Label>Tier 1 Cost</Form.Label>
                        <Form.Control value={this.state.tier4_cost}
                            onChange={this.handleT4Cost}
                            autoComplete="off"
                        />
                    </Form.Group></div>
                </Form.Row>
            </Form>
        );
    }

    renderSpecialText(){
        if(this.props.id < 1000){
            return 'The name, description, and quantity of this item cannot be edited.';
        } else {
            return null;
        }
    }

    renderModalFooter(){
        if(this.state.submitted){
            return null;
        }
        return(
            <Form.Row>
                <Button variant="danger" onClick={this.handleClose}>Cancel</Button>
                <Button variant="info" onClick={this.handleFormSubmit}>Confirm</Button>
            </Form.Row>
        );
    }

    // GOOD EXAMPLE OF PASSING DATA FROM CHILD TO PARENT
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
        )
    }

    componentWillUnmount(){
        this._isMounted = false;
    }
}

const mapStateToProps = state => {
    return { 
        selectedItem: state.selectedItem
    };
};

export default connect(mapStateToProps, { fetchItem, updateItem, createItem })(ItemForm);