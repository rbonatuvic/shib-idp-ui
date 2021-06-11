import React from 'react';

import Nav from 'react-bootstrap/Nav';
import { Switch, Route, Redirect, useRouteMatch } from 'react-router-dom';
import { NavLink } from 'react-router-dom';

import Translate from '../../i18n/components/translate';
import { AdminRoute } from '../../core/components/AdminRoute';

import { SourcesTab } from './SourcesTab';
import { ProvidersTab } from './ProvidersTab';
import { AdminTab } from './AdminTab';
import { ActionsTab } from './ActionsTab';
import { useIsAdmin } from '../../core/user/UserContext';
import useFetch from 'use-http';
import API_BASE_PATH from '../../App.constant';
import { useNonAdminSources } from '../../metadata/hooks/api';

export function Dashboard () {

    const { path } = useRouteMatch();

    const isAdmin = useIsAdmin();

    const [actions, setActions] = React.useState(0);
    const [users, setUsers] = React.useState([]);
    const [sources, setSources] = React.useState([]);

    const { get, response } = useFetch(`${API_BASE_PATH}`, {
        cachePolicy: 'no-cache'
    });

    const sourceLoader = useNonAdminSources();

    async function loadUsers() {
        const users = await get('/admin/users')
        if (response.ok) {
            setUsers(users.filter(u => u.role === 'ROLE_NONE'));
        }
    }

    async function loadSources() {
        const s = sourceLoader.get();
        if (response.ok) {
            setSources(s);
        }
    }

    /*eslint-disable react-hooks/exhaustive-deps*/
    React.useEffect(() => {
        loadSources();
        loadUsers();
    }, []);

    React.useEffect(() => {
        setActions(users.length + sources.length);
    }, [users, sources]);

    return (
        <div className="container-fluid p-3" role="navigation">
            
            <Nav variant="tabs">
                <Nav.Item>
                    <NavLink className="nav-link" to={`${path}/metadata/manager/resolvers`}>
                        <Translate value="label.metadata-sources">Metadata Sources</Translate>
                    </NavLink>
                </Nav.Item>
                {isAdmin &&
                <>
                    <Nav.Item>
                        <NavLink className="nav-link" to={`${path}/metadata/manager/providers`}>
                            <Translate value="label.metadata-providers">Metadata Providers</Translate>
                        </NavLink>
                    </Nav.Item>
                    <Nav.Item>
                        <NavLink className="nav-link" to={`${path}/admin/management`}>
                            <Translate value="label.admin">Admin</Translate>
                        </NavLink>
                    </Nav.Item>
                    <Nav.Item>
                        <NavLink className="nav-link d-flex align-items-center" to={`${path}/admin/actions`}>
                            <Translate value="label.action-required">Action Required</Translate>
                            <span className="badge badge-pill badge-danger ml-1">{actions}</span>
                        </NavLink>
                    </Nav.Item>
                </>
                }
            </Nav>
            <Switch>
                <Route exact path={`${path}`}>
                    <Redirect to={`${path}/metadata/manager/resolvers`} />
                </Route>
                <Route path={`${path}/metadata/manager/resolvers`} component={SourcesTab} />
                <AdminRoute path={`${path}/metadata/manager/providers`} component={ProvidersTab} />
                <AdminRoute path={`${path}/admin/management`} component={AdminTab} />
                <Route path={`${path}/admin/actions`}>
                    <ActionsTab sources={sources} users={users} reloadSources={loadSources} reloadUsers={loadUsers} />
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