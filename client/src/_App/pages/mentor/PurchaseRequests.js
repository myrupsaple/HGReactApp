import React from 'react';
import { connect } from 'react-redux';
import { Button } from 'react-bootstrap';

import { setNavBar } from '../../../actions';
import { OAuthFail, NotSignedIn, NotAuthorized, Loading } from '../../components/AuthMessages';
import Wait from '../../../components/Wait';
import { 
    fetchTributes,
    fetchMentors,
    fetchAllPurchaseRequests,
    deletePurchaseRequest
} from '../../../actions';


class PurchaseRequests extends React.Component {
    _isMounted = false;
    constructor(props){
        super(props)
        this.state = {
            auth: {
                loading: true,
                payload: null
            },
            mode: 'pending',
            // Causes a different message to be rendered during and after loading, if
            // no tributes are found
            queried: false,
            showCreate: false,
            showDetails: false,
            // Needed to access individual purchase request data
            selectedId: null
        };
    }

    checkAuth = async () => {
        // SET ALLOWED ACCESS GROUPS HERE
        const allowedGroups = ['owner', 'admin', 'gamemaker', 'mentor'];
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

        await this.props.fetchTributes();
        await this.props.fetchAllPurchaseRequests();
        await this.props.fetchMentors();
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
                Create Purchase Request
            </Button>
            </div>
        )
    }

    renderPurchases(){
        if(Object.keys(this.props.purchases).length === 0){
            // Return different message before and after first search is sent
            if(!this.state.queried) {
                return(
                    <h5>
                        Retrieving list of purchase requests...
                    </h5>
                );
            }
            return(
                <>
                    <h5>All caught up :)</h5>
                    <h6>No purchase requests were found.</h6>
                </>
            );
        }
        if(this.state.mode === 'pending'){
            return(
                <>
                <h3>Pending Purchase Requests:</h3>
                <ul className="list-group">
                    {this.renderTableHeader()}
                    {this.props.purchases.map(purchase => {
                        return(
                            <li className="list-group-item" key={purchase.id}>
                                <div className="row">
                                    <div className="col">{this.renderMentorName}</div>
                                    <div className="col">{purchase.email}</div>
                                    <div className="col">{purchase.district}</div>
                                    <div className="col">{this.formatArea(purchase.area)}</div>
                                    <div className="col">{this.renderAdmin(purchase)}</div>
                                </div>
                            </li>
                        );
                    })}
                </ul>
                </>
            );
        } else if(this.state.mode === 'fulfilled'){

        }
    }

    renderTableHeader(){
        return(
        <h5 className="row">
            <div className="col">Requested By</div>
            <div className="col">Item</div>
            <div className="col">Quantity</div>
            <div className="col">Payer</div>
            <div className="col">Receiver</div>
            <div className="col"></div>
        </h5>
        )
    }

    renderMentorName(){

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

    showModal() {
        if(this.state.showDetails){
            return(
                null
            );
        } else if(this.state.showCreate){
            return(
                null
            );
        }
    }

    // Performs cleanup upon modal closure, ensuring that showCreate and showDetails
    // do not get stuck in the 'true' state. Refreshes list upon closure
    onSubmitCallback = () => {
        this.setState({ showCreate: false, showDetails: false })
        this.props.fetchTributes();
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
                    {this.renderPurchases()}
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
        userPerms: state.auth.userPerms,
        purchases: Object.values(state.purchases),
        mentors: Object.values(state.users)
    }
}

export default connect(mapStateToProps, { 
    setNavBar,
    fetchTributes,
    fetchMentors,
    fetchAllPurchaseRequests,
    deletePurchaseRequest
    })(PurchaseRequests);