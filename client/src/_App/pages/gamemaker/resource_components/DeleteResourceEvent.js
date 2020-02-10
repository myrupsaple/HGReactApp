import React from 'react';
import { connect } from 'react-redux';
import { Modal, Button } from 'react-bootstrap';

import { 
    fetchResourceEvent,
    deleteResourceEvent, 
    resourceEventUpdateTributeStats,
    resourceEventUpdateResourceList
} from '../../../../actions';

class DeleteResourceEvent extends React.Component {
    // TODO: Add life_event deletion???
    _isMounted = false;
    
    constructor(props){
        super(props);
        this.state = {
            showModal: true,
            confirmed: false,
            apiError: false
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
        const response = await this.props.fetchResourceEvent(this.props.id);
        if(!response){
            this.setState({ apiError: true });
            return null;
        }

        const resourceEvent = this.props.resourceEvent;
        
        const response2 = await this.props.deleteResourceEvent(this.props.id);
        if(!response2){
            this.setState({ apiError: true });
            return null;
        }
        const response3 = await this.props.resourceEventUpdateTributeStats(resourceEvent.tribute_email, resourceEvent.type, 'delete');
        if(!response3){
            this.setState({ apiError: true });
            return null;
        }

        if(resourceEvent.method === 'code'){
            const response4 = await this.props.resourceEventUpdateResourceList(resourceEvent.notes, 'NA', 'delete')
            if(!response4){
                this.setState({ apiError: true });
                return null;
            }
        }

        if(this._isMounted){
            this.setState({ confirmed: true });
        }
        setTimeout(() => this.handleClose(), 1000);
    }

    renderBody = () => {
        if(this.state.apiError){
            return 'An error occurred during deletion. Please try again later.'
        } else if(this.state.confirmed){
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
        if(this.state.apiError){
            return <Button variant="secondary" onClick={this.handleClose}>Cancel</Button>
        } else if(this.state.confirmed){
            return null;
        } else {
            return(
                <>
                    <Button variant="danger" onClick={this.onConfirm}>Confirm</Button>
                    <Button variant="secondary" onClick={this.handleClose}>Cancel</Button>
                </>
            );
        }
    }

    render(){
        return(
            <Modal show={this.state.showModal} onHide={this.handleClose}>
                <Modal.Header>
                    <Modal.Title>Delete Resource Event</Modal.Title>
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
        resourceEvent: state.selectedResourceEvent
    };
}

export default connect(mapStateToProps, 
    { 
        fetchResourceEvent,
        deleteResourceEvent, 
        resourceEventUpdateTributeStats,
        resourceEventUpdateResourceList
    })(DeleteResourceEvent);
