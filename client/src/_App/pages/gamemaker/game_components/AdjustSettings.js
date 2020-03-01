import React from 'react';
import { connect } from 'react-redux';
import { Modal, Button, Form } from 'react-bootstrap';

import {
    updateGameState
} from '../../../../actions';

class AdjustSettings extends React.Component {
    _isMounted = false;

    constructor(props){
        super(props);

        const gameState = this.props.gameState;
        this.state = { 
            max_districts: gameState.max_districts,
            areas: gameState.areas,
            max_lives: gameState.max_lives,
            life_base_price: gameState.life_base_price,
            life_increment_price: gameState.life_increment_price,
            food_required: gameState.food_required,
            water_required: gameState.water_required,
            medicine_required: gameState.medicine_required,
            current_price_tier: gameState.current_price_tier,
            game_active: gameState.game_active,
            // Form display handling
            showModal: false,
            firstSubmit: false,
            finalConfirm: false,
            districtsValid: 0,
            areasValid: 0,
            maxLivesValid: 0,
            lifeBasePriceValid: 0,
            lifeIncrementPriceValid: 0,
            foodValid: 0, 
            waterValid: 0,
            medicineValid: 0,
            formValid: 1,
            apiError: false
        }

        this.handleDistricts = this.handleDistricts.bind(this);
        this.handleAreas = this.handleAreas.bind(this);
        this.handleMaxLives = this.handleMaxLives.bind(this);
        this.handleLifeBasePrice = this.handleLifeBasePrice.bind(this);
        this.handleLifeIncrementPrice = this.handleLifeIncrementPrice.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleFood = this.handleFood.bind(this);
        this.handleWater = this.handleWater.bind(this);
        this.handleMedicine = this.handleMedicine.bind(this);
        this.handlePriceTier = this.handlePriceTier.bind(this);
        this.handleGameActive = this.handleGameActive.bind(this);
    }

    componentDidMount = async () => {
        this._isMounted = true;
    }

    handleDistricts(event) {
        const input = event.target.value;
        this.setState({ max_districts: input });

        this.handleNumericsValid(input, 'districtsValid', 20);
    }
    handleAreas(event){
        const input = event.target.value;
        this.setState({ areas: input });
        if(input === ''){
            this.setState({ areasValid: 2 });
        } else if(input.length > 100) {
            this.setState({ areasValid: 3 });
        } else {
            this.setState({ areasValid: 0 });
        }
    }
    handleMaxLives(event) {
        const input = event.target.value;
        this.setState({ max_lives: input });
        
        this.handleNumericsValid(input, 'maxLivesValid', 10);
    }
    handleLifeBasePrice(event) {
        const input = event.target.value;
        this.setState({ life_base_price: input });
        
        this.handleNumericsValid(input, 'lifeBasePriceValid', 100);
    }
    handleLifeIncrementPrice(event) {
        const input = event.target.value;
        this.setState({ life_increment_price: input });
        
        this.handleNumericsValid(input, 'lifeIncrementPriceValid', 50);
    }
    handleFood(event) {
        const input = event.target.value;
        this.setState({ food_required: input });
        
        this.handleNumericsValid(input, 'foodValid', 10);
    }
    handleWater(event) {
        const input = event.target.value;
        this.setState({ water_required: input });
        
        this.handleNumericsValid(input, 'waterValid', 10);
    }
    handleMedicine(event) {
        const input = event.target.value;
        this.setState({ medicine_required: input });
        
        this.handleNumericsValid(input, 'medicineValid', 10);
    }
    handlePriceTier(event){
        this.setState({ current_price_tier: event.target.value });
    }
    handleGameActive(event){
        this.setState({ game_active: event.target.value });
    }

    handleNumericsValid = (input, stateKey, upperLimit) => {
        const stateObject = {};
        if(input === ''){
            stateObject[stateKey] = 2;
        } else if(isNaN(input)){
            stateObject[stateKey] = 3;
        } else if(input <= 0){
            stateObject[stateKey] = 4;
        } else if(Math.floor(input) >= upperLimit){
            stateObject[stateKey] = 5;
        } else if(input % 1 !== 0){
            stateObject[stateKey] = 6;
        } else {
            stateObject[stateKey] = 0;
        }

        this.setState(stateObject);
    }

