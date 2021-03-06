import React from 'react';
import { connect } from 'react-redux';
import { Button } from 'react-bootstrap';

import { setNavBar } from '../../../actions';
import { OAuthFail, NotSignedIn, NotAuthorized, Loading } from '../../components/AuthMessages';
import Wait from '../../../components/Wait';
import { fetchTributes } from '../../../actions';
import TributeDetails from './info_components/TributeDetails';
import TributeInfoForm from './info_components/TributeInfoForm';

class TributeAccountInfo extends React.Component {
    _isMounted = false;
    constructor(props){
        super(props)
        this.state = {
            auth: {
                loading: true,
                payload: null
            },
            // Causes a different message to be rendered during and after loading, if
            // no tributes are found
            queried: false,
            showCreate: false,
            showDetails: false,
            // API erro handling
            apiError: false,
        };
    }

    checkAuth = async () => {
        // SET ALLOWED ACCESS GROUPS HERE
        const allowedGroups = ['owner', 'admin', 'gamemaker'];
        var timeoutCounter = 0;
        while(!this.props.authLoaded){
            await Wait(1000);
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
        this._isMounted = true;
        this.props.setNavBar('app');
        // Check authorization
        const authPayload = await this.checkAuth();
        if(this._isMounted){
            this.setState({
                auth:{
                    payload: authPayload
                }
            })
        }

        const response = await this.props.fetchTributes();
        if(!response){
            this.setState({ apiError: true });
        }
        if(this._isMounted){
            this.setState({ queried: true })
        }
    }

    // Render modal header (Create/refresh list buttons)
    renderCreate(){
        return(
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <Button 
            variant="secondary"
            onClick={() => this.setState({ showCreate: true })}
            className="coolor-bg-purple-darken-2"
            >
                Create Tribute Account
            </Button>
            </div>
        )
    }

    renderTributes(){
        if(this.state.apiError){
            return(
                <h5>
                    An error occurred while loading data.
                </h5>
            );
        }
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
        
        const tributes = this.props.tributes;
        tributes.sort((a, b) => a.district - b.district);

        return(
            <>
            <h3>Tributes found:</h3>
            <ul className="list-group">
                {this.renderTableHeader()}
                {tributes.map(tribute => {
                    return(
                        <li className="list-group-item" key={tribute.id}>
                            <div className="row">
                                <div className="col">{tribute.first_name} {tribute.last_name}</div>
                                <div className="col">{tribute.email}</div>
                                <div className="col">{tribute.phone}</div>
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
                onClick={() => this.setState({ showDetails: true, selectedEmail: tribute.email })}
                >
                    View Details
                </Button>
            </div>
        );
    }

    renderTableHeader(){
        return(
        <h5 className="row">
            <div className="col">Tribute Name</div>
            <div className="col">Email</div>
            <div className="col">Phone Number</div>
            <div className="col">District</div>
            <div className="col">Area</div>
            <div className="col"></div>
        </h5>
        )
    }

    showModal() {
        if(this.state.showDetails){
            return(
                <TributeDetails email={this.state.selectedEmail} id={this.state.selectedId} onSubmitCallback={this.onSubmitCallback} />
            )
        } else if(this.state.showCreate){
            return(
                <TributeInfoForm onSubmitCallback={this.onSubmitCallback} mode="create" />
            )
        }
    }

    // Performs cleanup upon modal closure, ensuring that showCreate and showDetails
    // do not get stuck in the 'true' state. Refreshes list upon closure
    onSubmitCallback = async () => {
        this.setState({ showCreate: false, showDetails: false })
        const response = await this.props.fetchTributes();
        if(!response){
            this.setState({ apiError: true });
        }
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
                    {this.renderCreate()}
                    {this.renderTributes()}
                    {this.showModal()}
                </>
            );
        } else {
            return (<h3>{this.state.auth.payload}</h3>);
        }
    }

    render = () => {
        return(
            <>
                <h3 style={{ padding: "10px" }}>Tribute Account Management</h3>
                {this.renderContent()}
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

export default connect(mapStateToProps, { 
    fetchTributes,
    setNavBar
    })(TributeAccountInfo);