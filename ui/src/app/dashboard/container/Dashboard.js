import React from 'react';

import { Nav, NavItem } from 'reactstrap';
import { Switch, Route, Redirect, useRouteMatch } from 'react-router-dom';
import { NavLink } from 'react-router-dom';

import Translate from '../../i18n/components/translate';

import './Dashboard.scss';
import { SourcesTab } from './SourcesTab';
import { ProvidersTab } from './ProvidersTab';
import { AdminTab } from './AdminTab';
import { ActionsTab } from './ActionsTab';

export function Dashboard () {

    const actions = 0;

    let { path } = useRouteMatch();

    return (
        <div className="container-fluid p-3" role="navigation">
            <Nav tabs>
                <NavItem>
                    <NavLink className="nav-link" to={`${path}/metadata/manager/resolvers`}>
                        <Translate value="label.metadata-sources">Metadata Sources</Translate>
                    </NavLink>
                </NavItem>
                <NavItem>
                    <NavLink className="nav-link" to={`${path}/metadata/manager/providers`}>
                        <Translate value="label.metadata-providers">Metadata Providers</Translate>
                    </NavLink>
                </NavItem>
                <NavItem>
                    <NavLink className="nav-link" to={`${path}/admin/management`}>
                        <Translate value="label.admin">Admin</Translate>
                    </NavLink>
                </NavItem>
                <NavItem>
                    <NavLink className="nav-link d-flex align-items-center" to={`${path}/admin/actions`}>
                        <Translate value="label.action-required">Action Required</Translate>
                        <span className="badge badge-pill badge-danger ml-1">{actions}</span>
                    </NavLink>
                </NavItem>
            </Nav>
            <Switch>
                <Route exact path={`${path}`}>
                    <Redirect to={`${path}/metadata/manager/resolvers`} />
                </Route>
                <Route path={`${path}/metadata/manager/resolvers`} component={SourcesTab} />
                <Route path={`${path}/metadata/manager/providers`} component={ProvidersTab} />
                <Route path={`${path}/admin/management`} component={AdminTab} />
                <Route path={`${path}/admin/actions`} component={ActionsTab} />
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