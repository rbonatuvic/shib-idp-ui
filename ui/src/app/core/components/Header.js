import React from 'react';
import { Link } from 'react-router-dom';

import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Dropdown from 'react-bootstrap/Dropdown';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTh, faSignOutAlt, faPlusCircle, faCube, faCubes } from '@fortawesome/free-solid-svg-icons';

import Translate from '../../i18n/components/translate';
import { useTranslation } from '../../i18n/hooks';

import { brand } from '../../app.brand';

export function Header () {
    const logoutLabel = useTranslation('action.logout');

    return (
        <Navbar expand="md" fixed="top" bg="">
            <Navbar.Brand href={brand.logo.link.url} title={brand.logo.link.description}>
                <img src={brand.logo.small} width="30" height="30" className="d-inline-block align-top" alt={brand.logo.alt} />
                <span className="d-lg-inline d-none"><Translate value={brand.logo.link.label}></Translate></span>
            </Navbar.Brand>
            <Navbar.Text><Translate value={brand.header.title}></Translate></Navbar.Text>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="ml-auto align-items-center" navbar>
                    <Dropdown className="" id="basic-nav-dropdown">
                        <Dropdown.Toggle variant="outline-primary" id="dropdown-basic" size="sm">
                            <FontAwesomeIcon icon={faPlusCircle} className="mr-2" />
                            <Translate value={'action.add-new'} />
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Link to="/metadata/source/new" className="dropdown-item text-primary py-2">
                                <FontAwesomeIcon icon={faCube} className="mr-2" />
                                Metadata Source
                            </Link>
                            <Link to="/metadata/provider/new" className="dropdown-item text-primary py-2">
                                <FontAwesomeIcon icon={faCubes} className="mr-2" />
                                Metadata Provider
                            </Link>
                        </Dropdown.Menu>
                    </Dropdown>
                    <Link to="/dashboard" className="nav-link" aria-label="Metadata Dashboard">
                        <i className="fa fa-th fa-fw" aria-hidden="true"></i>
                        <FontAwesomeIcon icon={faTh} className="mr-2" />
                        <Translate value="action.dashboard">Dashboard</Translate>
                    </Link>
                    <Nav.Link href="/logout" target="_self" aria-label={logoutLabel}>
                        <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />
                        <Translate value="action.logout">Logout</Translate>
                    </Nav.Link>
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    );
}

export default Header;