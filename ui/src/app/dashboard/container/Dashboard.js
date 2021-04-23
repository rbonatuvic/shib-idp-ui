import React from 'react';

import { Nav, NavItem } from 'reactstrap';
import { Switch, Route, Redirect, useRouteMatch } from 'react-router-dom';
import { NavLink } from 'react-router-dom';

import Translate from '../../i18n/components/translate';

import './Dashboard.scss';
import { ResolverList } from './ResolverList';

export function Dashboard () {

    const actions = 0;

    let { path, url } = useRouteMatch();

    return (
        <div className="container-fluid p-3" role="navigation">
            <Nav tabs>
                <NavItem>
                    <NavLink className="nav-link" to={`${path}/metadata/resolvers`}>
                        <Translate value="label.metadata-sources">Metadata Sources</Translate>
                    </NavLink>
                </NavItem>
                <NavItem>
                    <NavLink className="nav-link" to={`${path}/metadata/providers`}>
                        <Translate value="label.metadata-providers">Metadata Providers</Translate>
                    </NavLink>
                </NavItem>
                <NavItem>
                    <NavLink className="nav-link" to="/dashboard/admin/management">
                        <Translate value="label.admin">Admin</Translate>
                    </NavLink>
                </NavItem>
                <NavItem>
                    <NavLink className="nav-link" to="/dashboard/admin/actions">
                        <Translate value="label.action-required">Action Required</Translate>
                        <span className="badge badge-pill badge-danger">{actions}</span>
                    </NavLink>
                </NavItem>
            </Nav>
            <Switch>
                <Route>
                    <Route path={`${path}`}>
                        <Redirect to={ `${path}/metadata/resolvers` } />
                    </Route>
                    <Route path={`${path}/metadata/resolvers`} component={ResolverList} />
                </Route>
            </Switch>
        </div>
    );
}
/*
<ng-container * ngIf="hasActions$" >
                            & nbsp;
            <span className="badge badge-pill badge-danger">{{ actionsRequired$ | async}}</span>
                        </ng - container >
                        */
export default Dashboard;