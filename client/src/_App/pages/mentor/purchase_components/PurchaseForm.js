import React from 'react';
import { connect } from 'react-redux';
import { Form, Button, Modal } from 'react-bootstrap';

import {
    createPurchaseRequest,
    updatePurchaseRequest,
    fetchPurchaseRequest,
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
            payer_email: '',
            receiver_email: '',
            category: '',
            item_name: '',
            item_id: '',
            amountPaid: 0,
            cost: 100,
            quantity: 1,
            currentPriceTier: 'tier1_cost',
            // Validation
            payerValid: 1,
            receiverValid: 1,
            categoryValid: 1,
            itemValid: 1,
            costValid: 0,
            formValid: 1,
            // Handle Modal
            showModal: true,
            firstConfirm: false,
            submitted: false,
            // API error handling
            apiError: false
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
            const response = await this.props.fetchPurchaseRequest(this.props.id);
            if(!response){
                return null;
            }

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
                    quantity: purchase.quantity,
                    payerValid: 0,
                    receiverValid: 0,
                    categoryValid: 0,
                    itemValid: 0
                })

                if(this.state.category === 'item'){
                    this.setState({ item: `${purchase.item_name}|${purchase.item_id}` });
                    const response = await this.props.fetchItem(purchase.item_id);
                    if(!response){
                        this.setState({ apiError: true });
                        return null;
                    }
                }
            }
        }
        const response = await this.props.fetchAllItems();
        if(!response){
            this.setState({ apiError: true });
            return null;
        }
    }

    handlePayer(event){
        const input = event.target.value;
        this.setState({ payer_email: input });
        if(input === ''){
            this.setState({ payerValid: 2 });
        } else {
            this.setState({ payerValid: 0 });
        }
    }
    handleReceiver(event){
        const input = event.target.value;
        this.setState({ receiver_email: input });
        if(input === ''){
            this.setState({ receiverValid: 2 });
        } else {
            this.setState({ receiverValid: 0 });
        }
    }
    async handleCategoryItem(event){
        const input = event.target.value;
        console.log(event.target.id)
        
        this.setState({ item_name: '', item_id: '', cost: 0, formValid: 1 });

        // Validation
        if(input === ''){
            if(event.target.id === 'category'){
                this.setState({ category: '', categoryValid: 2, itemValid: 1 });
            } else {
                this.setState({ itemValid: 2 });
            }
            return;
        } else {
            if(event.target.id === 'category'){
                await this.setState({ categoryValid: 0, itemValid: 1 });
                if(input === 'life' || input === 'immunity'){
                    this.setState({ itemValid: 0 });
                } else if(input === 'transfer'){
                    this.setState({ itemValid: 0, costValid: 1 });
                    if(this.state.payer_email === this.state.receiver_email){
                        this.setState({ receiverValid: 4})
                    }
                }
            } else {
                this.setState({ itemValid: 0 });
            }
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
            
            const response = await this.props.fetchItem(id);
            if(!response){
                this.setState({ apiError: true });
                return null;
            }
            const item = this.props.selectedItem;
    
            this.setState({ item_id: item.id, cost: this.fetchCurrentPrice(item) * this.state.quantity });
        }
    }
    handleQuantity(event){
        const input = event.target.value;
        const cost = (this.state.cost / this.state.quantity) * input ;

        this.setState({ quantity: event.target.value, cost: cost });
    }
    // For transfers only
    handleCost(event){
        const input = event.target.value;
        this.setState({ cost: input });
        if(input === ''){
            this.setState({ costValid: 4 });
        } else if(isNaN(input)){
            this.setState({ costValid: 5 });
        } else if(Math.floor(input) <= 0){
            this.setState({ costValid: 6 });
        } else {
            this.setState({ costValid: 0 });
        }
    }

    fetchCurrentPrice = (item) => {
        if(!item){
            return null;
        }
        // TODO: This should return the current cost based on the time
        return item[this.state.currentPriceTier];
    }

    handleClose = () => {
        if(this._isMounted){
            this.setState({ showModal: false });
        }
        this.props.onSubmitCallback();
    }

    handleSubmit = async (event) => {
        event.preventDefault();
        if(this.state.payerValid === 1){
            this.setState({ payerValid: 2 });
        } else if(this.state.payerValid === 3){
            if(this.state.payer_email === ''){
                this.setState({ payerValid: 2 });
            } else {
                this.setState({ payerValid: 0 });
            }
        }
        if(this.state.receiverValid === 1){
            this.setState({ receiverValid: 2 });
        } else if(this.state.receiverValid === 3){
            if(this.state.receiver_email === ''){
                this.setState({ receiverValid: 2 });
            } else {
                this.setState({ receiverValid: 0 });
            }
        }
        if(this.state.categoryValid === 1){
            this.setState({ categoryValid: 2 });
        } else if(this.state.categoryValid === 3){
            if(this.state.category === ''){
                this.setState({ categoryValid: 2 });
            } else {
                this.setState({ categoryValid: 0 });
            }
        }
        if(this.state.itemValid === 1){
            this.setState({ itemValid: 2 });
        } else if(this.state.itemValid === 3){
            if(this.state.item_name === ''){
                this.setState({ itemValid: 2 });
            } else {
                this.setState({ itemValid: 0 });
            }
        }
        if(this.state.costValid === 1){
            this.setState({ costValid: 6 });
        } else if(this.state.costValid === 3){
            if(this.state.cost === ''){
                this.setState({ costValid: 4 });
            } else if(isNaN(this.state.cost)){
                this.setState({ costValid: 5 });
            } else if(Math.floor(this.state.cost) <= 0){
                this.setState({ costValid: 6 });
            } else {
                this.setState({ costValid: 0 });
            }
        }

        if(this.state.payerValid + this.state.receiverValid + 
            this.state.categoryValid + this.state.itemValid + this.state.costValid !== 0){
            this.setState({ formValid: 2 });
            return null;
        }

        if(!this.state.firstConfirm){
            this.setState({ firstConfirm: true });
            return null;
        }

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
            const response = await this.props.updatePurchaseRequest(purchaseRequest);
            if(!response){
                this.setState({ apiError: true });
                return null;
            }
        } else if(this.props.mode === 'create'){
            const response = await this.props.createPurchaseRequest(purchaseRequest);
            if(!response){
                this.setState({ apiError: true });
                return null;
            }
        }

        // No need to update the 'special items' quantity since they should never run out
        if(this.state.category === 'item'){
            const response = await this.props.purchaseUpdateItemQuantity(this.state.item_id, this.state.quantity * -1);
            if(!response){
                this.setState({ apiError: true });
                return null;
            }
        }

        const response = await this.props.purchaseUpdateFunds(this.state.payer_email, (this.state.cost - this.state.amountPaid) * -1);
        if(!response){
            this.setState({ apiError: true });
            return null;
        }

        this.setState({ submitted: true });

        setTimeout(() => this.handleClose(), 1000);
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
        } else if(this.props.mode === 'edit' && !this.props.purchase.payer_email){
            return <h3>An error occured while retrieving purchase data. Please try again.</h3> 
        } else if(this.state.firstConfirm){
            if(this.state.category === 'transfer'){
                const payingTribute = this.getTributeName(this.state.payer_email);
                const receivingTribute = this.getTributeName(this.state.receiver_email);
                return(
                    <h5>
                        ${this.state.cost} will be transferred from {payingTribute}
                        &nbsp;to {receivingTribute} if the request is approved. {payingTribute}
                        &nbsp;will be charged ${this.state.cost} to hold the request. This
                        &nbsp;will be refunded if the request is denied
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
                        <Form.Label>Purchasing Tribute*</Form.Label>
                        <Form.Control
                            value={this.state.payer_email}
                            onChange={this.handlePayer}
                            as="select"
                        >
                            {this.renderTributeChoices()}
                        </Form.Control>
                        {this.renderPayerValidation()}
                    </Form.Group></div>
                </Form.Row>
                <Form.Row>
                    <div className="col-12"><Form.Group controlId="receiver">
                        <Form.Label>Receiving Tribute*</Form.Label>
                        <Form.Control
                            value={this.state.receiver_email}
                            onChange={this.handleReceiver}
                            as="select"
                        >
                            {this.renderTributeChoices()}
                        </Form.Control>
                        {this.renderReceiverValidation()}
                    </Form.Group></div>
                </Form.Row>
                <Form.Row>
                    <div className="col-12"><Form.Group controlId="category">
                        <Form.Label>Select a Category...*</Form.Label>
                        <Form.Control
                            value={this.state.category}
                            onChange={this.handleCategoryItem}
                            as="select"
                        >
                            {this.renderCategoryChoices()}
                        </Form.Control>
                        {this.renderCategoryValidation()}
                    </Form.Group></div>
                </Form.Row>
                {this.renderItemMenu(this.state.category)}
                {this.renderQuantityChoices(this.state.category)}
            </Form>
        )
    }

    renderPayerValidation = () => {
        if(this.state.payerValid === 2){
            return(
                <p className="coolor-text-red" style={{ fontSize: "8pt" }}>
                    <span role="img" aria-label="check/x">&#10071;</span> Please select the tribute that will pay for the item
                </p>
            );
        } else if(this.state.payerValid === 3) {
            return(
                <p className="coolor-text-blue" style={{ fontSize: "8pt" }}>
                    <span role="img" aria-label="check/x">&#63;</span> The purchase amount will be deducted from this tribute's total funds
                </p>
            );
        } else if(this.state.payerValid === 0) {
            return(
                <p className="coolor-text-green" style={{ fontSize: "8pt" }}>
                    <span role="img" aria-label="check/x">&#10003;</span> Paying Tribute
                </p>
            );
        } else {
            return null;
        }
    }
    renderReceiverValidation = () => {
        if(this.state.receiverValid === 2){
            return(
                <p className="coolor-text-red" style={{ fontSize: "8pt" }}>
                    <span role="img" aria-label="check/x">&#10071;</span> Please select a tribute who will receive the item
                </p>
            );
        } else if(this.state.receiverValid === 3) {
            return(
                <p className="coolor-text-blue" style={{ fontSize: "8pt" }}>
                    <span role="img" aria-label="check/x">&#63;</span> This is the tribute who will receive the item
                </p>
            );
        } else if(this.state.receiverValid === 4) {
            return(
                <p className="coolor-text-red" style={{ fontSize: "8pt" }}>
                    <span role="img" aria-label="check/x">&#10071;</span> Payer and receiver must be different for transfers
                </p>
            );
        } else if(this.state.receiverValid === 0) {
            return(
                <p className="coolor-text-green" style={{ fontSize: "8pt" }}>
                    <span role="img" aria-label="check/x">&#10003;</span> Receiving Tribute
                </p>
            );
        } else {
            return null;
        }
    }
    renderCategoryValidation = () => {
        if(this.state.categoryValid === 2){
            return(
                <p className="coolor-text-red" style={{ fontSize: "8pt" }}>
                    <span role="img" aria-label="check/x">&#10071;</span> Please select a category
                </p>
            );
        } else if(this.state.categoryValid === 3) {
            return(
                <p className="coolor-text-blue" style={{ fontSize: "8pt" }}>
                    <span role="img" aria-label="check/x">&#63;</span> Select a category to show more options (if available)
                </p>
            );
        } else if(this.state.categoryValid === 0) {
            return(
                <p className="coolor-text-green" style={{ fontSize: "8pt" }}>
                    <span role="img" aria-label="check/x">&#10003;</span> Category
                </p>
            );
        } else {
            return null;
        }
    }
    renderItemValidation = () => {
        if(this.state.itemValid === 2){
            return(
                <p className="coolor-text-red" style={{ fontSize: "8pt" }}>
                    <span role="img" aria-label="check/x">&#10071;</span> Please select an item
                </p>
            );
        } else if(this.state.itemValid === 3) {
            return(
                <p className="coolor-text-blue" style={{ fontSize: "8pt" }}>
                    <span role="img" aria-label="check/x">&#63;</span> The item you wish to purchase for the selected tribute
                </p>
            );
        } else if(this.state.itemValid === 0) {
            return(
                <p className="coolor-text-green" style={{ fontSize: "8pt" }}>
                    <span role="img" aria-label="check/x">&#10003;</span> Item
                </p>
            );
        } else {
            return null;
        }
    }
    renderCostValidation = () =>{
        if(this.state.itemValid === 3) {
            return(
                <p className="coolor-text-blue" style={{ fontSize: "8pt" }}>
                    <span role="img" aria-label="check/x">&#63;</span> The amount that will be transferred from the paying tribute to the receiving tribute
                </p>
            );
        } else if(this.state.costValid === 4){
            return(
                <p className="coolor-text-red" style={{ fontSize: "8pt" }}>
                    <span role="img" aria-label="check/x">&#10071;</span> Transfer amount is required
                </p>
            );
        } else if (this.state.costValid === 5){
            return(
                <p className="coolor-text-red" style={{ fontSize: "8pt" }}>
                    <span role="img" aria-label="check/x">&#10071;</span> Transfer amount must be a number
                </p>
            );
        } else if(this.state.costValid === 6) {
            return(
                <p className="coolor-text-red" style={{ fontSize: "8pt" }}>
                    <span role="img" aria-label="check/x">&#10071;</span> Transfer amount must be at least $1
                </p>
            );
        } else if(this.state.costValid === 0) {
            return(
                <p className="coolor-text-green" style={{ fontSize: "8pt" }}>
                    <span role="img" aria-label="check/x">&#10003;</span> Transfer amount
                </p>
            );
        } else {
            return null;
        }
    }
    renderFormValidation = () => {
        if(this.state.firstConfirm || this.state.payerValid + this.state.receiverValid + 
            this.state.categoryValid + this.state.itemValid + this.state.costValid === 15){
                return null;
        }
        if(this.state.payerValid + this.state.receiverValid + this.state.categoryValid +
            this.state.itemValid === 0) {
            return(
                <p className="coolor-text-green" style={{ fontSize: "12pt" }}>
                    <span role="img" aria-label="check/x">&#10003;</span> Ready to submit?
                </p>
            );
        } else if(this.state.formValid === 2){
            return(
                <p className="coolor-text-red" style={{ fontSize: "12pt" }}>
                    <span role="img" aria-label="check/x">&#10071;</span> All fields are required
                </p>
            );
        } else {
            return null;
        }
    }

    renderCategoryChoices = () => {
        if(this.state.payer_email !== '' && this.state.receiver_email !== ''){
            return(
                <>
                <option value="">Please select a Category...</option>
                <option value="item">Item</option>
                <option value="resource">Resource</option>
                <option value="life">Life (currently ${this.fetchCurrentPrice(this.props.items[0])})</option>
                <option value="immunity">Immunity (currently ${this.fetchCurrentPrice(this.props.items[1])})</option>
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
            return(
                <Form.Row>
                    <div className="col-6"><Form.Group controlId="amount">
                        <Form.Label>{message}*</Form.Label>
                        <Form.Control value={this.state.cost}
                            onChange={this.handleCost}
                            onKeyPress={e => {if(e.key === 'Enter') e.preventDefault()}}
                        />
                        {this.renderCostValidation()}
                    </Form.Group></div>
                </Form.Row>
            );
        } else {
            return(
                <Form.Row>
                    <div className="col-12"><Form.Group controlId="item">
                        <Form.Label>{message}*</Form.Label>
                        <Form.Control
                            value={this.state.item}
                            onChange={this.handleCategoryItem}
                            as="select"
                        >
                            {this.renderItemChoices(category)}
                        </Form.Control>
                        {this.renderItemValidation()}
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
                    <option value="food">Food (currently ${this.fetchCurrentPrice(this.props.items[3])})</option>
                    <option value="water">Water (currently ${this.fetchCurrentPrice(this.props.items[4])})</option>
                    <option value="medicine">Medicine (currently ${this.fetchCurrentPrice(this.props.items[5])})</option>
                    <option value="golden">Golden (currently ${this.fetchCurrentPrice(this.props.items[2])})</option>
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
                    <Form.Label>How Many?*</Form.Label>
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
        } else if(this.props.mode === 'edit' && !this.props.purchase.payer_email){
            return <Button onClick={this.handleClose} variant="secondary">Cancel</Button>;
        } else if(this.state.firstConfirm){
            return(
                <>
                    {this.renderApiError()}
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
                    <Button onClick={() => this.setState({ payerValid: 3, receiverValid: 3, categoryValid: 3, itemValid: 3, costValid: 3 })}>
                        Show Help
                    </Button>
                    <Button onClick={this.handleClose} variant="danger">
                        Cancel
                    </Button>
                    <Button onClick={this.handleSubmit} variant="info">
                        Confirm
                    </Button>
                </>
            );
        }
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
                        {this.renderFormValidation()}
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
        purchaseUpdateFunds,
        purchaseUpdateItemQuantity,
        fetchAllItems,
        fetchItem
    })(PurchaseForm);