import React from 'react';
import { Link } from 'react-router-dom';

import {
    Collapse,
    Navbar,
    NavbarToggler,
    NavbarBrand,
    Nav,
    NavItem,
    NavLink,
    UncontrolledDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
    NavbarText
} from 'reactstrap';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusCircle, faTh, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';

import Translate from '../../i18n/components/translate';
import { useTranslation } from '../../i18n/hooks';

import { brand } from '../../app.brand';

export function Header () {
    const [isOpen, setIsOpen] = React.useState(false);

    const toggle = () => setIsOpen(!isOpen);
    const logoutLabel = useTranslation('action.logout');

    return (
        <Navbar expand="md" fixed="top">
            <NavbarBrand href={brand.logo.link.url} title={brand.logo.link.description}>
                <img src={brand.logo.small} width="30" height="30" className="d-inline-block align-top" alt={brand.logo.alt} />
                <span className="d-lg-inline d-none"><Translate value={brand.logo.link.label}></Translate></span>
            </NavbarBrand>
            <NavbarText><Translate value={brand.header.title}></Translate></NavbarText>
            <NavbarToggler onClick={toggle} />
            <Collapse isOpen={isOpen} navbar>
                <Nav className="ml-auto align-items-center" navbar>
                    <UncontrolledDropdown nav inNavbar caret="true">
                        <DropdownToggle className="btn btn-outline-primary btn-sm py-1" nav>
                            <FontAwesomeIcon icon={faPlusCircle} className="mr-2" />
                            <Translate value="action.add-new">Add New</Translate>
                        </DropdownToggle>
                        <DropdownMenu right>
                            <DropdownItem>
                            Option 1
                            </DropdownItem>
                            <DropdownItem>
                            Option 2
                            </DropdownItem>
                            <DropdownItem>
                            Reset
                            </DropdownItem>
                        </DropdownMenu>
                    </UncontrolledDropdown>
                    <NavItem>
                        <Link to="/dashboard" className="nav-link" aria-label="Metadata Dashboard">
                            <i className="fa fa-th fa-fw" aria-hidden="true"></i>
                            <FontAwesomeIcon icon={faTh} className="mr-2" />
                            <Translate value="action.dashboard">Dashboard</Translate>
                        </Link>
                    </NavItem>
                    <NavItem>
                        <NavLink className="nav-link" href="/logout" target="_self" aria-label={logoutLabel}>
                            <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />
                            <Translate value="action.logout">Logout</Translate>
                        </NavLink>
                    </NavItem>
                </Nav>
            </Collapse>
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