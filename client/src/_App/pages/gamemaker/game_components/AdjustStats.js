import React from 'react';
import { connect } from 'react-redux';
import { Modal, Button, Form } from 'react-bootstrap';

import {
    fetchTributeStat,
    updateTributeStats
} from '../../../../actions';

class AdjustStats extends React.Component {
    _isMounted = false;

    constructor(props){
        super(props);

        this.state = { 
            name: '',
            funds_remaining: 0,
            total_donations: 0,
            total_purchases: 0,
            food_used: 0,
            food_missed: 0,
            water_used: 0,
            water_missed: 0,
            medicine_used: 0,
            medicine_missed: 0,
            roulette_used: 0,
            golden_used: 0,
            lives_remaining: 0,
            life_resources: 0,
            lives_exempt: 0,
            lives_purchased: 0,
            lives_lost: 0,
            kill_count: 0,
            has_immunity: 0,
            // Form display handling
            showModal: true,
            firstSubmit: false,
            finalConfirm: false,
            // Validation
            fundsRemainingValid: 1,
            totalDonationsValid: 1,
            totalPurchasesValid: 1,
            foodUsedValid: 1,
            foodMissedValid: 1,
            waterUsedValid: 1,
            waterMissedValid: 1,
            medicineUsedValid: 1,
            medicineMissedValid: 1,
            rouletteUsedValid: 1,
            goldenUsedValid: 1,
            livesRemainingValid: 1,
            lifeResourcesValid: 1,
            livesExemptValid: 1,
            livesPurchasedValid: 1,
            livesLostValid: 1,
            killCountValid: 1,
            formValid: 1,
            apiError: false
        };

        this.handleFundsRemaining = this.handleFundsRemaining.bind(this);
        this.handleTotalDonations = this.handleTotalDonations.bind(this);
        this.handleTotalPurchases = this.handleTotalPurchases.bind(this);
        this.handleFoodUsed = this.handleFoodUsed.bind(this);
        this.handleFoodMissed = this.handleFoodMissed.bind(this);
        this.handleWaterUsed = this.handleWaterUsed.bind(this);
        this.handleWaterMissed = this.handleWaterMissed.bind(this);
        this.handleMedicineUsed = this.handleMedicineUsed.bind(this);
        this.handleMedicineMissed = this.handleMedicineMissed.bind(this);
        this.handleRouletteUsed = this.handleRouletteUsed.bind(this);
        this.handleGoldenUsed = this.handleGoldenUsed.bind(this);
        this.handleLivesRemaining = this.handleLivesRemaining.bind(this);
        this.handleLifeResources = this.handleLifeResources.bind(this);
        this.handleLivesExempt = this.handleLivesExempt.bind(this);
        this.handleLivesPurchased = this.handleLivesPurchased.bind(this);
        this.handleLivesLost = this.handleLivesLost.bind(this);
        this.handleKillCount = this.handleKillCount.bind(this);
        this.handleImmunity = this.handleImmunity.bind(this);
    }

    componentDidMount = async () => {
        this._isMounted = true;
        const response = await this.props.fetchTributeStat(this.props.id);
        if(!response){
            this.setState({ apiError: true });
            return null;
        }

        const tributeStats = this.props.tributeStats;
        this.setState({
            name: `${tributeStats.first_name} ${tributeStats.last_name}`,
            funds_remaining: tributeStats.funds_remaining,
            total_donations: tributeStats.total_donations,
            total_purchases: tributeStats.total_purchases,
            food_used: tributeStats.food_used,
            food_missed: tributeStats.food_missed,
            water_used: tributeStats.water_used,
            water_missed: tributeStats.water_missed,
            medicine_used: tributeStats.medicine_used,
            medicine_missed: tributeStats.medicine_missed,
            roulette_used: tributeStats.roulette_used,
            golden_used: tributeStats.golden_used,
            lives_remaining: tributeStats.lives_remaining,
            life_resources: tributeStats.life_resources,
            lives_exempt: tributeStats.lives_exempt,
            lives_purchased: tributeStats.lives_purchased,
            lives_lost: tributeStats.lives_lost,
            kill_count: tributeStats.kill_count,
            has_immunity: tributeStats.has_immunity,

            fundsRemainingValid: 0,
            totalDonationsValid: 0,
            totalPurchasesValid: 0,
            foodUsedValid: 0,
            foodMissedValid: 0,
            waterUsedValid: 0,
            waterMissedValid: 0,
            medicineUsedValid: 0,
            medicineMissedValid: 0,
            rouletteUsedValid: 0,
            goldenUsedValid: 0,
            livesRemainingValid: 0,
            lifeResourcesValid: 0,
            livesExemptValid: 0,
            livesPurchasedValid: 0,
            livesLostValid: 0,
            killCountValid: 0,
        });
    }

