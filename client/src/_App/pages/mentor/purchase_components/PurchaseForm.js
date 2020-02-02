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
            item_name: '',
            item_id: '',
            amountPaid: 0,
            cost: 100,
            quantity: 1,
        }

        this.handlePayer = this.handlePayer.bind(this);
        this.handleReceiver = this.handleReceiver.bind(this);
        this.handleCategoryItem = this.handleCategoryItem.bind(this);
        this.handleQuantity = this.handleQuantity.bind(this);
        this.handleCost = this.handleCost.bind(this);
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
                    amountPaid: purchase.cost,
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
    async handleCategoryItem(event){
        const input = event.target.value;
        
        this.setState({ item_name: '', item_id: '', cost: 0 });
        // This is here in case the user goes from a selected input to the default
        // option. Prevents a fetch request with a blank query.
        if(input === ''){
            if(event.target.id === 'category'){
                this.setState({ category: '' });
            }
            return;
        }

        if(input !== 'item'){
            this.setState({ quantity: 1 });
        }

        if(input === 'transfer'){
            this.setState({ category: input, item_name: input, item_id: 0 });
            return;
        }
        
        // Check whether input requires a secondary input or not ('item' input)
        if(input === 'resource' || input === 'item'){
            this.setState({ category: input });
        } else {
            // Parse item value if item category is already selected
            var name = '';
            var id = '';
            if(this.state.category === 'item'){
                [name, id] = input.split('|');
                this.setState({ item_name: name, item_id: id });
            } else if(input === 'life' || input === 'immunity'){
                this.setState({ category: input, item_name: input});
            } else {
                this.setState({ item_name: input });
            }

            switch(input){
                case 'life':
                    id = 100;
                    break;
                case 'immunity':
                    id = 200;
                    break;
                case 'golden':
                    id = 300;
                    break;
                case 'food':
                    id = 301;
                    break;
                case 'water':
                    id = 302;
                    break;
                case 'medicine':
                    id = 303;
                    break;
                default:
                    break;
            }
            
            await this.props.fetchItem(id);
            const item = this.props.selectedItem;
    
            this.setState({ item_id: item.id, cost: this.fetchCurrentPrice(item) * this.state.quantity });
        }
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
                this.handleSpecial(input, 'resource');
            }
        }
    }
    handleQuantity(event){
        const input = event.target.value;
        const cost = (this.state.cost / this.state.quantity) * input ;

        this.setState({ quantity: event.target.value, cost: cost });
    }
    // For transfers only
    handleCost(event){
        this.setState({ cost: event.target.value });
    }

    fetchCurrentPrice = (item) => {
        // TODO: This should return the current cost based on the time
        return item.tier1_cost;
    }

    handleClose = () => {
        if(this._isMounted){
            this.setState({ showModal: false });
        }
        this.props.onSubmitCallback();
    }

    handleSubmit = async () => {
        console.log(this.state.item_name);
        if(!this.state.payer_email || !this.state.receiver_email || !this.state.category
        || !this.state.item_name || !this.state.item_id || !this.state.quantity){
            alert('All fields are required');
            return;
        }

        if(!this.state.firstConfirm){
            this.setState({ firstConfirm: true });
            return;
        }

        this.setState({ submitted: true });

        const now = new Date();
        const time = now.getHours() * 60 + now.getMinutes();

        const purchaseRequest = {
            time: time,
            status: 'pending',
            mentor_email: this.props.userEmail,
            payer_email: this.state.payer_email,
            receiver_email: this.state.receiver_email,
            category: this.state.category,
            item_name: this.state.item_name,
            item_id: this.state.item_id,
            cost: this.state.cost,
            quantity: this.state.quantity
        }

        if(this.props.mode === 'edit'){
            purchaseRequest.id = this.props.id;
            await this.props.updatePurchaseRequest(purchaseRequest);
        } else if(this.props.mode === 'create'){
            await this.props.createPurchaseRequest(purchaseRequest);
        }

        // No need to update the 'special items' quantity since they should never run out
        if(this.state.category === 'item'){
            this.props.purchaseUpdateItemQuantity(this.state.item_id, this.state.quantity * -1);
        }

        this.props.purchaseUpdateFunds(this.state.payer_email, (this.state.cost - this.state.amountPaid) * -1);

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
            if(this.state.category === 'transfer'){
                const payingTribute = this.getTributeName(this.state.payer_email);
                const receivingTribute = this.getTributeName(this.state.receiver_email);
                return(
                    <h5>
                        ${this.state.cost} will be transferred from {payingTribute}
                        &nbsp;to {receivingTribute} if the request is approved. {payingTribute}
                        will be charged ${this.state.cost} to hold the request.
                    </h5>
                );
            }

            const totalCost = this.fetchCurrentPrice(this.props.selectedItem) * this.state.quantity;
            const diff = totalCost - this.state.amountPaid;
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
                message = `The request you are editing had a previous total of $${this.state.amountPaid}.
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
                            onChange={this.handleCategoryItem}
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

        if(category === 'transfer'){
            message = 'Enter Transfer Amount'
        } else if(category === 'item'){
            message = 'Select Item'
        } else if(category === 'resource'){
            message = 'Select Resource Type'
        } else {
            return null;
        }

        if(category === 'transfer'){
            return(<Form.Row>
                <div className="col-6"><Form.Group controlId="amount">
                        <Form.Label>{message}</Form.Label>
                        <Form.Control value={this.state.cost}
                            onChange={this.handleCost}
                        />
                </Form.Group></div>
            </Form.Row>)
        } else {
            return(
                <Form.Row>
                    <div className="col-12"><Form.Group controlId="item">
                        <Form.Label>{message}</Form.Label>
                        <Form.Control
                            value={this.state.item}
                            onChange={this.handleCategoryItem}
                            as="select"
                        >
                            {this.renderItemChoices(category)}
                        </Form.Control>
                    </Form.Group></div>
                </Form.Row>
            );
        }
    }
    
    renderItemChoices = (category) => {
        if(category === 'item'){
            const items = this.props.items;
            return (
                <>
                    <option value="">Please choose an item...</option>
                    {items.map(item => {
                        // ID >= 1000 reserved for special items (lives, resources, etc.)
                        if(item.id < 1000) return null;
                        else {
                            return(
                            <option key={item.id} 
                                value={`${item.item_name}|${item.id}`}>
                                {item.item_name}: "{item.description}" (${this.fetchCurrentPrice(item)} each)
                            </option>
                            );
                        }
                    })}
                </>
            );
        } else if(category === 'resource'){
            return(
                <>
                    <option value="">Please choose a resource...</option>
                    <option value="food">Food</option>
                    <option value="water">Water</option>
                    <option value="medicine">Medicine</option>
                    <option value="golden">Golden</option>
                </>
            );
        }
    }

    renderQuantityChoices(category){
        // The third check ensures that selectedItem is loaded
        if(category !== 'item' || this.state.item_id === '' || Object.keys(this.props.selectedItem).length === 0){
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
                <Button onClick={this.handleSubmit} variant="info">
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