    handleSubmit = async () => {
        if(this.state.districtsValid + this.state.areasValid + this.state.foodValid +
            this.state.waterValid + this.state.medicineValid !== 0){
            this.setState({ formValid: 2 });
            return null;
        }

        if(this._isMounted && !this.state.firstSubmit){
            this.setState({ firstSubmit: true, formValid: 1 });
            return null;
        }

        var areas = this.state.areas;
        areas = areas.replace(/\s*,\s*/g, ',').replace(/,+/g, ',');

        const gameState = {
            max_districts: this.state.max_districts,
            areas: encodeURIComponent(areas),
            max_lives: this.state.max_lives,
            life_base_price: this.state.life_base_price,
            life_increment_price: this.state.life_increment_price,
            food_required: this.state.food_required,
            water_required: this.state.water_required,
            medicine_required: this.state.medicine_required,
            current_price_tier: this.state.current_price_tier,
            game_active: this.state.game_active
        }

        const response = await this.props.updateGameState(gameState);
        if(!response){
            this.setState({ apiError: true, formValid: 3 });
            return null;
        }

        if(this._isMounted){
            this.setState({ finalConfirm: true });
        }

        await setTimeout(() => this._isMounted ? this.setState({ firstSubmit: false, finalConfirm: false, showModal: false }) : null, 1000) ;
        this.props.onSubmitCallback();
    }

    renderContent = () => {
        if(!this.state.showModal){
            return(
                <Button variant="info" onClick={() => this.setState({ showModal: true })}>
                    Adjust Game Settings
                </Button>
            );
        } else if(this.state.finalConfirm){
            return(
                <Button variant="secondary">
                    Saving...
                </Button>
            );
        } else {
            return(
                <Button variant="secondary">
                    Updating...
                </Button>
            );
        }
    }

    renderModal = () => {
        if(!this.state.showModal){
            return null;
        }
        if(!this.state.firstSubmit){
            return(
                <Modal show={this.state.showModal} onHide={this.handleClose}>
                    <Modal.Header>
                        <Modal.Title>Update Settings</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {this.renderForm()}
                    </Modal.Body>
                    <Modal.Footer>
                        {this.renderFormValidation()}
                        <Button variant="secondary" onClick={this.handleClose}>Cancel</Button>
                        <Button variant="info" onClick={this.handleSubmit}>Submit Changes</Button>
                    </Modal.Footer>
                </Modal>
            )
        } else if(!this.state.finalConfirm){
            return(
                <Modal show={this.state.showModal} onHide={this.handleClose}>
                    <Modal.Header>
                        <Modal.Title>Confirm Update</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        Are you sure you would like to update the game settings?
                        {this.renderGameStateSummary()}
                    </Modal.Body>
                    <Modal.Footer>
                        {this.renderFormValidation()}
                        <Button variant="secondary" onClick={() => this.setState({ firstSubmit: false })}>Cancel</Button>
                        <Button variant="danger" onClick={this.handleSubmit}>Yes, I'm Sure</Button>
                    </Modal.Footer>
                </Modal>
            )
        } else {
            return(
                <Modal show={this.state.showModal} onHide={this.handleClose}>
                    <Modal.Header>
                        <Modal.Title>
                            Changes Saved.
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        Game settings saved successfully.
                    </Modal.Body>
                </Modal>
            )
        }
    }

    renderGameStateSummary = () => {
        return(
            <div style={{ marginLeft: "20px" }}>
                <div className="row"><span className="font-weight-bold">Max Districts:</span><span>&nbsp;{this.state.max_districts}</span></div>
                <div className="row"><span className="font-weight-bold">Areas:</span><span>&nbsp;{this.renderAreaList(this.state.areas)}</span></div>
                <div className="row"><span className="font-weight-bold">Maximum Lives:</span><span>&nbsp;{this.state.max_lives}</span></div>
                <div className="row"><span className="font-weight-bold">Life Base Price:</span><span>&nbsp;{this.state.life_base_price}</span></div>
                <div className="row"><span className="font-weight-bold">Life Increment Price:</span><span>&nbsp;{this.state.life_increment_price}</span></div>
                <div className="row"><span className="font-weight-bold">Food Required:</span><span>&nbsp;{this.state.food_required}</span></div>
                <div className="row"><span className="font-weight-bold">Water Required:</span><span>&nbsp;{this.state.water_required}</span></div>
                <div className="row"><span className="font-weight-bold">Medicine Required:</span><span>&nbsp;{this.state.medicine_required}</span></div>
                <div className="row"><span className="font-weight-bold">Current Price Tier:</span><span>&nbsp;{this.state.current_price_tier}</span></div>
                <div className="row"><span className="font-weight-bold">Game Active?</span><span>&nbsp;{this.state.game_active ? 'Yes' : 'No'}</span></div>
            </div>
        );
    }