    handleFundsRemaining(event) {
        const input = event.target.value;
        this.setState({ funds_remaining: input });
        this.handleValidationState(input, 'fundsRemainingValid', 500, 3000);
    }
    handleTotalDonations(event) {
        const input = event.target.value;
        this.setState({ total_donations: input });
        this.handleValidationState(input, 'totalDonationsValid', 500, 3000);
    }
    handleTotalPurchases(event) {
        const input = event.target.value;
        this.setState({ total_purchases: input });
        this.handleValidationState(input, 'totalPurchasesValid', 500, 3000);
    }
    handleFoodUsed(event) {
        const input = event.target.value;
        this.setState({ food_used: input });
        this.handleValidationState(input, 'foodUsedValid', 5, 10);
    }
    handleFoodMissed(event) {
        const input = event.target.value;
        this.setState({ food_missed: input });
        this.handleValidationState(input, 'foodMissedValid', 5, 10);
    }
    handleWaterUsed(event) {
        const input = event.target.value;
        this.setState({ water_used: input });
        this.handleValidationState(input, 'waterUsedValid', 5, 10);
    }
    handleWaterMissed(event) {
        const input = event.target.value;
        this.setState({ water_missed: input });
        this.handleValidationState(input, 'waterMissedValid', 5, 10);
    }
    handleMedicineUsed(event) {
        const input = event.target.value;
        this.setState({ medicine_used: input });
        this.handleValidationState(input, 'medicineUsedValid', 5, 10);
    }
    handleMedicineMissed(event) {
        const input = event.target.value;
        this.setState({ medicine_missed: input });
        this.handleValidationState(input, 'medicineMissedValid', 5, 10);
    }
    handleRouletteUsed(event) {
        const input = event.target.value;
        this.setState({ roulette_used: input });
        this.handleValidationState(input, 'rouletteUsedValid', 5, 10);
    }
    handleGoldenUsed(event) {
        const input = event.target.value;
        this.setState({ golden_used: input });
        this.handleValidationState(input, 'goldenUsedValid', 5, 10);
    }
    handleLivesRemaining(event) {
        const input = event.target.value;
        this.setState({ lives_remaining: input });
        this.handleValidationState(input, 'livesRemainingValid', 5, 10);
    }
    handleLifeResources(event) {
        const input = event.target.value;
        this.setState({ life_resources: input });
        this.handleValidationState(input, 'lifeResourcesValid', 5, 10);
    }
    handleLivesExempt(event) {
        const input = event.target.value;
        this.setState({ lives_exempt: input });
        this.handleValidationState(input, 'livesExemptValid', 5, 10);
    }
    handleLivesPurchased(event) {
        const input = event.target.value;
        this.setState({ lives_purchased: input });
        this.handleValidationState(input, 'livesPurchasedValid', 5, 10);
    }
    handleLivesLost(event) {
        const input = event.target.value;
        this.setState({ lives_lost: input });
        this.handleValidationState(input, 'livesLostValid', 5, 10);
    }
    handleKillCount(event) {
        const input = event.target.value;
        this.setState({ kill_count: input });
        this.handleValidationState(input, 'killCountValid', 10, 20);
    }
    handleImmunity(event){
        this.setState({ has_immunity: event.target.value });
    }
    handleValidationState(input, key, warnThreshold, absThreshold){
        var stateObject = {};
        if(input === ''){
            stateObject[key] = 2;
        } else if(isNaN(input)){
            stateObject[key] = 3;
        } else if(input < 0){
            stateObject[key] = 4;
        } else if(Math.floor(input) >= warnThreshold && Math.floor(input) <= absThreshold){
            stateObject[key] = 5;
        } else if(Math.floor(input) > absThreshold){
            stateObject[key] = 6;
        } else if(input % 1 !== 0){
            stateObject[key] = 7;
        } else {
            stateObject[key] = 0;
        }
        this.setState(stateObject);
    }

