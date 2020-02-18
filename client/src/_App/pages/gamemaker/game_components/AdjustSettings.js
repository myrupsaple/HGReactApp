import React from 'react';
import { connect } from 'react-redux';
import { Modal, Button, Form } from 'react-bootstrap';

import {
    updateGameState
} from '../../../../actions';

class AdjustStart extends React.Component {
    _isMounted = false;

    constructor(props){
        super(props);
        this.state = { 
            maxDistricts: 12,
            areas: '',
            // Form display handling
            showModal: false,
            firstSubmit: false,
            finalConfirm: false,
            districtsValid: 1,
            areasValid: 1,
            formValid: 1
        }

        this.handleDistricts = this.handleDistricts.bind(this);
        this.handleAreas = this.handleAreas.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount = async () => {
        this._isMounted = true;
        this.setState({
            maxDistricts: this.props.gameState.max_districts,
            areas: this.props.gameState.areas,
            districtsValid: 0,
            areasValid: 0,
        })
    }

    handleDistricts(event) {
        const input = event.target.value;
        this.setState({ maxDistricts: input });
        if(input === ''){
            this.setState({ districtsValid: 2 });
        } else if(isNaN(input)){
            this.setState({ districtsValid: 3 });
        } else if(Math.floor(input) <= 0){
            this.setState({ districtsValid: 4 });
        } else if(Math.floor(input) >= 20){
            this.setState({ districtsValid: 5 });
        } else if(input % 1 !== 0){
            this.setState({ districtsValid: 6 });
        } else {
            this.setState({ districtsValid: 0 });
        }
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

    handleSubmit = async () => {
        if(this.state.districtsValid === 1){
            this.setState({ districtsValid: 2 });
        }
        if(this.state.areasValid === 1){
            this.setState({ areasValid: 2 });
        }

        if(this.state.districtsValid + this.state.areasValid !== 0){
            this.setState({ formValid: 2 });
            return null;
        }

        if(this._isMounted && !this.state.firstSubmit){
            this.setState({ firstSubmit: true });
            return null;
        }

        var areas = this.state.areas;
        areas = areas.replace(/\s*,\s*/g, ',').replace(/,+/g, ',');

        await this.props.updateGameState(this.state.maxDistricts, encodeURIComponent(areas));

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
                    </Modal.Body>
                    <Modal.Footer>
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

    renderForm = () => {
        return(
            <Form>
                <Form.Row>
                    <div className="col-8"><Form.Group controlId="setDistricts">
                        <Form.Label>Maximum Districts</Form.Label>
                        <Form.Control
                            defaultValue={this.state.maxDistricts}
                            onChange={this.handleDistricts}
                            autoComplete="off"
                        />
                        {this.renderDistrictsValidation()}
                    </Form.Group></div>
                </Form.Row>
                <Form.Row>
                    <div className="col-12"><Form.Group controlId="setAreas">
                        <Form.Label>Areas (separate by commas)</Form.Label>
                        <Form.Control
                            defaultValue={this.state.areas}
                            onChange={this.handleAreas}
                            autoComplete="off"
                        />
                        {this.renderAreasValidation()}
                    </Form.Group></div>
                </Form.Row>
            </Form>
        );
    }

    renderDistrictsValidation = () => {
        if(this.state.districtsValid === 2){
            return(
                <p className="coolor-text-red" style={{ fontSize: "8pt" }}>
                    <span role="img" aria-label="check/x">&#10071;</span> Max districts is required
                </p>
            );
        } else if (this.state.districtsValid === 3){
            return(
                <p className="coolor-text-red" style={{ fontSize: "8pt" }}>
                    <span role="img" aria-label="check/x">&#10071;</span> Max districts must be a number
                </p>
            );
        } else if(this.state.districtsValid === 4) {
            return(
                <p className="coolor-text-red" style={{ fontSize: "8pt" }}>
                    <span role="img" aria-label="check/x">&#10071;</span> Max districts must be positive
                </p>
            );
        } else if(this.state.districtsValid === 5) {
            return(
                <p className="coolor-text-red" style={{ fontSize: "8pt" }}>
                    <span role="img" aria-label="check/x">&#10071;</span> Please choose a value less than 20
                </p>
            );
        } else if(this.state.districtsValid === 6) {
            return(
                <p className="coolor-text-red" style={{ fontSize: "8pt" }}>
                    <span role="img" aria-label="check/x">&#10071;</span> Please enter a whole number
                </p>
            );
        } else if(this.state.districtsValid === 0) {
            return(
                <p className="coolor-text-green" style={{ fontSize: "8pt" }}>
                    <span role="img" aria-label="check/x">&#10003;</span> Max districts
                </p>
            );
        } else {
            return null;
        }
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
    renderFormValidation = () =>{
        if(this.state.submitted){
            return null;
        } else if(this.props.mode === 'edit' && !this.props.donation.tribute_email){
            return null;
        } 
        if(this.state.emailValid + this.state.donorValid + 
            this.state.methodValid + this.state.amountValid === 0) {
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
    
    render = () => {
        console.log(this.state);
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
})(AdjustStart);