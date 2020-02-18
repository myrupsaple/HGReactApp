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
            // Validation
            nameValid: 1,
            descriptionValid: 1,
            quantityValid: 0,
            t1Valid: 0,
            t2Valid: 0,
            t3Valid: 0,
            t4Valid: 0,
            formValid: 1,
            // Handle Modal
            showModal: true, 
            submitted: false,
            // API error handling
            apiError: false
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
            const response = await this.props.fetchItem(this.props.id);
            if(!response){
                return null;
            }
            if(this._isMounted){
                this.setState({
                    name: this.props.selectedItem.item_name,
                    description: this.props.selectedItem.description,
                    quantity: this.props.selectedItem.quantity,
                    tier1_cost: this.props.selectedItem.tier1_cost,
                    tier2_cost: this.props.selectedItem.tier2_cost,
                    tier3_cost: this.props.selectedItem.tier3_cost,
                    tier4_cost: this.props.selectedItem.tier4_cost,
                    nameValid: 0,
                    descriptionValid: 0,
                    quantityValid: 0,
                    t1Valid: 0,
                    t2Valid: 0,
                    t3Valid: 0,
                    t4Valid: 0
                });
            }
        }
    }

    handleName(event) {
        const input = event.target.value;
        this.setState({ name: input });
        if(input.replace(/\s/g, '') === ''){
            this.setState({ nameValid: 2 });
        } else {
            this.setState({ nameValid: 0 });
        }
    }
    handleDescription(event) {
        const input = event.target.value;
        this.setState({ description: input });
        if(input.replace(/\s/g, '') === ''){
            this.setState({ descriptionValid: 2 });
        } else {
            this.setState({ descriptionValid: 0 });
        }
    }
    handleQuantity(event) {
        const input = event.target.value;
        this.setState({ quantity: input });
        if(input === ''){
            this.setState({ quantityValid: 2 });
        } else if(isNaN(input)){
            this.setState({ quantityValid: 3 });
        } else if(input <= 0){
            this.setState({ quantityValid: 4 });
        } else {
            this.setState({ quantityValid: 0 });
        }
    }
    handleT1Cost(event) {
        const input = event.target.value;
        this.setState({ tier1_cost: input });
        if(input === ''){
            this.setState({ t1Valid: 2 });
        } else if(isNaN(input)){
            this.setState({ t1Valid: 3 });
        } else if(input <= 0){
            this.setState({ t1Valid: 4 });
        } else {
            this.setState({ t1Valid: 0 });
        }
    }
    handleT2Cost(event) {
        const input = event.target.value;
        this.setState({ tier2_cost: input });
        if(input === ''){
            this.setState({ t2Valid: 2 });
        } else if(isNaN(input)){
            this.setState({ t2Valid: 3 });
        } else if(input <= 0){
            this.setState({ t2Valid: 4 });
        } else {
            this.setState({ t2Valid: 0 });
        }
    }
    handleT3Cost(event) {
        const input = event.target.value;
        this.setState({ tier3_cost: input });
        if(input === ''){
            this.setState({ t3Valid: 2 });
        } else if(isNaN(input)){
            this.setState({ t3Valid: 3 });
        } else if(input <= 0){
            this.setState({ t3Valid: 4 });
        } else {
            this.setState({ t3Valid: 0 });
        }
    }
    handleT4Cost(event) {
        const input = event.target.value;
        this.setState({ tier4_cost: input });
        if(input === ''){
            this.setState({ t4Valid: 2 });
        } else if(isNaN(input)){
            this.setState({ t4Valid: 3 });
        } else if(input <= 0){
            this.setState({ t4Valid: 4 });
        } else {
            this.setState({ t4Valid: 0 });
        }
    }

    handleFormSubmit = async () => {
        if(this.state.nameValid === 1){
            this.setState({ nameValid: 2 });
        }
        if(this.state.descriptionValid === 1){
            this.setState({ descriptionValid: 2 });
        }

        if(this.state.nameValid + this.state.descriptionValid + this.state.quantityValid + 
            this.state.t1Valid + this.state.t2Valid + this.state.t3Valid + this.state.t4Valid !== 0){
                this.setState({ formValid: 2 });
                return null;
            }

        const itemObject = {
            name: encodeURIComponent(this.state.name),
            description: encodeURIComponent(this.state.description),
            quantity: this.state.quantity,
            tier1_cost: this.state.tier1_cost,
            tier2_cost: this.state.tier2_cost,
            tier3_cost: this.state.tier3_cost,
            tier4_cost: this.state.tier4_cost
        };
        if(this.props.mode === 'edit'){
            itemObject.id = this.props.selectedItem.id;
            const response = await this.props.updateItem(itemObject);
            if(!response){
                this.setState({ apiError: true });
                return null;
            }
        } else if(this.props.mode === 'create') {
            const response = await this.props.createItem(itemObject);
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
                        <Form.Label>Item name*</Form.Label>
                        <Form.Control value={this.state.name}
                            onChange={this.handleName}
                            autoComplete="off"
                            disabled={this.props.id < 1000 ? true : false}
                        />
                        {this.renderNameValidation()}
                    </Form.Group></div>
                    <div className="col-4"><Form.Group controlId="quantity">
                        <Form.Label>Quantity*</Form.Label>
                        <Form.Control value={this.state.quantity}
                            onChange={this.handleQuantity}
                            autoComplete="off"
                            disabled={this.props.id < 1000 ? true : false}
                        />
                        {this.renderQuantityValidation()}
                    </Form.Group></div>
                </Form.Row>
                <Form.Row>
                    <div className="col-12"><Form.Group controlId="description">
                        <Form.Label>Item Description*</Form.Label>
                        <Form.Control value={this.state.description}
                            onChange={this.handleDescription}
                            autoComplete="off"
                            disabled={this.props.id < 1000 ? true : false}
                        />
                        {this.renderDescriptionValidation()}
                    </Form.Group></div>
                </Form.Row>
                <Form.Row>
                    <div className="col-3"><Form.Group controlId="tier1-cost">
                        <Form.Label>Tier 1 Cost*</Form.Label>
                        <Form.Control value={this.state.tier1_cost}
                            onChange={this.handleT1Cost}
                            autoComplete="off"
                        />
                        {this.renderT1Validation()}
                    </Form.Group></div>
                    <div className="col-3"><Form.Group controlId="tier2-cost">
                        <Form.Label>Tier 2 Cost*</Form.Label>
                        <Form.Control value={this.state.tier2_cost}
                            onChange={this.handleT2Cost}
                            autoComplete="off"
                        />
                        {this.renderT2Validation()}
                    </Form.Group></div>
                    <div className="col-3"><Form.Group controlId="tier3-cost">
                        <Form.Label>Tier 3 Cost*</Form.Label>
                        <Form.Control value={this.state.tier3_cost}
                            onChange={this.handleT3Cost}
                            autoComplete="off"
                        />
                        {this.renderT3Validation()}
                    </Form.Group></div>
                    <div className="col-3"><Form.Group controlId="tier4-cost">
                        <Form.Label>Tier 4 Cost*</Form.Label>
                        <Form.Control value={this.state.tier4_cost}
                            onChange={this.handleT4Cost}
                            autoComplete="off"
                        />
                        {this.renderT4Validation()}
                    </Form.Group></div>
                </Form.Row>
            </Form>
        );
    }

    renderNameValidation = () =>{
        if(this.state.nameValid === 2){
            return(
                <p className="coolor-text-red" style={{ fontSize: "8pt" }}>
                    <span role="img" aria-label="check/x">&#10071;</span> Item name is required
                </p>
            );
        } else if(this.state.nameValid === 0) {
            return(
                <p className="coolor-text-green" style={{ fontSize: "8pt" }}>
                    <span role="img" aria-label="check/x">&#10003;</span> Item name
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
                    <span role="img" aria-label="check/x">&#10071;</span> Item description is required
                </p>
            );
        } else if(this.state.descriptionValid === 0) {
            return(
                <p className="coolor-text-green" style={{ fontSize: "8pt" }}>
                    <span role="img" aria-label="check/x">&#10003;</span> Item description
                </p>
            );
        } else {
            return null;
        }
    }
    renderQuantityValidation = () =>{
        if(this.state.quantityValid === 2){
            return(
                <p className="coolor-text-red" style={{ fontSize: "8pt" }}>
                    <span role="img" aria-label="check/x">&#10071;</span> Quantity is required
                </p>
            );
        } else if (this.state.quantityValid === 3){
            return(
                <p className="coolor-text-red" style={{ fontSize: "8pt" }}>
                    <span role="img" aria-label="check/x">&#10071;</span> Quantity must be a number
                </p>
            );
        } else if (this.state.quantityValid === 4){
            return(
                <p className="coolor-text-red" style={{ fontSize: "8pt" }}>
                    <span role="img" aria-label="check/x">&#10071;</span> Quantity must be positive
                </p>
            );
        } else if(this.state.quantityValid === 0) {
            return(
                <p className="coolor-text-green" style={{ fontSize: "8pt" }}>
                    <span role="img" aria-label="check/x">&#10003;</span> Quantity
                </p>
            );
        } else {
            return null;
        }
    }
    renderT1Validation = () =>{
        if(this.state.t1Valid === 2){
            return(
                <p className="coolor-text-red" style={{ fontSize: "8pt" }}>
                    <span role="img" aria-label="check/x">&#10071;</span> Cost is required
                </p>
            );
        } else if (this.state.t1Valid === 3){
            return(
                <p className="coolor-text-red" style={{ fontSize: "8pt" }}>
                    <span role="img" aria-label="check/x">&#10071;</span> Cost must be a number
                </p>
            );
        } else if (this.state.t1Valid === 4){
            return(
                <p className="coolor-text-red" style={{ fontSize: "8pt" }}>
                    <span role="img" aria-label="check/x">&#10071;</span> Cost must be positive
                </p>
            );
        } else if(this.state.t1Valid === 0) {
            return(
                <p className="coolor-text-green" style={{ fontSize: "8pt" }}>
                    <span role="img" aria-label="check/x">&#10003;</span> Tier 1 Cost
                </p>
            );
        } else {
            return null;
        }
    }
    renderT2Validation = () =>{
        if(this.state.t2Valid === 2){
            return(
                <p className="coolor-text-red" style={{ fontSize: "8pt" }}>
                    <span role="img" aria-label="check/x">&#10071;</span> Cost is required
                </p>
            );
        } else if (this.state.t2Valid === 3){
            return(
                <p className="coolor-text-red" style={{ fontSize: "8pt" }}>
                    <span role="img" aria-label="check/x">&#10071;</span> Cost must be a number
                </p>
            );
        } else if (this.state.t2Valid === 4){
            return(
                <p className="coolor-text-red" style={{ fontSize: "8pt" }}>
                    <span role="img" aria-label="check/x">&#10071;</span> Cost must be positive
                </p>
            );
        } else if(this.state.t2Valid === 0) {
            return(
                <p className="coolor-text-green" style={{ fontSize: "8pt" }}>
                    <span role="img" aria-label="check/x">&#10003;</span> Tier 2 Cost
                </p>
            );
        } else {
            return null;
        }
    }
    renderT3Validation = () =>{
        if(this.state.t3Valid === 2){
            return(
                <p className="coolor-text-red" style={{ fontSize: "8pt" }}>
                    <span role="img" aria-label="check/x">&#10071;</span> Cost is required
                </p>
            );
        } else if (this.state.t3Valid === 3){
            return(
                <p className="coolor-text-red" style={{ fontSize: "8pt" }}>
                    <span role="img" aria-label="check/x">&#10071;</span> Cost must be a number
                </p>
            );
        } else if (this.state.t3Valid === 4){
            return(
                <p className="coolor-text-red" style={{ fontSize: "8pt" }}>
                    <span role="img" aria-label="check/x">&#10071;</span> Cost must be positive
                </p>
            );
        } else if(this.state.t3Valid === 0) {
            return(
                <p className="coolor-text-green" style={{ fontSize: "8pt" }}>
                    <span role="img" aria-label="check/x">&#10003;</span> Tier 3 Cost
                </p>
            );
        } else {
            return null;
        }
    }
    renderT4Validation = () =>{
        if(this.state.t4Valid === 2){
            return(
                <p className="coolor-text-red" style={{ fontSize: "8pt" }}>
                    <span role="img" aria-label="check/x">&#10071;</span> Cost is required
                </p>
            );
        } else if (this.state.t4Valid === 3){
            return(
                <p className="coolor-text-red" style={{ fontSize: "8pt" }}>
                    <span role="img" aria-label="check/x">&#10071;</span> Cost must be a number
                </p>
            );
        } else if (this.state.t4Valid === 4){
            return(
                <p className="coolor-text-red" style={{ fontSize: "8pt" }}>
                    <span role="img" aria-label="check/x">&#10071;</span> Cost must be positive
                </p>
            );
        } else if(this.state.t4Valid === 0) {
            return(
                <p className="coolor-text-green" style={{ fontSize: "8pt" }}>
                    <span role="img" aria-label="check/x">&#10003;</span> Tier 4 Cost
                </p>
            );
        } else {
            return null;
        }
    }
    renderFormValidation = () =>{
        if(this.state.submitted){
            return null;
        } else if(this.props.mode === 'edit' && !this.props.selectedItem.item_name){
            return null;
        } 
        if(this.state.nameValid + this.state.descriptionValid + this.state.quantityValid +
            this.state.t1Valid + this.state.t2Valid + this.state.t3Valid + this.state.t4Valid === 0) {
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
            <>
                {this.renderApiError()}
                <Button variant="danger" onClick={this.handleClose}>Cancel</Button>
                <Button variant="info" onClick={this.handleFormSubmit}>Confirm</Button>
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

    // GOOD EXAMPLE OF PASSING DATA FROM CHILD TO PARENT
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