    handleSubmit = async () => {
        const indicators = ['fundsRemainingValid', 'totalDonationsValid', 'totalPurchasesValid',
        'foodUsedValid', 'foodMissedValid', 'waterUsedValid', 'waterMissedValid', 
        'medicineUsedValid', 'medicineMissedValid', 'rouletteUsedValid', 'goldenUsedValid', 
        'livesRemainingValid', 'lifeResourcesValid', 'livesExemptValid', 'livesPurchasedValid', 
        'livesLostValid', 'killCountValid'];

        var validationCounter = 0;

        for(let indicator of indicators){
            if(this.state[indicator] !== 5){
                validationCounter += this.state[indicator];
            }
        }

        if(validationCounter !== 0){
            this.setState({ formValid: 2 });
            return null;
        }

        if(this._isMounted && !this.state.firstSubmit){
            this.setState({ firstSubmit: true, formValid: 1 });
            return null;
        }

        const tributeStats = {
            id: this.props.id,
            funds_remaining: this.state.funds_remaining,
            total_donations: this.state.total_donations,
            total_purchases: this.state.total_purchases,
            food_used: this.state.food_used,
            food_missed: this.state.food_missed,
            water_used: this.state.water_used,
            water_missed: this.state.water_missed,
            medicine_used: this.state.medicine_used,
            medicine_missed: this.state.medicine_missed,
            roulette_used: this.state.roulette_used,
            golden_used: this.state.golden_used,
            lives_remaining: this.state.lives_remaining,
            life_resources: this.state.life_resources,
            lives_exempt: this.state.lives_exempt,
            lives_purchased: this.state.lives_purchased,
            lives_lost: this.state.lives_lost,
            kill_count: this.state.kill_count,
            has_immunity: this.state.has_immunity,
        }

        const response = await this.props.updateTributeStats(tributeStats);
        if(!response){
            this.setState({ apiError: true, formValid: 3 });
            return null;
        }

        if(this._isMounted){
            this.setState({ finalConfirm: true });
        }

        await setTimeout(() => {
            if(this._isMounted){
                this.handleClose();
            }
        }, 1000) ;
        this.props.onSubmitCallback();
    }

    renderModal = () => {
        if(!this.state.showModal){
            return null;
        }
        if(!this.state.firstSubmit){
            return(
                <Modal show={this.state.showModal} onHide={this.handleClose}>
                    <Modal.Header>
                        <Modal.Title>Modify Tribute Stats ({this.state.name})</Modal.Title>
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
                        Are you sure you would like to update this tribute's stats?
                        {this.renderTributeStatsSummary()}
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
                        Tribute stats saved successfully.
                    </Modal.Body>
                </Modal>
            )
        }
    }

