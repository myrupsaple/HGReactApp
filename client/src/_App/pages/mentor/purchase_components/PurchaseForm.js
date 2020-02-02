import React from 'react';
import { connect } from 'react-redux';
import { Form, Button, Modal } from 'react-bootstrap';

import {
    createPurchaseRequest,
    updatePurchaseRequest,
    fetchPurchaseRequest,
    purchaseUpdateStatus,
    purchaseUpdateFunds,
    purchaseUpdateItemQuantity,
    fetchAllItems,
    fetchItem
} from '../../../../actions';

class PurchaseForm extends React.Component{
    _isMounted = false;
    constructor(props){
        super(props);

        this.state = {
            showModal: true,
            firstConfirm: false,
            submitted: false,
            payer_email: '',
            receiver_email: '',
            category: '',
            item: '',
            item_name: '',
            item_id: '',
            originalCost: 0,
            cost: 100,
            quantity: 1,
            maxQuantity: 1,
        }

        this.handlePayer = this.handlePayer.bind(this);
        this.handleReceiver = this.handleReceiver.bind(this);
        this.handleCategory = this.handleCategory.bind(this);
        this.handleItem = this.handleItem.bind(this);
        this.handleQuantity = this.handleQuantity.bind(this);
    }

    componentDidMount = async () => {
        this._isMounted = true;
        if(this.props.mode === 'edit'){
            await this.props.fetchPurchaseRequest(this.props.id);

            const purchase = this.props.purchase;

            if(this._isMounted){
                this.setState({
                    payer_email: purchase.payer_email,
                    receiver_email: purchase.receiver_email,
                    category: purchase.category,
                    item_name: purchase.item_name,
                    item_id: purchase.item_id,
                    originalCost: purchase.cost,
                    cost: purchase.cost,
                    quantity: purchase.quantity
                })

                if(this.state.category === 'item'){
                    this.setState({ item: `${purchase.item_name}|${purchase.item_id}` });
                    await this.props.fetchItem(purchase.item_id);
                }
            }
        }
        await this.props.fetchAllItems();
    }

    handlePayer(event){
        if(this.state.payer_email === this.state.receiver_email){
            this.setState({ receiver_email: '' });
        }
        this.setState({ payer_email: event.target.value });
    }
    handleReceiver(event){
        this.setState({ receiver_email: event.target.value });
    }
    handleCategory(event){
        this.setState({ category: event.target.value, item: '' });
    }

    // Will only ever be accessed for item and resource purchases
    async handleItem(event){
        const input = event.target.value;

        if(input !== ''){
            if(this.state.category === 'item'){
                const [ name, id ] = input.split('|');
                await this.props.fetchItem(id);
                this.setState({ item: input, item_name: name, item_id: id });
            } else if(this.state.catagory === 'resource'){
                const name = '';
                const id = '';
                switch(input){
                    case 'food_resource':
                        await this.props.fectchItem()
                }
            }
        }
    }
    handleQuantity(event){
        this.setState({ quantity: event.target.value });
    }

    handleClose = () => {
        if(this._isMounted){
            this.setState({ showModal: false });
        }
        this.props.onSubmitCallback();
    }

    handleSubmit = async () => {
        if(!this.state.payer_email || !this.state.receiver_email || !this.state.category){
            return null;
        }
        if(this.state.category === 'item'){
            if(!this.state.item || !this.state.quantity){
                return null;
            }
        }

        this.setState({ submitted: true });

        const now = new Date();
        const time = now.getHours() * 60 + now.getMinutes();

        if(this.state.category !== 'item'){
            this.setState({ item: this.state.item, quantity: 1, item_id: 9999 });
        }

        const [ name, id ] = this.state.item.split('|');
        const totalCost = this.props.selectedItem.tier1_cost * this.state.quantity;

        const purchaseRequest = {
            time: time,
            status: 'pending',
            mentor_email: this.props.userEmail,
            payer_email: this.state.payer_email,
            receiver_email: this.state.receiver_email,
            category: this.state.category,
            item_name: name,
            item_id: id,
            cost: totalCost,
            quantity: this.state.quantity
        }

        if(this.props.mode === 'edit'){
            purchaseRequest.id = this.props.id;
            await this.props.updatePurchaseRequest(purchaseRequest);
        } else if(this.props.mode === 'create'){
            await this.props.createPurchaseRequest(purchaseRequest);
        }

        if(this.state.category === 'item'){
            this.props.purchaseUpdateItemQuantity(this.state.item_id, this.state.quantity);
        }

        this.props.purchaseUpdateFunds(this.state.payer_email, totalCost - this.state.originalCost);

        setTimeout(() => this.handleClose(), 1000)
    }

