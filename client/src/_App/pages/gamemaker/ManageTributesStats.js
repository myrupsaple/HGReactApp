import React from 'react';
import { connect } from 'react-redux';
import { Form, Col, Button } from 'react-bootstrap';

import AppNavBar from '../../components/AppNavBar';
import { OAuthFail, NotSignedIn, NotAuthorized, Loading } from '../../components/AuthMessages';
import Wait from '../../../components/Wait';
import { fetchTributes } from '../../../actions';
import TributeDetails from './components/TributeDetails';
import TributeInfoForm from './components/TributeInfoForm';

class ManageTributeStats extends React.Component {
    _isMounted = true;
    state = {
        auth: {
            loading: true,
            payload: null
        },
        apiQueriedTributesList: false,
        showCreate: false,
        showDetails: false
    };

    checkAuth = async () => {
        // SET ALLOWED ACCESS GROUPS HERE
        const allowedGroups = ['owner', 'admin', 'gamemaker'];
        var timeoutCounter = 0;
        while(!this.props.authLoaded){
            await Wait(500);
            timeoutCounter ++;
            console.log('waiting on authLoaded')
            if (timeoutCounter > 5){
                return(OAuthFail);
            }
        }

        timeoutCounter = 0;
        while(!this.props.isSignedIn){
            await Wait(500);
            timeoutCounter ++;
            console.log('waiting on isSignedIn');
            if (timeoutCounter > 5){
                return(NotSignedIn);
            }
        }

        if(this._isMounted){
            this.setState({
                auth:{
                    loading: false
                }
            })
        }

        const userPerms = this.props.userPerms;
        for (let group of allowedGroups){
            if(userPerms === group){
                return null;
            }
        }

        return(NotAuthorized);
    }

    componentDidMount = async () => {
        // Check authorization
        const authPayload = await this.checkAuth();
        if(this._isMounted){
            this.setState({
                auth:{
                    payload: authPayload
                }
            })
        }

        await this.props.fetchTributes();
        if(this._isMounted){
            this.setState({ apiQueriedTributesList: true })
        }
    }

    renderTop(){
        return(
            <Button 
            variant="info"
            onClick={() => this.setState({ showCreate: true })}
            >
                Create
            </Button>
        )
    }

    renderTributes(){
        if(Object.keys(this.props.tributes).length === 0){
            // Return different message before and after first search is sent
            if(!this.state.queried) {
                return(
                    <h5>
                        Retrieving list of tributes...
                    </h5>
                );
            }
            return(
                <>
                    <h5>No tributes were found :(</h5>
                </>
            );
        }
        return(
            <>
            <h3>Tributes found:</h3>
            <ul className="list-group">
                {this.renderTableHeader()}
                {this.props.tributes.map(tribute => {
                    return(
                        <li className="list-group-item" key={tribute.id}>
                            <div className="row">
                                <div className="col">{tribute.first_name} {tribute.last_name}</div>
                                <div className="col">{tribute.email}</div>
                                <div className="col">{tribute.district}</div>
                                <div className="col">{tribute.area}</div>
                                <div className="col">{this.renderAdmin(tribute)}</div>
                            </div>
                        </li>
                    );
                })}
            </ul>
            </>
        );
    }

    renderAdmin(tribute) {
        return(
            <div className="row">
                <Button 
                variant="info"
                onClick={() => this.setState({ showDetails: true, selectedEmail: tribute.email, selectedId: tribute.id })}
                >
                    View Details
                </Button>
            </div>
        );
    }

    renderTableHeader(){
        return(
        <h5 className="row">
            <div className="col">First Name</div>
            <div className="col">Email</div>
            <div className="col">District</div>
            <div className="col">Area</div>
            <div className="col"></div>
        </h5>
        )
    }

    showModal() {
        if(this.state.showDetails){
            return(
                <TributeDetails email={this.state.selectedEmail} id={this.state.selectedId} updateShow={this.updateShowFromChild} />
            )
        } else if(this.state.showCreate){
            return(
                <TributeInfoForm onDismiss={this.updateShowFromChild} mode="create" />
            )
        }
    }

    updateShowFromChild = () => {
        this.setState({ showDetails: false, showCreate: false })
    };

    renderContent = () => {
        if(this.state.auth.loading){
            return(
                <>
                <h3>Authorizing user...</h3>
                <p>{Loading}</p>
                </>
            );
        }
        if(this.state.auth.payload === null){
            return(
                <>
                    {this.renderTop()}
                    {this.renderTributes()}
                    {this.showModal()}
                </>
            );
        } else {
            return (<h3>{this.state.auth.payload}</h3>);
        }
    }

    render = () =>{
        return(
            <>
                <AppNavBar />
                <div className="ui-container">
                    {this.renderContent()}
                </div>
            </>
        )
    }

    componentWillUnmount() {
        this._isMounted = false;
    }
};

const mapStateToProps = state => {
    return{
        tributes: Object.values(state.tributes),
        authLoaded: state.auth.loaded,
        isSignedIn: state.auth.isSignedIn,
        userPerms: state.auth.userPerms
    }
}

export default connect(mapStateToProps, { fetchTributes })(ManageTributeStats);