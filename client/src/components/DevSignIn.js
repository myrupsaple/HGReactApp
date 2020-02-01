import React from 'react';
import { connect } from 'react-redux';
import { Form, Button } from 'react-bootstrap';

import { devSignIn } from '../actions';
import Wait from './Wait';

class DevSignIn extends React.Component {
    _isMounted = false;

    constructor(props){
        super(props);
        this.state = {
            email: '',
            permissions: '',
            ownerLock: false
        };   

        this.handleEmail = this.handleEmail.bind(this);
        this.handlePermissions = this.handlePermissions.bind(this);
    }

    componentDidMount = async () => {
        this._isMounted = true;

        while(!this.props.currentPerms){
            await Wait(1000);
        }

        if(this.props.currentPerms === 'owner'){
            if(this._isMounted){
                this.setState({ ownerLock: true })
            }
        }
    }

    handleEmail(event){
        this.setState({ email: event.target.value });
    }
    handlePermissions(event){
        this.setState({ permissions: event.target.value });
    }
    
    handleSubmit = (event) => {
        event.preventDefault();

        if(this.state.email === '' || this.state.permissions === ''){
            return null;
        }

        this.props.devSignIn(this.state.email, this.state.permissions);
    }
    
    render = () => {
        if(this.state.ownerLock){
            return(
                <div style={{ display: "flex", padding: "10px", justifyContent: "flex-end" }}>
                    <Form onSubmit={this.handleSubmit}>
                        <Form.Row>
                            <Form.Group controlId="email">
                                <Form.Control
                                    placeholder="Email"
                                    value={this.state.email}
                                    onChange={this.handleEmail}
                                />
                            </Form.Group>
                            <Form.Group controlId="permissions">
                                <Form.Control
                                    placeholder="Permissions"
                                    value={this.state.permissions}
                                    onChange={this.handlePermissions}
                                />
                            </Form.Group>
                        </Form.Row>
                        <Form.Row>
                            <div className="row">
                                <p>Signed in as&nbsp;</p>
                                <b>{this.props.currentEmail}&nbsp;</b>
                                <p>with&nbsp;</p>
                                <b>{this.props.currentPerms}&nbsp;</b>
                                <p>permissions.</p>
                            </div>
                        </Form.Row>
                        <Form.Row>
                            <Button variant="danger" onClick={() => this.setState({ ownerLock: false })}>
                                Hide Dev Sign In
                            </Button>
                            <Button variant="info" type="submit">
                                Change Permissions
                            </Button>
                        </Form.Row>
                    </Form>
                </div>
            );
        } else {
            return null;
        }
    }

    componentWillUnmount(){
        this._isMounted = false;
    }
}

const mapStateToProps = state => {
    return { 
            currentPerms: state.auth.userPerms, 
            currentEmail: state.auth.userEmail,
        };
}

export default connect(mapStateToProps, { devSignIn })(DevSignIn);