    renderTributeStatsSummary = () => {
        return(
            <div style={{ marginLeft: "20px" }}>
                <div className="row"><span className="font-weight-bold">Tribute Name:</span><span>&nbsp;{this.props.tributeStats.first_name} {this.props.tributeStats.last_name}</span></div>
                <div className="row"><span className="font-weight-bold">Funds Remaining:</span><span>&nbsp;{this.state.funds_remaining}</span></div>
                <div className="row"><span className="font-weight-bold">Total Donations:</span><span>&nbsp;{this.state.total_donations}</span></div>
                <div className="row"><span className="font-weight-bold">Total Purchases:</span><span>&nbsp;{this.state.total_purchases}</span></div>
                <div className="row"><span className="font-weight-bold">Food Used:</span><span>&nbsp;{this.state.food_used}</span></div>
                <div className="row"><span className="font-weight-bold">Food Missed:</span><span>&nbsp;{this.state.food_missed}</span></div>
                <div className="row"><span className="font-weight-bold">Water Used:</span><span>&nbsp;{this.state.water_used}</span></div>
                <div className="row"><span className="font-weight-bold">Water Missed:</span><span>&nbsp;{this.state.water_missed}</span></div>
                <div className="row"><span className="font-weight-bold">Medicine Used:</span><span>&nbsp;{this.state.medicine_used}</span></div>
                <div className="row"><span className="font-weight-bold">Medicine Missed:</span><span>&nbsp;{this.state.medicine_missed}</span></div>
                <div className="row"><span className="font-weight-bold">Roulette Used:</span><span>&nbsp;{this.state.roulette_used}</span></div>
                <div className="row"><span className="font-weight-bold">Golden Used:</span><span>&nbsp;{this.state.golden_used}</span></div>
                <div className="row"><span className="font-weight-bold">Lives Remaining:</span><span>&nbsp;{this.state.lives_remaining}</span></div>
                <div className="row"><span className="font-weight-bold">Life Resources:</span><span>&nbsp;{this.state.life_resources}</span></div>
                <div className="row"><span className="font-weight-bold">Lives Exempt:</span><span>&nbsp;{this.state.lives_exempt}</span></div>
                <div className="row"><span className="font-weight-bold">Lives Purchased:</span><span>&nbsp;{this.state.lives_purchased}</span></div>
                <div className="row"><span className="font-weight-bold">Lives Lost:</span><span>&nbsp;{this.state.lives_lost}</span></div>
                <div className="row"><span className="font-weight-bold">Kill Count:</span><span>&nbsp;{this.state.kill_count}</span></div>
                <div className="row"><span className="font-weight-bold">Has Immunity:</span><span>&nbsp;{this.state.has_immunity ? 'Yes' : 'No'}</span></div>
            </div>
        );
    }