    renderAreaList(areas){
        areas = areas.split(',');
        return(
            <>
                {areas.map(area => {
                    return <div key={area}>{area}</div>
                })}
            </>
        );
    }

    renderForm = () => {
        return(
            <Form>
                <Form.Label><span className="font-weight-bold">**GENERAL SETTINGS**</span></Form.Label>
                <Form.Row>
                    <div className="col-8"><Form.Group controlId="setDistricts">
                        <Form.Label>Maximum Districts</Form.Label>
                        <Form.Control
                            value={this.state.max_districts}
                            onChange={this.handleDistricts}
                            autoComplete="off"
                        />
                        {this.renderNumericsValidation('districtsValid', 'Maximum districts', 20)}
                    </Form.Group></div>
                </Form.Row>
                <Form.Row>
                    <div className="col-12"><Form.Group controlId="setAreas">
                        <Form.Label>Areas (separate by commas)</Form.Label>
                        <Form.Control
                            value={this.state.areas}
                            onChange={this.handleAreas}
                            autoComplete="off"
                        />
                        {this.renderAreasValidation()}
                    </Form.Group></div>
                </Form.Row>
                <Form.Label><span className="font-weight-bold">**LIVES**</span></Form.Label>
                <Form.Row>
                    <div className="col-4"><Form.Group controlId="setMaxLives">
                        <Form.Label>Max Lives</Form.Label>
                        <Form.Control
                            value={this.state.max_lives}
                            onChange={this.handleMaxLives}
                            autoComplete="off"
                        />
                        {this.renderNumericsValidation('maxLivesValid', 'Max lives', 10)}
                    </Form.Group></div>
                    <div className="col-4"><Form.Group controlId="setLifeBasePrice">
                        <Form.Label>Life Base Price</Form.Label>
                        <Form.Control
                            value={this.state.life_base_price}
                            onChange={this.handleLifeBasePrice}
                            autoComplete="off"
                        />
                        {this.renderNumericsValidation('lifeBasePriceValid', 'Life base price', 100)}
                    </Form.Group></div>
                    <div className="col-4"><Form.Group controlId="setLifeIncrementPrice">
                        <Form.Label>Life Increment Price</Form.Label>
                        <Form.Control
                            value={this.state.life_increment_price}
                            onChange={this.handleLifeIncrementPrice}
                            autoComplete="off"
                        />
                        {this.renderNumericsValidation('lifeIncrementPriceValid', 'Life increment price', 50)}
                    </Form.Group></div>
                </Form.Row>
                <Form.Label><span className="font-weight-bold">**RESOURCES**</span></Form.Label>
                <Form.Row>
                    <div className="col-4"><Form.Group controlId="setFood">
                        <Form.Label>Food Required</Form.Label>
                        <Form.Control
                            value={this.state.food_required}
                            onChange={this.handleFood}
                            autoComplete="off"
                        />
                        {this.renderNumericsValidation('foodValid', 'Food required', 10)}
                    </Form.Group></div>
                    <div className="col-4"><Form.Group controlId="setWater">
                        <Form.Label>Water Required</Form.Label>
                        <Form.Control
                            value={this.state.water_required}
                            onChange={this.handleWater}
                            autoComplete="off"
                        />
                        {this.renderNumericsValidation('waterValid', 'Water required', 10)}
                    </Form.Group></div>
                    <div className="col-4"><Form.Group controlId="setMedicine">
                        <Form.Label>Medicine Required</Form.Label>
                        <Form.Control
                            value={this.state.medicine_required}
                            onChange={this.handleMedicine}
                            autoComplete="off"
                        />
                        {this.renderNumericsValidation('medicineValid', 'Medicine required', 10)}
                    </Form.Group></div>
                </Form.Row>
                <Form.Label><span className="font-weight-bold">**PRICING**</span></Form.Label>
                <Form.Row>
                    <div className="col-4"><Form.Group controlId="setFood">
                        <Form.Label>Current Price Tier</Form.Label>
                        <Form.Control
                            value={this.state.current_price_tier}
                            onChange={this.handlePriceTier}
                            autoComplete="off"
                            as="select"
                        >
                            <option value={1}>1</option>
                            <option value={2}>2</option>
                            <option value={3}>3</option>
                            <option value={4}>4</option>
                        </Form.Control>
                    </Form.Group></div>
                </Form.Row>
                <Form.Label><span className="font-weight-bold">**GAME ACTIVE**</span></Form.Label>
                <Form.Row>
                    <div className="col-4"><Form.Group controlId="setWater">
                        <Form.Label>Game Active?</Form.Label>
                        <Form.Control
                            value={this.state.game_active}
                            onChange={this.handleGameActive}
                            autoComplete="off"
                            as="select"
                        >
                            <option value={0}>No</option>
                            <option value={1}>Yes</option>
                        </Form.Control>
                    </Form.Group></div>
                </Form.Row>
            </Form>
        );
    }

