import React from 'react';
import { connect } from 'react-redux';
import { Form, Button, Modal } from 'react-bootstrap';

import {
    fetchPurchaseRequest,
    purchaseUpdateStatus,
    purchaseUpdateFunds,
    fetchAllItems,
    fetchItem
} from '../../../../actions';

class PurchaseForm extends React.Component{
    _isMounted = false;
    constructor(props){
        super(props);

        this.state = {
            showModal: true,
            submitted: false,
            payer_email: '',
            receiver_email: '',
            category: 'item',
            item: '',
            originalCost: null,
            cost: 100,
            quantity: 1,
            maxQuantity: 1,
        }

        this.handlePayer = this.handlePayer.bind(this);
        this.handleReceiver = this.handleReceiver.bind(this);
        this.handleCategory = this.handleCategory.bind(this);
        this.handleItem = this.handleItem.bind(this);
        this.handleCost = this.handleCost.bind(this);
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
                    item: purchase.item,
                    originalCost: purchase.cost,
                    cost: purchase.cost,
                    quantity: purchase.quantity
                })
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
    async handleCategory(event){
        await this.props.fetchItem(event.target.value);
        this.setState({ category: event.target.value });
    }
    handleItem(event){
        this.setState({ item: event.target.value });
    }
    handleCost(event){
        this.setState({ cost: event.target.value });
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

    handleSubmit = () => {
        const purchase = this.props.purchase;
        if(purchase.category === 'item'){
            // update item
            return 1;
        } else if(purchase.category === 'life'){
            // update life
            return 2;
        } else if(purchase.category === 'resource'){
            // format item
            // update resources
            return 3;
        } else if(purchase.category === 'immunity'){
            // update immunity
            return 4;
        } else if(purchase.category === 'transfer'){
            // add funds
            // remove funds
            return 5;
        }
    }

    renderModalHeader = () => {
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
            return <h3>The request was sent!</h3>;
        }
        return(
            <>
                {this.renderForm()}
            </>
        );
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
                            {this.renderPayerChoices()}
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
                            {this.renderReceiverChoices()}
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
                            <option value="item">Item</option>
                            <option value="resource">Resource</option>
                            <option value="life">Life</option>
                            <option value="immunity">Immunity</option>
                            <option value="transfer">Transfer Funds</option>
                        </Form.Control>
                    </Form.Group></div>
                </Form.Row>
                {this.renderItemMenu(this.state.category)}
                {/* {this.renderQuantityChoices(this.state.category)} */}
                
            </Form>
        )
    }

    renderPayerChoices = () => {
        return(
            <>
                <option value="">Please select a Tribute...</option>
                {this.props.tributes.map(tribute => {
                    return(
                        <option key={tribute.id} value={tribute.email}>
                            {tribute.first_name} {tribute.last_name} || {tribute.email}
                        </option>
                    );
                })}
            </>
        );
    }

    renderReceiverChoices = () => {
        return(
            <>
                <option value="">Please select a Tribute...</option>
                {this.props.tributes.map(tribute => {
                    if(tribute.email === this.state.payer_email){
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
            return (
                <>
                    <option value="">Please choose an item...</option>
                    {this.props.items.map(item => {
                    return(
                        <option key={item.id} value={item.id}>{item.item_name}: "{item.description}" (${item.cost} each) </option>
                    );
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
                    <option value="roulette">Roulette</option>
                    <option value="life">Life</option>
                    <option value="golden">Golden</option>
                </>
            );
        }
    }

    // renderQuantityChoices(category){
    //     if(category === 'item' && this.state.item !== ''){
    //         const choices = [];
    //         for(let i = 1; i <= this.props.selectedItem.quantity; i++){
    //             choices.push(i);
    //         }
    //         return (
    //             <Form.Row>
    //                 <div className="col-4"><Form.Group controlId="quantity">
    //                     <Form.Label>How Many?</Form.Label>
    //                     <Form.Control
    //                         value={this.state.quantity}
    //                         onChange={this.handleQuantity}
    //                         as="select"
    //                     >
    //                        {choices.map(choice => {
    //                           return <option key={choice} value={choice}>{choice}</option>;
    //                         })} 
    //                     </Form.Control>
    //                 </Form.Group></div>
    //             </Form.Row>
    //         );
    //     }
    // }

    renderModalFooter = () => {
        if(this.state.submitted){
            return null;
        }
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
        item: state.selectedItem
    };
}

export default connect(mapStateToProps, 
    { 
        fetchPurchaseRequest,
        purchaseUpdateStatus,
        purchaseUpdateFunds,
        fetchAllItems,
        fetchItem
    })(PurchaseForm);