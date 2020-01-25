import React from 'react';
import { connect } from 'react-redux';
import GoogleAuth from '../../components/GoogleAuth';
import { Navbar, NavDropdown, Nav, NavItem }from 'react-bootstrap';

import './NavStyles.css';

// TODO: Add admin powers to modify tribute pages

class NavBar extends React.Component {
    capitalizeFirst(text) {
        return text.slice(0, 1).toUpperCase() + text.slice(1, text.length);
    }

    renderLeftMenu() {
        return(
            <>
                <Nav.Link href="/">
                    Home
                </Nav.Link>

                <NavDropdown title="About">
                    <NavDropdown.Item as={Nav.Link} href="/about/hg">
                        About Hunger Games
                    </NavDropdown.Item>
                    <NavDropdown.Item as={Nav.Link} href="/about/iv">
                        About InterVarsity
                    </NavDropdown.Item>
                    <NavDropdown.Item as={Nav.Link} href="/about/rules">
                        Rules
                    </NavDropdown.Item>
                </NavDropdown>

                <NavDropdown title="Districts">
                    <NavDropdown.Item as={Nav.Link} href="/districts" >
                        Overview
                    </NavDropdown.Item>
                    <NavDropdown.Item as={Nav.Link} href="/districts/1" >
                        District 1
                    </NavDropdown.Item>
                    <NavDropdown.Item as={Nav.Link} href="/districts/2" >
                        District 2
                    </NavDropdown.Item>
                    <NavDropdown.Item as={Nav.Link} href="/districts/3" >
                        District 3
                    </NavDropdown.Item>
                </NavDropdown>

                <Nav.Link href="/watch">
                    Watch
                </Nav.Link>

                <Nav.Link href="/donate">
                    Donate
                </Nav.Link>

                <Nav.Link 
                    href="https://graceskalin10.wixsite.com/mysite" 
                    rel="noopener noreferrer" 
                    target="_blank" 
                >
                    2019 HG Site
                </Nav.Link>
            </>
        );
    }

    renderRightMenu({ name, email, authorized, perms, signedIn }) {
        console.log('Authentication: ' + authorized);

        const color = { color: '#D1E8E2' };

        // Print a welcome message to authorized users, and allow them to access
        // the App via a dropdown link
        if(name){
            const authorizedWelcome = (
                `Welcome, ${name}! Your permissions: ${this.capitalizeFirst(perms)}`
            );

            return(
                <>
                    <NavDropdown title={authorizedWelcome}>
                        <NavDropdown.Item as={Nav.Link} href="/App">
                            Access App
                        </NavDropdown.Item>
                        <NavDropdown.Item>
                            <GoogleAuth color={color}/>
                        </NavDropdown.Item>
                    </NavDropdown>
                </>
            );
            // email only returned if data was attempted to be fetched
            // Authorized is true if the email was matched to a user in the database
        } else if(email && !authorized){
            return(
                <>
                    <NavItem>
                        {email} is not authorized.
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
                        <GoogleAuth color={color}/>
                    </NavItem>
                </>
            );
        }
    }
    
    render() {
        return(
            <Navbar variant="light" className="navbar-for-web">
                <Navbar.Brand href="/">IVHG 20</Navbar.Brand>
                    <Nav className="mr-auto custom-dropdown-bg-web">
                        {this.renderLeftMenu()}
                    </Nav>
                    <Nav className="mr-auto custom-dropdown-bg-web">
                        {this.renderRightMenu(this.props)}
                    </Nav>
            </Navbar>
        );
    };
};

const mapStateToProps = (state) => {
    return {
        authorized: state.auth.authorized,
        name: state.auth.userFirstName,
        email: state.auth.userEmail,
        signedIn: state.auth.isSignedIn,
        perms: state.auth.userPerms
    }
};

export default connect(mapStateToProps)(NavBar);