import React from 'react';
import { Link } from 'react-router-dom';
import { Dropdown, Menu } from 'semantic-ui-react';

const NavBar = () => {
    return(
        <Menu secondary>
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

                <Menu.Item><Link to="/updates">
                    Site Updates
                </Link></Menu.Item>
            </Menu.Menu>
            <Menu.Menu position="right">
                <Menu.Item><Link to="/login">
                    Log In
                </Link></Menu.Item>
                <Menu.Item>
                        <a 
                        href="https://graceskalin10.wixsite.com/mysite"
                        rel="noopener noreferrer"
                        target="_blank"
                        >
                            2019 HG Site
                        </a>
                </Menu.Item>
            </Menu.Menu>
        </Menu>
    );
};

export default NavBar;