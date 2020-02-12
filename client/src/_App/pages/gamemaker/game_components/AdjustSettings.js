import React from 'react';
import { connect } from 'react-redux';
import { Modal, Button, Form } from 'react-bootstrap';

import { 
    setMaxDistricts 
} from '../../../../actions';

class AdjustStart extends React.Component {
    _isMounted = false;

    constructor(props){
        super(props);
        this.state = { 
            maxDistricts: null,
            // Form display handling
            showModal: false,
            submitted: false,
        }

        this.handleDistricts = this.handleDistricts.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount = () => {
        this._isMounted = true;
    }

    handleDistricts(event) {
        this.setState({ maxDistricts: event.target.value})
    }

    async handleSubmit() {
        this.props.setMaxDistricts(this.state.maxDistricts);

        if(this._isMounted){
            this.setState({ submitted: true });
        }
        await setTimeout(() => this._isMounted ? this.setState({ submitted: false, showModal: false }) : null, 1000) ;
        this.props.onSubmitCallback();
    }

    renderContent = () => {
        if(!this.state.showModal){
            return(
                <Button variant="info" onClick={() => this.setState({ showModal: true })}>
                    Adjust Game Settings
                </Button>
            );
        } else if(this.state.submitted){
            return(
                <Button variant="secondary">
                    Saving...
                </Button>
            )
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
                {this.renderModal()}
                {this.renderContent()}           
            </>
        );
    }
}

export default connect(null, { 
    setMaxDistricts 
})(AdjustStart);