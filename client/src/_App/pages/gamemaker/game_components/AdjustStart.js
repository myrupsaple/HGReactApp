import React from 'react';
import { connect } from 'react-redux';
import { Modal, Button } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

import { updateGameStartTime } from '../../../../actions';

class AdjustStart extends React.Component {
    _isMounted = false;

    constructor(props){
        super(props);
        this.state = { 
            showCalendar: false,
            showModal: false,
            submitted: false,
            startTime: this.props.startTime,
            formattedTime: null
        }

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount = () => {
        this._isMounted = true;
        this.handleChange(this.state.startTime);
    }

    handleChange(date) {
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();
        const hours = date.getHours();
        const minutes = date.getMinutes().toLocaleString(undefined, { minimumIntegerDigits: 2 });
        this.setState({ 
            startTime: date,
            formattedTime: `${month}/${day}/${year} ${hours}:${minutes}:00`,
            submitted: false
        })
    }

    async handleSubmit() {
        const date = this.state.startTime;
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();
        const hours = date.getHours();
        const minutes = date.getMinutes().toLocaleString(undefined, { minimumIntegerDigits: 2 });
        await this.props.updateGameStartTime(`${year}-${month}-${day} ${hours}:${minutes}:00`);
        if(this._isMounted){
            this.setState({ showCalendar: false, submitted: true });
        }
        await setTimeout(() => this._isMounted ? this.setState({ showModal: false, submitted: false }) : null, 1000) ;
        this.props.onSubmitCallback();
    }

    renderContent = () => {
        if(!this.state.showCalendar){
            return(
                <Button variant="info" onClick={() => this.setState({ showCalendar: true })}>
                    Adjust Start
                </Button>
            );
        } else {
            return(
                <>
                    {/* TODO: Fix locale issue (server is -8 hours on selected time) */}
                    {/* TODO: Select from range of resonable start times (rather than 12am-11:55pm) */}
                    <DatePicker 
                        value={this.state.formattedTime} 
                        onChange={this.handleChange} 
                        showTimeSelect
                        timeIntervals={5}
                    />
                    <Button 
                        variant="danger"
                        onClick={() => {
                            this.setState({ showCalendar: false });
                            this.handleChange(this.props.startTime);
                        }}>
                            Cancel
                    </Button>
                    <Button variant="info" onClick={this.compareTimeChange}>
                        Submit Changes
                    </Button>
                </>
            )
        }
    }

    compareTimeChange = () => {
        // Check if user changed start time. If not, exit immediately.
        // For some reason, using this.props.startTime and this.state.startTime wouldn't
        // match up as the same value even with ==
        const originalStartTime = this.props.startTime;
        const year = originalStartTime.getFullYear();
        const month = originalStartTime.getMonth() + 1;
        const day = originalStartTime.getDate();
        const hours = originalStartTime.getHours();
        const minutes = originalStartTime.getMinutes().toLocaleString(undefined, { minimumIntegerDigits: 2 });
        const originalStartTimeFormatted = `${month}/${day}/${year} ${hours}:${minutes}:00`;
        if(originalStartTimeFormatted === this.state.formattedTime){
            this.setState({ showCalendar: false })
        } else {
            this.setState({ showModal: true })
        }
    }

    renderModal = () => {
        if(!this.state.showModal){
            return null;
        }
        if(!this.state.submitted){
            return(
                <Modal show={this.state.showModal} onHide={this.handleClose}>
                    <Modal.Header>
                        <Modal.Title>Confirm Time Change</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        Are you sure you would like to update the game start time?
                        Performing this action after the game has started may cause
                        some events and actions to repeat, leading to undesired behavior.
                        Any actions resulting from this change cannot be easily reversed.
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={this.handleClose}>Cancel</Button>
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
                        Game start time changed successfully.
                    </Modal.Body>
                </Modal>
            )
        }
    }

    handleClose = () => {
        this.setState({ showModal: false });
    }
    
    render = () => {
        return(
            <>
                {this.renderContent()}    
                {this.renderModal()}            
            </>
        );
    }
}

export default connect(null, { updateGameStartTime })(AdjustStart);