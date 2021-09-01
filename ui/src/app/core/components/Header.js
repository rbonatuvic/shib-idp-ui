import React from 'react';
import { Link } from 'react-router-dom';

import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Dropdown from 'react-bootstrap/Dropdown';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { faTh, faSignOutAlt, faPlusCircle, faCube, faCubes, faUsersCog, faSpinner, faUserCircle, faCog, faFileArchive, faUserTag } from '@fortawesome/free-solid-svg-icons';

import Translate from '../../i18n/components/translate';
import { useTranslator } from '../../i18n/hooks';

import { brand } from '../../app.brand';
import { useCurrentUser, useCurrentUserLoading, useIsAdmin } from '../user/UserContext';

export function Header () {

    const translator = useTranslator();

    const isAdmin = useIsAdmin();

    const { username, groupId } = useCurrentUser();
    const loading = useCurrentUserLoading();

    return (
        <Navbar expand="md" fixed="top" bg="">
            <Navbar.Brand href={brand.logo.link.url} title={brand.logo.link.description}>
                <img src={brand.logo.small} width="30" height="30" className="d-inline-block align-top" alt={brand.logo.alt} />
                <span className="d-lg-inline d-none"><Translate value={brand.logo.link.label}></Translate></span>
            </Navbar.Brand>
            <Navbar.Text><Translate value={brand.header.title}></Translate></Navbar.Text>
            {loading ?
            <div className="d-flex justify-content-end flex-fill">
                <FontAwesomeIcon icon={faSpinner} spin={true} pulse={true} size="lg" />
            </div>
            :
            <>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="ml-auto align-items-md-center" navbar>
                    <div className="border-md-right px-2">
                        <Link id="dashboard-nav" to="/dashboard" className="btn btn-link btn-sm" aria-label="Metadata Dashboard">
                            <i className="fa fa-th fa-fw" aria-hidden="true"></i>
                            <FontAwesomeIcon icon={faTh} className="mr-2" />
                            <Translate value="action.dashboard">Dashboard</Translate>
                        </Link>
                    </div>
                    <Dropdown className="border-md-right px-2" id="metadata-nav-dropdown">
                        <Dropdown.Toggle variant="link" id="metadata-nav-dropdown-toggle" size="sm">
                            <FontAwesomeIcon icon={faPlusCircle} className="mr-2" />
                            <Translate value={'action.add-new'} />
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Item as={Link} to="/metadata/source/new" className="text-primary py-2" id="metadata-nav-dropdown-source">
                                <FontAwesomeIcon icon={faCube} className="mr-2" />
                                <Translate value="action.add-new-source" />
                            </Dropdown.Item>
                            {isAdmin && <Dropdown.Item as={Link} to="/metadata/provider/new" className="text-primary py-2" id="metadata-nav-dropdown-provider">
                                <FontAwesomeIcon icon={faCubes} className="mr-2" />
                                <Translate value="action.add-new-provider" />
                            </Dropdown.Item> }
                        </Dropdown.Menu>
                    </Dropdown>
                    {isAdmin &&
                    <Dropdown className="border-md-right px-2" id="advanced-nav-dropdown">
                        <Dropdown.Toggle variant="link" id="advanced-nav-dropdown-toggle" size="sm">
                            <FontAwesomeIcon icon={faCog} className="mr-2" />
                            <Translate value={'action.advanced'} />
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Item as={Link} to="/metadata/attributes" className="text-primary py-2" id="advanced-nav-dropdown-attr">
                                <FontAwesomeIcon icon={faCube} className="mr-2" />
                                <Translate value="action.custom-entity-attributes" />
                            </Dropdown.Item>
                                    <Dropdown.Item as={Link} to="/metadata/attributes/bundles" className="text-primary py-2" id="advanced-nav-dropdown-bundles">
                                <FontAwesomeIcon icon={faFileArchive} className="mr-2" />
                                <Translate value="action.attribute-bundles" />
                            </Dropdown.Item>
                            <Dropdown.Item as={Link} to="/groups" className="text-primary py-2" id="advanced-nav-dropdown-groups">
                                <FontAwesomeIcon icon={faUsersCog} className="mr-2" />
                                <Translate value="action.groups" />
                            </Dropdown.Item>
                                    <Dropdown.Item as={Link} to="/roles" className="text-primary py-2" id="advanced-nav-dropdown-roles">
                                <FontAwesomeIcon icon={faUserTag} className="mr-2" />
                                <Translate value="action.roles" />
                            </Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                    }
                    <Dropdown className="pl-2" id="user-nav-dropdown">
                        <Dropdown.Toggle variant="link" id="user-nav-dropdown-toggle" size="sm" bsPrefix="dropdown-toggle-shibui">
                            <FontAwesomeIcon icon={faUserCircle} size="lg" className="mr-2" />
                            <Translate value={'action.logged-in'} params={{ username }} />
                        </Dropdown.Toggle>
                        <Dropdown.Menu alignRight={true}>
                            <Dropdown.Header>Groups</Dropdown.Header>
                            <Dropdown.ItemText id="advanced-nav-dropdown-groups">{groupId}</Dropdown.ItemText>
                            <div class="dropdown-divider"></div>
                            <Dropdown.Item href="/logout" target="_self" className="text-primary" aria-label={translator('action.logout')}
                                id="user-nav-dropdown-logout">
                                <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />
                                <Translate value="action.logout">Logout</Translate>
                            </Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </Nav>
            </Navbar.Collapse>
            </>
            }
        </Navbar>
    );
}

export default Header;