    renderForm = () => {
        return(
            <Form>
                <Form.Row>
                    <div className="col-4"><Form.Group controlId="setFundsRemaining">
                        <Form.Label>Funds Remaining</Form.Label>
                        <Form.Control
                            value={this.state.funds_remaining}
                            onChange={this.handleFundsRemaining}
                            autoComplete="off"
                        />
                        {this.renderFieldValidation('fundsRemainingValid', 'Funds remaining', '$500', '$3000')}
                    </Form.Group></div>
                    <div className="col-4"><Form.Group controlId="setTotalDonations">
                        <Form.Label>Total Donations</Form.Label>
                        <Form.Control
                            value={this.state.total_donations}
                            onChange={this.handleTotalDonations}
                            autoComplete="off"
                        />
                        {this.renderFieldValidation('totalDonationsValid', 'Total donations', '$500', '$3000')}
                    </Form.Group></div>
                    <div className="col-4"><Form.Group controlId="setTotalPurchases">
                        <Form.Label>Total Purchases</Form.Label>
                        <Form.Control
                            value={this.state.total_purchases}
                            onChange={this.handleTotalPurchases}
                            autoComplete="off"
                        />
                        {this.renderFieldValidation('totalPurchasesValid', 'Total purchases', '$500', '$3000')}
                    </Form.Group></div>
                </Form.Row>
                <Form.Row>
                    <div className="col-4"><Form.Group controlId="setFoodUsed">
                        <Form.Label>Food Used</Form.Label>
                        <Form.Control
                            value={this.state.food_used}
                            onChange={this.handleFoodUsed}
                            autoComplete="off"
                        />
                        {this.renderFieldValidation('foodUsedValid', 'Food used', 5, 10)}
                    </Form.Group></div>
                    <div className="col-4"><Form.Group controlId="setFoodMissed">
                        <Form.Label>Food Missed</Form.Label>
                        <Form.Control
                            value={this.state.food_missed}
                            onChange={this.handleFoodMissed}
                            autoComplete="off"
                        />
                        {this.renderFieldValidation('foodMissedValid', 'Food missed', 5, 10)}
                    </Form.Group></div>
                    <div className="col-4"><Form.Group controlId="setWaterUsed">
                        <Form.Label>Water Used</Form.Label>
                        <Form.Control
                            value={this.state.water_used}
                            onChange={this.handleWaterUsed}
                            autoComplete="off"
                        />
                        {this.renderFieldValidation('waterUsedValid', 'Water used', 5, 10)}
                    </Form.Group></div>
                </Form.Row>
                <Form.Row>
                    <div className="col-4"><Form.Group controlId="setWaterMissed">
                        <Form.Label>Water Missed</Form.Label>
                        <Form.Control
                            value={this.state.water_missed}
                            onChange={this.handleWaterMissed}
                            autoComplete="off"
                        />
                        {this.renderFieldValidation('waterMissedValid', 'Water missed', 5, 10)}
                    </Form.Group></div>
                    <div className="col-4"><Form.Group controlId="setMedicineUsed">
                        <Form.Label>Medicine Used</Form.Label>
                        <Form.Control
                            value={this.state.medicine_used}
                            onChange={this.handleMedicineUsed}
                            autoComplete="off"
                        />
                        {this.renderFieldValidation('medicineUsedValid', 'Medicine used', 5, 10)}
                    </Form.Group></div>
                    <div className="col-4"><Form.Group controlId="setMedicineMissed">
                        <Form.Label>Medicine Missed</Form.Label>
                        <Form.Control
                            value={this.state.medicine_missed}
                            onChange={this.handleMedicineMissed}
                            autoComplete="off"
                        />
                        {this.renderFieldValidation('medicineMissedValid', 'Medicine missed', 5, 10)}
                    </Form.Group></div>
                </Form.Row>
                <Form.Row>
                    <div className="col-4"><Form.Group controlId="setRouletteUsed">
                        <Form.Label>Roulette Used</Form.Label>
                        <Form.Control
                            value={this.state.roulette_used}
                            onChange={this.handleRouletteUsed}
                            autoComplete="off"
                        />
                        {this.renderFieldValidation('rouletteUsedValid', 'Roulette used', 5, 10)}
                    </Form.Group></div>
                    <div className="col-4"><Form.Group controlId="setGoldenUsed">
                        <Form.Label>Golden Used</Form.Label>
                        <Form.Control
                            value={this.state.golden_used}
                            onChange={this.handleGoldenUsed}
                            autoComplete="off"
                        />
                        {this.renderFieldValidation('goldenUsedValid', 'Golden used', 5, 10)}
                    </Form.Group></div>
                    <div className="col-4"><Form.Group controlId="setLivesRemaining">
                        <Form.Label>Lives Remaining</Form.Label>
                        <Form.Control
                            value={this.state.lives_remaining}
                            onChange={this.handleLivesRemaining}
                            autoComplete="off"
                        />
                        {this.renderFieldValidation('livesRemainingValid', 'Lives remaining', 5, 10)}
                    </Form.Group></div>
                </Form.Row>
                <Form.Row>
                    <div className="col-4"><Form.Group controlId="setLifeResources">
                        <Form.Label>Life Resources</Form.Label>
                        <Form.Control
                            value={this.state.life_resources}
                            onChange={this.handleLifeResources}
                            autoComplete="off"
                        />
                        {this.renderFieldValidation('lifeResourcesValid', 'Life resources', 5, 10)}
                    </Form.Group></div>
                    <div className="col-4"><Form.Group controlId="setLivesExempt">
                        <Form.Label>Lives Exempt</Form.Label>
                        <Form.Control
                            value={this.state.lives_exempt}
                            onChange={this.handleLivesExempt}
                            autoComplete="off"
                        />
                        {this.renderFieldValidation('livesExemptValid', 'Lives exempt', 5, 10)}
                    </Form.Group></div>
                    <div className="col-4"><Form.Group controlId="setLivesPurchased">
                        <Form.Label>Lives Purchased</Form.Label>
                        <Form.Control
                            value={this.state.lives_purchased}
                            onChange={this.handleLivesPurchased}
                            autoComplete="off"
                        />
                        {this.renderFieldValidation('livesPurchasedValid', 'Lives purchased', 5, 10)}
                    </Form.Group></div>
                </Form.Row>
                <Form.Row>
                    <div className="col-4"><Form.Group controlId="setLivesLost">
                        <Form.Label>Lives Lost</Form.Label>
                        <Form.Control
                            value={this.state.lives_lost}
                            onChange={this.handleLivesLost}
                            autoComplete="off"
                        />
                        {this.renderFieldValidation('livesLostValid', 'Lives lost', 5, 10)}
                    </Form.Group></div>
                    <div className="col-4"><Form.Group controlId="setKillCount">
                        <Form.Label>Kill Count</Form.Label>
                        <Form.Control
                            value={this.state.kill_count}
                            onChange={this.handleKillCount}
                            autoComplete="off"
                        />
                        {this.renderFieldValidation('killCountValid', 'Kill count', 10, 20)}
                    </Form.Group></div>
                    <div className="col-4"><Form.Group controlId="setImmunity">
                        <Form.Label>Has Immunity?</Form.Label>
                        <Form.Control
                            value={this.state.has_immunity}
                            onChange={this.handleImmunity}
                            autoComplete="off"
                            as="select"
                        >
                            <option value="1">Yes</option>
                            <option value="0">No</option>
                        </Form.Control>
                    </Form.Group></div>
                </Form.Row>
            </Form>
        );
    }

