import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Dropdown, Menu } from 'semantic-ui-react';

import { signIn } from '../../actions';
import GoogleAuth from '../../components/GoogleAuth';
import { 
    OwnerTools,
    AdminTools,
    GMTools,
    MentorTools,
    TributeTools,
    HelperTools
} from './NavToolHelpers';

class AppNavBar extends React.Component {

    // Will render out some admin tools if the user signs in and is authenticated
    renderLeftMenu() {
        if(this.props.name) {
            return (
                <Menu.Menu>
                    <Menu.Item>
                        <Link to="/">
                            Return to Website
                        </Link>
                    </Menu.Item>
                    <Menu.Item>
                        <Link to="/App/game-status">
                            Game Status
                        </Link>
                    </Menu.Item>
                    <Menu.Item>
                        <Link to="/App/map-rules">
                            Map & Rules
                        </Link>
                    </Menu.Item>

                    {this.renderToolsList()}

                </Menu.Menu>
            );
        }
        else {
            return (
                <Menu.Menu>
                    <Menu.Item>
                        <Link to="/">
                            Return to Website
                        </Link>
                    </Menu.Item>
                </Menu.Menu>
            )
        }
    }

    renderToolsText() {
        return this.capitalizeFirst(this.props.perms) + ' Tools';
    }

    renderToolsList() {
        // If no perms or perms not loaded, do not display tools menu
        if(!this.props.perms){
            return null;
        }

        var toolMenu = null;
        switch(this.props.perms){
            case 'owner':
                toolMenu = OwnerTools;
                break;
            case 'admin':
                toolMenu = AdminTools;
                break;
            case 'gamemaker':
                toolMenu = GMTools;
                break;
            case 'mentor':
                toolMenu = MentorTools;
                break;
            case 'tribute':
                toolMenu = TributeTools;
                break;
            case 'helper':
                toolMenu = HelperTools;
                break;
            default:
                toolMenu = null;
        }

        return(
            <Dropdown text={this.renderToolsText()} className="link item">
                {toolMenu}
            </Dropdown>
        );

    }

    GAuthMenuItem(){
        return (
            <Menu.Item>
                <GoogleAuth />
            </Menu.Item>
        );
    };
    
    renderRightMenu({ name, email, signedIn, authorized, perms }) {
        if(name){
            const welcomeAuthenticated = (
                `Welcome, ${name}! Your permissions: ${this.capitalizeFirst(perms)}`
            );

            return(
                <Menu.Menu position="right">
                    <Menu.Item>
                        <Dropdown text={welcomeAuthenticated}>
                            <Dropdown.Menu>
                                <Dropdown.Item>
                                    <GoogleAuth />
                                </Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </Menu.Item>
                </Menu.Menu>
            );
            // email only returned if data was attempted to be fetched
            // Authorized is true if the email was matched to a user in the database
        } else if(email && !authorized){
            return(
                <Menu.Menu position="right">
                    <Menu.Item>
                        {email} is not authorized to use the app.
                    </Menu.Item>
                    {this.GAuthMenuItem()}
                </Menu.Menu>
            );
        } else if(signedIn){
            return(
                <Menu.Menu position="right">
                    <Menu.Item>
                        Error retrieving user info.
                    </Menu.Item>
                    {this.GAuthMenuItem()}
                </Menu.Menu>
            );
        } else {
            return(
                <Menu.Menu position="right">
                    <Menu.Item>
                        You must be signed in to use the app.
                    </Menu.Item>
                    {this.GAuthMenuItem()}
                </Menu.Menu>
            );
        }
    }

    capitalizeFirst(text) {
        return text.slice(0, 1).toUpperCase() + text.slice(1, text.length);
    }

    render(){
        return(
            <div className="ui container">
                <Menu color="red">
                    {this.renderLeftMenu()}

                    {this.renderRightMenu(this.props)}
                </Menu>
            </div>
        );
    }
};

const mapStateToProps = (state) => {
    return {
        authorized: state.auth.authorized,
        signedIn: state.auth.isSignedIn,
        name: state.auth.userFirstName,
        email: state.auth.userEmail,
        perms: state.auth.userPerms
    };
}

export default connect(mapStateToProps, { signIn })(AppNavBar);