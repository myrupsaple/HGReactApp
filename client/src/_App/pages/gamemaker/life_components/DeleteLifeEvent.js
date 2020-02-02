import React from 'react';
import { connect } from 'react-redux';
import { Modal, Button } from 'react-bootstrap';

import { 
    fetchLifeEvent,
    deleteLifeEvent, 
    lifeEventUpdateTributeStatsLives,
    lifeEventUpdateTributeStatsKills
} from '../../../../actions';

class DeleteLifeEvent extends React.Component {
    // PARAMS: id, description, actionType, onConfirm, onSubmitCallback
    _isMounted = false;
    
    constructor(props){
        super(props);
        this.state = {
            showModal: true,
            confirmed: false
        }
    }

    componentDidMount(){
        this._isMounted = true;
    }

    handleClose = () => {
        this.props.onSubmitCallback();
        if(this._isMounted){
            this.setState({ showModal: false });
        }
    }

    onConfirm = async () => {
        await this.props.fetchLifeEvent(this.props.id);
        const lifeEvent = this.props.lifeEvent;
        
        if(lifeEvent.type === 'combat'){
            this.props.lifeEventUpdateTributeStatsKills(lifeEvent.tribute_email, 'delete');
        } else {
            this.props.lifeEventUpdateTributeStatsLives(
                lifeEvent.tribute_email, lifeEvent.type, lifeEvent.method, 'delete');
        }

        this.props.deleteLifeEvent(this.props.id);

        if(this._isMounted){
            this.setState({ confirmed: true });
        }
        setTimeout(() => this.handleClose(), 1000);
    }

    renderBody = () => {
        if(this.state.confirmed){
            return 'Entry deleted successfully';
        } else {
            return(
                <>
                    <div>Are you sure you would like to delete this item?</div>
                </>
            );
        }
    }

    renderFooter = () => {
        if(this.state.confirmed){
            return null;
        } else {
            return(
                <>
                    <Button variant="danger" onClick={this.onConfirm}>Confirm</Button>
                    <Button variant="info" onClick={this.handleClose}>Cancel</Button>
                </>
            );
        }
    }

    render(){
        return(
            <Modal show={this.state.showModal} onHide={this.handleClose}>
                <Modal.Header>
                    <Modal.Title>Delete Life Event</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {this.renderBody()}
                </Modal.Body>
                <Modal.Footer>
                    {this.renderFooter()}
                </Modal.Footer>
            </Modal>
        );
    }

    componentWillUnmount(){
        this._isMounted = false;    
    }
};

const mapStateToProps = state => {
    return {
        lifeEvent: state.selectedLifeEvent
    };
}

export default connect(mapStateToProps, 
    { 
        fetchLifeEvent,
        deleteLifeEvent, 
        lifeEventUpdateTributeStatsLives,
        lifeEventUpdateTributeStatsKills
    })(DeleteLifeEvent);
