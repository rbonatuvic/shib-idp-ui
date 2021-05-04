import React from 'react';
import { Link } from 'react-router-dom';

import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTh, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';

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
                    <NavDropdown title="Dropdown" id="basic-nav-dropdown">
                        <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
                        <NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>
                        <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
                        <NavDropdown.Divider />
                        <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>
                    </NavDropdown>
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

/*
<li className="dropdown d-flex align-items-center"
    ngbDropdown
    placement="bottom-right"
    #dropdown="ngbDropdown">
    <button
        className="btn btn-outline-primary btn-sm"
        id="addNewDropdown"
        aria-haspopup="true"
        aria-expanded="false"
        ngbDropdownToggle>
        
        
    </button>
    <div ngbDropdownMenu aria-labelledby="addNewDropdown">
        <ng-container *ngFor="let action of nav$ | async">
            <a href=""
                className="nav-link"
                (click)="action.action($event); dropdown.close()"
                [attr.aria-label]="action.label | translate"
                role="button">
                <ng-container *ngIf="action.icon">
                    <i className="fa fa-fw" [ngClass]="action.icon"></i>
                    &nbsp;
                </ng-container>
                {{ action.content | translate }}
            </a>
        </ng-container>
    </div>
</li>
*/

export default Header;