    renderModalHeader = () => {
        if(this.state.firstConfirm){
            return 'Confirm Request';
        }
        
        if(this.props.mode === 'edit'){
            return 'Modify Purchase Request';
        } else if(this.props.mode === 'create'){
            return 'Create Purchase Request';
        } else {
            return 'Something unexpected happened.'
        }
    }

    renderModalBody = () => {
        if(this.state.submitted){
            const message = this.props.mode === 'edit' ? 'edited' : 'created';
            return <h3>Purchase request {message} successfully!</h3>
        } else if(this.state.firstConfirm){
            const totalCost = this.props.selectedItem.tier1_cost * this.state.quantity;
            const diff = totalCost - this.state.originalCost;
            const purchasingTribute = this.getTributeName(this.state.payer_email);

            var message = '';
            var extraText = '';
            if(diff > 0){
                extraText = `${purchasingTribute} will be refunded the difference of $${diff}.`;
            } else if (diff < 0){
                extraText = `${purchasingTribute} will be charged the difference of $${diff}.`;
            } else {
                extraText = `${purchasingTribute} will not be charged again.`
            }
            if(this.props.mode === 'edit'){
                message = `The request you are editing had a previous total of $${this.state.originalCost}.
                Your new request has a total of $${totalCost}. ${extraText}`;
            } else {
                message = `${purchasingTribute} will be charged $${totalCost} for this transaction upon submit.
                This will be refunded if the request is deleted or rejected.`
            }

            return(
                <div style={{ marginLeft: "20px" }}>
                    <div className="row">
                        <span className="font-weight-bold">Paying Tribute:</span>
                        <span>&nbsp;{purchasingTribute}</span>
                    </div>
                    <div className="row">
                        <span className="font-weight-bold">Receiving Tribute:</span>
                        <span>&nbsp;{this.getTributeName(this.state.receiver_email)}</span>
                    </div>
                    <div className="row">
                        <span className="font-weight-bold">Category:</span>
                        <span>&nbsp;{this.state.category}</span>
                    </div>
                    <div className="row">
                        <span className="font-weight-bold">Item:</span>
                        <span>&nbsp;{this.state.item_name}</span>
                    </div>
                    <div className="row">
                        <span className="font-weight-bold">Quantity:</span>
                        <span>&nbsp;{this.state.quantity}</span>
                    </div>
                    <div className="row">
                        <span className="font-weight-bold">Total Cost:</span>
                        <span>&nbsp;${totalCost}</span>
                    </div>
                    <h6>{message}</h6>
                </div>
            );
        }
        return(
            <>
                {this.renderForm()}
            </>
        );
    }

    getTributeName(email){
        for (let tribute of this.props.tributes){
            if(tribute.email === email){
                return `${tribute.first_name} ${tribute.last_name}`;
            }
        }
    }

    renderForm = () => {  
        return(
            <Form>
                <Form.Row>
                    <div className="col-12"><Form.Group controlId="payer">
                        <Form.Label>Purchasing Tribute</Form.Label>
                        <Form.Control
                            value={this.state.payer_email}
                            onChange={this.handlePayer}
                            as="select"
                        >
                            {this.renderTributeChoices()}
                        </Form.Control>
                    </Form.Group></div>
                </Form.Row>
                <Form.Row>
                    <div className="col-12"><Form.Group controlId="receiver">
                        <Form.Label>Receiving Tribute</Form.Label>
                        <Form.Control
                            value={this.state.receiver_email}
                            onChange={this.handleReceiver}
                            as="select"
                        >
                            {this.renderTributeChoices()}
                        </Form.Control>
                    </Form.Group></div>
                </Form.Row>
                <Form.Row>
                    <div className="col-12"><Form.Group controlId="category">
                        <Form.Label>Select a Category...</Form.Label>
                        <Form.Control
                            value={this.state.category}
                            onChange={this.handleCategory}
                            as="select"
                        >
                            {this.renderCategoryChoices()}
                        </Form.Control>
                    </Form.Group></div>
                </Form.Row>
                {this.renderItemMenu(this.state.category)}
                {this.renderQuantityChoices(this.state.category)}
            </Form>
        )
    }

