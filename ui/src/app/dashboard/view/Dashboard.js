import React from 'react';

import Nav from 'react-bootstrap/Nav';
import { Switch, Route, Redirect, useRouteMatch, useLocation } from 'react-router-dom';
import { NavLink } from 'react-router-dom';

import Translate from '../../i18n/components/translate';
import { ProtectRoute } from '../../core/components/ProtectRoute';

import { SourcesTab } from './SourcesTab';
import { ProvidersTab } from './ProvidersTab';
import { AdminTab } from './AdminTab';
import { ActionsTab } from './ActionsTab';
import { useCurrentUserLoading, useIsAdmin } from '../../core/user/UserContext';
import useFetch from 'use-http';
import API_BASE_PATH from '../../App.constant';
import { useNonAdminSources } from '../../metadata/hooks/api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import Badge from 'react-bootstrap/Badge';

export function Dashboard () {

    const { path, url } = useRouteMatch();
    const location = useLocation();

    const isAdmin = useIsAdmin();

    const loadingUser = useCurrentUserLoading();

    const [actions, setActions] = React.useState(0);
    const [users, setUsers] = React.useState([]);
    const [sources, setSources] = React.useState([]);

    const { get, response, loading } = useFetch(`${API_BASE_PATH}`, {
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
        const s = await sourceLoader.get();
        if (response.ok) {
            setSources(s);
        }
    }

    /*eslint-disable react-hooks/exhaustive-deps*/
    React.useEffect(() => {
        loadSources();
        loadUsers();
    }, [location]);

    React.useEffect(() => {
        setActions(users.length + sources.length);
    }, [users, sources]);

    return (
        <div className="container-fluid p-3" role="navigation">
            {loadingUser ?
            <div className="d-flex justify-content-center text-primary mt-5">
                <FontAwesomeIcon icon={faSpinner} spin={true} pulse={true} size="3x" />
            </div>
            :
            <><Nav variant="tabs">
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
                            <Badge pill bg="danger" className="ms-1">{actions}</Badge>
                        </NavLink>
                    </Nav.Item>
                </>
                }
            </Nav>
            <Switch>
                <Route exact path={`${path}`}>
                    <Redirect to={`${url}/metadata/manager/resolvers`} />
                </Route>
                <Route path={`${path}/metadata/manager/resolvers`} component={SourcesTab} />
                <Route path={`${path}/metadata/manager/providers`} component={ProvidersTab} />
                <Route path={`${path}/admin/management`} render={() =>
                    <ProtectRoute redirectTo="/dashboard">
                        <AdminTab />
                    </ProtectRoute>
                } />
                <Route path={`${path}/admin/actions`} render={() =>
                    <ProtectRoute redirectTo="/dashboard">
                        <ActionsTab
                            sources={sources}
                            users={users}
                            reloadSources={loadSources}
                            reloadUsers={loadUsers}
                            loadingSources={sourceLoader.loading}
                            loadingUsers={loading} />
                    </ProtectRoute>
                } />
                <Route exact path={`${path}/*`}>
                    <Redirect to={`${url}/metadata/manager/resolvers`} />
                </Route>
            </Switch></>
            }
        </div>
    );
}
export default Dashboard;