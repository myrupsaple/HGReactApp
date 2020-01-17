import React from 'react';
import { connect } from 'react-redux';
import { Button, Modal } from 'react-bootstrap';

import { fetchTribute, deleteTribute } from '../../../../actions';

class DeleteTribute extends React.Component {
    _isMounted = false;

    constructor(props){
        super(props);
        this.state = {};
    }

    async componentDidMount() {
        this._isMounted = true;
        await this.props.fetchTribute(this.props.email, this.props.id);

        console.log(this.props.email);
        console.log(this.props.tribute);

        if(this._isMounted){
            this.setState({
                first_name: this.props.tribute.first_name,
                last_name: this.props.tribute.last_name,
                email: this.props.tribute.email,
                firstConfirm: false,
                show: true
            });
        }
    }
    
    renderModal = () => {
        var modalBody = null;
        var renderActions = null;
        if(!this.props.tribute.first_name){
            modalBody = ( 
                <h3>
                    An error occurred while retrieving tribute data. Please try again.
                </h3>
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
        if(!this.state.firstConfirm){
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
    
    handleDeleteSubmit = (event) => {
        this.setState({ firstConfirm: true });
    }

    handleFinalConfirm = () => {
        this.props.deleteTribute(this.props.tribute.id);
        this.handleClose();
    }
    
    handleClose = async () => {
        await this.setState({ firstConfirm: false, show: false });
        console.log(this.state.show);
        this.props.updateShow(this.state.show);
    }

    render(){
        return(
            <>
                {this.renderModal()}
            </>
        )
    }

    componentWillUnmount(){
        console.log('unmounted');
        this._isMounted = false;
    }
}

const mapStateToProps = state => {
    return { 
        tribute: state.selectedTribute,

    };
};

export default connect(mapStateToProps, { fetchTribute, deleteTribute })(DeleteTribute);