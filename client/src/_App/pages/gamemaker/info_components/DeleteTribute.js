import React from 'react';
import { connect } from 'react-redux';
import { Button, Modal } from 'react-bootstrap';

import { fetchTribute, deleteTribute } from '../../../../actions';

class DeleteTribute extends React.Component {
    _isMounted = false;

    constructor(props){
        super(props);
        this.state = { 
            firstConfirm: false,
            show: true,
            submitted: false
        };
    }

    async componentDidMount() {
        this._isMounted = true;
        const response = await this.props.fetchTribute(this.props.email, this.props.id);
        if(!response){
            return null;
        }

        if(this._isMounted){
            this.setState({
                first_name: this.props.tribute.first_name,
                last_name: this.props.tribute.last_name,
                email: this.props.tribute.email
            });
        }
    }
    
    renderModal = () => {
        var modalBody = null;
        var renderActions = null;
        if(this.state.submitted){
            modalBody = <h4>User Deleted Successfully!</h4>;
            renderActions = null;
        } else if(this.state.apiError){
            modalBody = ( 
                <h4>
                    An error occurred while deleting the user. Please try again later.
                </h4>
            );
            renderActions = (
                <Button variant="secondary" onClick={this.handleClose}>Close</Button>
            );
        } else if(!this.props.tribute.first_name){
            modalBody = ( 
                <h4>
                    An error occurred while retrieving tribute data. Please try again.
                </h4>
            );
            renderActions = (
                <Button variant="secondary" onClick={this.handleClose}>Cancel</Button>
            );
        } else if (!this.state.firstConfirm){
            modalBody = (
                <h4>
                    Are you sure you would like to delete the account {this.props.tribute.email} for {this.props.tribute.first_name} {this.props.tribute.last_name}?
                </h4>
            );
            renderActions = (
                <>
                    <Button variant="secondary" onClick={this.handleClose}>Cancel</Button>
                    <Button variant="danger" onClick={this.handleDeleteSubmit}>Delete</Button>
                </>
            );
        } else {
            modalBody = (
                <h4>
                    Are you sure? This will delete the tribute's account information only.
                    This action cannot be undone (but you can always re-create the tribute).
                </h4>
            );
            renderActions = (
                <>
                    <Button variant="danger" onClick={this.handleFinalConfirm}>I Understand, Confirm Delete</Button>
                    <Button variant="secondary" onClick={this.handleClose}>Cancel</Button>
                </>
            );
        }
        if(!this.state.firstConfirm || this.state.submitted){
            return (
                <Modal show={this.state.show} onHide={this.handleClose}>
                    <Modal.Header>
                        <Modal.Title>Delete Tribute</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>{modalBody}</Modal.Body>
                    <Modal.Footer>
                        {renderActions}
                    </Modal.Footer>
                </Modal>
            );
        } else {
            return (
                <Modal show={this.state.show} onHide={this.handleClose}>
                    <Modal.Header>
                        <Modal.Title>Delete Tribute</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>{renderActions}</Modal.Body>
                    <Modal.Footer>
                        {modalBody}
                    </Modal.Footer>
                </Modal>
            );
        }
    }
    
    handleDeleteSubmit = () => {
        this.setState({ firstConfirm: true });
    }

    handleFinalConfirm = async () => {
        const response = await this.props.deleteTribute(this.props.tribute.id);
        if(!response){
            this.setState({ apiError: true });
            return null;
        }

        this.setState({ submitted: true });
        setTimeout(() => this.handleClose(), 1000);
    }
    
    handleClose = () => {
        if(this._isMounted){
            this.setState({ firstConfirm: false, show: false });
            this.props.onSubmitCallback(this.state.show);
        }
    }

    render(){
        return(
            <>
                {this.renderModal()}
            </>
        )
    }

    componentWillUnmount(){
        this._isMounted = false;
    }
}

const mapStateToProps = state => {
    return { 
        tribute: state.selectedTribute,

    };
};

export default connect(mapStateToProps, { fetchTribute, deleteTribute })(DeleteTribute);