    renderCategoryChoices = () => {
        if(this.state.payer_email !== '' && this.state.receiver_email !== ''){
            return(
                <>
                <option value="">Please select a Category...</option>
                <option value="item">Item</option>
                <option value="resource">Resource</option>
                <option value="life">Life</option>
                <option value="immunity">Immunity</option>
                <option value="transfer">Transfer Funds</option>
                </>
            );
        } else {
            return(
                <option value="">Please Select Tributes...</option>
            );
        }
    }

    renderTributeChoices = () => {
        return(
            <>
                <option value="">Please select a Tribute...</option>
                {this.props.tributes.map(tribute => {
                    if(tribute.mentor_email !== this.props.userEmail){
                        return null;
                    }
                    return(
                        <option key={tribute.id} value={tribute.email}>
                            {tribute.first_name} {tribute.last_name} || {tribute.email}
                        </option>
                    );
                })}
            </>
        );
    }

    renderItemMenu = (category) => {
        var message = null;

        if(category === 'item'){
            message = 'Select Item'
        } else if(category === 'resource'){
            message = 'Select Resource Category'
        } else {
            return null;
        }

        return(
            <Form.Row>
                <div className="col-12"><Form.Group controlId="item">
                    <Form.Label>{message}</Form.Label>
                    <Form.Control
                        value={this.state.item}
                        onChange={this.handleItem}
                        as="select"
                    >
                        {this.renderItemChoices(category)}
                    </Form.Control>
                </Form.Group></div>
            </Form.Row>
        );
    }
    
    renderItemChoices = (category) => {
        if(category === 'item'){
            const items = this.props.items;
            return (
                <>
                    <option value="">Please choose an item...</option>
                    {items.map(item => {
                        // ID >= 1000 reserved for special items (lives, resources, etc.)
                        if(item.id < 1000){ return null; }
                    return(
                        <option key={item.id} value={`${item.item_name}|${item.id}`}>{item.item_name}: "{item.description}" (${item.tier1_cost} each) </option>
                    );
                    })}
                </>
            );
        } else if(category === 'resource'){
            return(
                <>
                    <option value="">Please choose a resource...</option>
                    <option value="food_resource">Food</option>
                    <option value="water_resource">Water</option>
                    <option value="medicine_resource">Medicine</option>
                    <option value="golden_resource">Golden</option>
                </>
            );
        }
    }

    renderQuantityChoices(category){
        // The third check ensures that selectedItem is loaded
        if(category !== 'item' || this.state.item === '' || Object.keys(this.props.selectedItem).length === 0){
            return null;
        }
        const choices = [];
        for(let i = 1; i <= this.props.selectedItem.quantity; i++){
            choices.push(i);
        }
        return (
            <Form.Row>
                <div className="col-4"><Form.Group controlId="quantity">
                    <Form.Label>How Many?</Form.Label>
                    <Form.Control
                        value={this.state.quantity}
                        onChange={this.handleQuantity}
                        as="select"
                    >
                        {choices.map(choice => {
                            return <option key={choice} value={choice}>{choice}</option>;
                        })} 
                    </Form.Control>
                </Form.Group></div>
            </Form.Row>
        );
    }

    renderModalFooter = () => {
        if(this.state.submitted){
            return null;
        } else if(this.state.firstConfirm){
            return(
                <>
                    <Button onClick={this.handleSubmit} variant="info">
                        Send Request
                    </Button>
                    <Button onClick={() => this.setState({ firstConfirm: false })} variant="danger">
                        Go Back
                    </Button>
                </>
            );
        } else {
            return(
                <>
                <Button onClick={() => this.setState({ firstConfirm: true })} variant="info">
                    Confirm
                </Button>
                <Button onClick={this.handleClose} variant="danger">
                    Cancel
                </Button>
                </>
            );
        }
    }

    render = () => {
        console.log(this.state);
        return(
            <>
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
            </>
        );
    }

    componentWillUnmount(){
        this._isMounted = false;
    }
}

const mapStateToProps = state => {
    return {
        purchase: state.selectedPurchase,
        items: Object.values(state.items),
        selectedItem: state.selectedItem,
        userEmail: state.auth.userEmail
    };
}

export default connect(mapStateToProps, 
    {
        createPurchaseRequest,
        updatePurchaseRequest,
        fetchPurchaseRequest,
        purchaseUpdateStatus,
        purchaseUpdateFunds,
        purchaseUpdateItemQuantity,
        fetchAllItems,
        fetchItem
    })(PurchaseForm);