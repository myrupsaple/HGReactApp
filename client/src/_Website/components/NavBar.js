import React from 'react';
import { connect } from 'react-redux';
import GoogleAuth from '../../components/GoogleAuth';
import { Link } from 'react-router-dom';
import { Dropdown, Menu } from 'semantic-ui-react';

// TODO: Add admin powers to modify tribute pages

class NavBar extends React.Component {
    capitalizeFirst(text) {
        return text.slice(0, 1).toUpperCase() + text.slice(1, text.length);
    }

    renderLeftMenu() {
        return(
            <Menu.Menu>
                <Menu.Item><Link to="/">
                    Home
                </Link></Menu.Item>

                <Dropdown text="About" className="link item">
                    <Dropdown.Menu>
                        <Dropdown.Item>
                            <Link to="/about/hg">About Hunger Games</Link>
                        </Dropdown.Item>
                        <Dropdown.Item>
                            <Link to="/about/iv">About InterVarsity</Link>
                        </Dropdown.Item>
                        <Dropdown.Item>
                            <Link to="/about/rules">Rules</Link>
                        </Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>

                <Dropdown text="Districts" pointing className="link item">
                    <Dropdown.Menu>
                        <Dropdown.Item>
                            <Link to="/districts">Overview</Link>
                        </Dropdown.Item>
                        <Dropdown.Item>
                            <Link to="/districts/1">District 1</Link>
                        </Dropdown.Item>
                        <Dropdown.Item>
                            <Link to="/districts/2">District 2</Link>
                        </Dropdown.Item>
                        <Dropdown.Item>
                            <Link to="/districts/3">District 3</Link>
                        </Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>

                <Menu.Item><Link to="/watch">
                    Watch
                </Link></Menu.Item>

                <Menu.Item><Link to="/donate">
                    Donate
                </Link></Menu.Item>

                <Dropdown text="Misc." pointing className="link item">
                    <Dropdown.Menu>
                        <Dropdown.Item>
                            <Link to="/updates">Site Updates</Link>
                        </Dropdown.Item>
                        <Dropdown.Item>
                            <a 
                            href="https://graceskalin10.wixsite.com/mysite"
                            rel="noopener noreferrer"
                            target="_blank"
                            >
                                2019 HG Site
                            </a>
                        </Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            </Menu.Menu>
        );
    }

    GAuthMenuItem(){
        return (
            <Menu.Item>
                <GoogleAuth />
            </Menu.Item>
        );
    };

    renderRightMenu({ name, email, authorized, perms, signedIn }) {
        console.log('Authentication: ' + authorized);

        // Print a welcome message to authorized users, and allow them to access
        // the App via a dropdown link
        if(name){
            const authorizedWelcome = (
                `Welcome, ${name}! Your permissions: ${this.capitalizeFirst(perms)}`
            );

            return(
                <div>
                    <Menu.Menu position="right">
                        <Menu.Item>
                            <Dropdown text={authorizedWelcome}>
                                <Dropdown.Menu>
                                    <Dropdown.Item>
                                        <Link to="/App">
                                            Access App
                                        </Link>
                                    </Dropdown.Item>
                                    <Dropdown.Item>
                                        <GoogleAuth />
                                    </Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        </Menu.Item>
                    </Menu.Menu>
                </div>
            );
            // email only returned if data was attempted to be fetched
            // Authorized is true if the email was matched to a user in the database
        } else if(email && !authorized){
            return(
                <Menu.Menu position="right">
                    <Menu.Item>
                        {email} is not authorized.
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
                    {this.GAuthMenuItem()}
                </Menu.Menu>
            );
        }
    }
    
    render() {
        return(
            <div className="ui container">
                <Menu>
                    {this.renderLeftMenu()}

                    {this.renderRightMenu(this.props)}
                </Menu>
            </div>
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