    renderAreasValidation = () => {
        if(this.state.areasValid === 2){
            return(
                <p className="coolor-text-red" style={{ fontSize: "8pt" }}>
                    <span role="img" aria-label="check/x">&#10071;</span> Areas is required
                </p>
            );
        } else if(this.state.areasValid === 3) {
            return(
                <p className="coolor-text-red" style={{ fontSize: "8pt" }}>
                    <span role="img" aria-label="check/x">&#10071;</span> Length cannot exceed 100 characters
                </p>
            );
        } else if(this.state.areasValid === 0) {
            return(
                <p className="coolor-text-green" style={{ fontSize: "8pt" }}>
                    <span role="img" aria-label="check/x">&#10003;</span> Areas
                </p>
            );
        } else {
            return null;
        }
    }
    renderNumericsValidation = (stateKey, textName, upperLimit) => {
        if(this.state[stateKey] === 2){
            return(
                <p className="coolor-text-red" style={{ fontSize: "8pt" }}>
                    <span role="img" aria-label="check/x">&#10071;</span> {textName} is required
                </p>
            );
        } else if (this.state[stateKey] === 3){
            return(
                <p className="coolor-text-red" style={{ fontSize: "8pt" }}>
                    <span role="img" aria-label="check/x">&#10071;</span> {textName} must be a number
                </p>
            );
        } else if(this.state[stateKey] === 4) {
            return(
                <p className="coolor-text-red" style={{ fontSize: "8pt" }}>
                    <span role="img" aria-label="check/x">&#10071;</span> {textName} must be positive
                </p>
            );
        } else if(this.state[stateKey] === 5) {
            return(
                <p className="coolor-text-red" style={{ fontSize: "8pt" }}>
                    <span role="img" aria-label="check/x">&#10071;</span> Please choose a value less than {upperLimit}
                </p>
            );
        } else if(this.state[stateKey] === 6) {
            return(
                <p className="coolor-text-red" style={{ fontSize: "8pt" }}>
                    <span role="img" aria-label="check/x">&#10071;</span> Please enter a whole number
                </p>
            );
        } else if(this.state[stateKey] === 0) {
            return(
                <p className="coolor-text-green" style={{ fontSize: "8pt" }}>
                    <span role="img" aria-label="check/x">&#10003;</span> {textName}
                </p>
            );
        } else {
            return null;
        }
    }
    renderFormValidation = () =>{
        if(this.state.finalConfirm){
            return null;
        } else if(this.props.mode === 'edit' && !this.props.donation.tribute_email){
            return null;
        } else if(this.state.firstSubmit){
            if(this.state.formValid === 3){
                return(
                    <p className="coolor-text-red" style={{ fontSize: "12pt" }}>
                        <span role="img" aria-label="check/x">&#10071;</span> A server error occurred
                    </p>
                );
            } else {
                return null;
            }
        }

        if(this.state.districtsValid + this.state.areasValid + this.state.foodValid +
            this.state.waterValid + this.state.medicineValid === 0) {
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

    handleClose = () => {
        this.setState({ firstSubmit: false, finalConfirm: false, showModal: false });
    }
    
    render(){
        return(
            <>
                {this.renderModal()}
                {this.renderContent()}           
            </>
        );
    }
}

export default connect(null, {
    updateGameState 
})(AdjustSettings);