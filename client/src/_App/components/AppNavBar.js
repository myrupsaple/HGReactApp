import React from 'react';
import { connect } from 'react-redux';
import { Navbar, NavDropdown, Nav, NavItem } from 'react-bootstrap';

import { signIn } from '../../actions';
import GoogleAuth from '../../components/GoogleAuth';
import { 
    OwnerTools,
    AdminTools,
    GMTools,
    MentorTools,
    TributeTools,
    // HelperTools
} from './NavToolHelpers';

import './NavStyles.css';

class AppNavBar extends React.Component {

    // Will render out some admin tools if the user signs in and is authenticated
    renderLeftMenu() {
        if(this.props.name) {
            return (
                <>
                    <Nav.Link href="/">
                        <div className="return-to-site-link">
                            Return to Website
                        </div>
                    </Nav.Link>

                    <Nav.Link href="/App/game-status">
                        Game Status^
                    </Nav.Link>

                    <Nav.Link href="/App/map-rules">
                        Map & Rules*
                    </Nav.Link>

                    <NavDropdown title={this.renderToolsText()}>
                        {this.renderToolsList()}
                    </NavDropdown>

                    <Nav.Link href="/App/dev-updates">
                        Dev. Updates <span role="img" aria-label="grimace">😬</span>
                    </Nav.Link>
                </>
            );
        }
        else {
            return (
                <>
                    <Nav.Link href="/">
                        <div className="coolor-text-special-color-dark">
                            Return to Website
                        </div>
                    </Nav.Link>
               </>
            )
        }
    }
    
    renderToolsText() {
        return this.capitalizeFirstLetter(this.props.perms) + ' Tools';
    }

    capitalizeFirstLetter(text) {
        return text.slice(0, 1).toUpperCase() + text.slice(1, text.length);
    }
    
    renderToolsList() {
        // If no perms or perms not loaded, do not display tools menu
        if(!this.props.perms){
            return null;
        }

        switch(this.props.perms){
            case 'owner':
                return OwnerTools;
            case 'admin':
                return AdminTools;
            case 'gamemaker':
                return GMTools;
            case 'mentor':
                return MentorTools;
            case 'tribute':
                return TributeTools;
            // case 'helper':
            //     return HelperTools;
            default:
                return null;
        }

    }
    
    renderRightMenu({ authLoaded, name, email, signedIn, authorized, perms }) {
        const color = { color: '#D1E8E2' };
        
        if(!authLoaded){
            return <GoogleAuth color={color}/>;
        }
        
        if(name){
            const welcomeAuthenticated = (
                `Welcome, ${name}! Your permissions: ${this.capitalizeFirstLetter(perms)}`
            );

            return(
                <NavDropdown title={welcomeAuthenticated}>
                    <NavDropdown.Item as={Nav.Link} href="/App/user-settings" style={{ textAlign: 'center' }}>
                        Preferences
                    </NavDropdown.Item>
                    <NavDropdown.Item>
                        <GoogleAuth color={color}/>
                    </NavDropdown.Item>
               </NavDropdown>
            );
            // email only returned if data was attempted to be fetched
            // Authorized is true if the email was matched to a user in the database
        } else if(email && !authorized){
            return(
                <>
                    <NavItem>
                        {email} is not authorized to use the app.
                    </NavItem>
                    <NavItem>
                        <GoogleAuth color={color}/>
                    </NavItem>
               </>
            );
        } else if(signedIn){
            return(
                <>
                    <NavItem>
                        Error retrieving user info.
                    </NavItem>
                    <NavItem>
                        <GoogleAuth color={color}/>
                    </NavItem>
               </>
            );
        } else {
            return(
                <>
                    <NavItem>
                        
                        You must be signed in to use the app.
                    </NavItem>
                    <NavItem>
                        <GoogleAuth color={color}/>
                    </NavItem>
               </>
            );
        }
    }

    render(){
        return(
            <Navbar variant="dark" className="navbar-for-app">
                <Navbar.Brand href="/App">IVHG 20 App</Navbar.Brand>
                    <Nav className={`custom-dropdown-bg-app navbar-left`}>
                        {this.renderLeftMenu()}
                    </Nav>
                    <Nav className={`custom-dropdown-bg-app navbar-right`}>
                        {this.renderRightMenu(this.props)}
                    </Nav>
            </Navbar>
        );
    }
};

const mapStateToProps = (state) => {
    return {
        authLoaded: state.auth.loaded,
        authorized: state.auth.authorized,
        signedIn: state.auth.isSignedIn,
        name: state.auth.userFirstName,
        email: state.auth.userEmail,
        perms: state.auth.userPerms
    };
}

export default connect(mapStateToProps, { signIn })(AppNavBar);