    renderFieldValidation = (stateName, fieldName, warnThreshold, absThreshold) => {
        if(this.state[stateName] === 2){
            return(
                <p className="coolor-text-red" style={{ fontSize: "8pt" }}>
                    <span role="img" aria-label="check/x">&#10071;</span> {fieldName} is required
                </p>
            );
        } else if (this.state[stateName] === 3){
            return(
                <p className="coolor-text-red" style={{ fontSize: "8pt" }}>
                    <span role="img" aria-label="check/x">&#10071;</span> {fieldName} must be a number
                </p>
            );
        } else if(this.state[stateName] === 4) {
            return(
                <p className="coolor-text-red" style={{ fontSize: "8pt" }}>
                    <span role="img" aria-label="check/x">&#10071;</span> {fieldName} must be positive
                </p>
            );
        } else if(this.state[stateName] === 5) {
            return(
                <p className="coolor-text-yellow-darken-3" style={{ fontSize: "8pt" }}>
                    <span role="img" aria-label="check/x">&#9888;</span> Warning threshold for this value is set to {warnThreshold}. Please proceed with caution.
                </p>
            );
        } else if(this.state[stateName] === 6) {
            return(
                <p className="coolor-text-red" style={{ fontSize: "8pt" }}>
                    <span role="img" aria-label="check/x">&#10071;</span> Value must be less than {absThreshold}
                </p>
            );
        } else if(this.state[stateName] === 7) {
            return(
                <p className="coolor-text-red" style={{ fontSize: "8pt" }}>
                    <span role="img" aria-label="check/x">&#10071;</span> Please enter a whole number
                </p>
            );
        } else if(this.state[stateName] === 0) {
            return(
                <p className="coolor-text-green" style={{ fontSize: "8pt" }}>
                    <span role="img" aria-label="check/x">&#10003;</span> {fieldName}
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
        if(this._isMounted){
            this.setState({ showModal: false });
        }
        this.props.onSubmitCallback();
    }
    
    render(){
        return(
            <>
                {this.renderModal()}        
            </>
        );
    }
}

const mapStateToProps = state => {
    return {
        tributeStats: state.selectedTributeStats
    };
}

export default connect(mapStateToProps, {
    fetchTributeStat,
    updateTributeStats
})(AdjustStats);