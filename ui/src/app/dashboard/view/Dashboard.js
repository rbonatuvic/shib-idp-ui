import React from 'react';

import Nav from 'react-bootstrap/Nav';
import { Switch, Route, Redirect, useRouteMatch } from 'react-router-dom';
import { NavLink } from 'react-router-dom';

import Translate from '../../i18n/components/translate';
import { ProtectRoute } from '../../core/components/ProtectRoute';

import { SourcesTab } from './SourcesTab';
import { ProvidersTab } from './ProvidersTab';
import { AdminTab } from './AdminTab';
import { ActionsTab } from './ActionsTab';
import { useCurrentUserLoading, useIsAdmin, useIsApprover } from '../../core/user/UserContext';
import { DynamicRegistrationsTab } from './DynamicRegistrationsTab';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import Badge from 'react-bootstrap/Badge';
import { useGetNewUsersQuery } from '../../store/user/UserSlice';
import { useGetDisabledSourcesQuery, useGetUnapprovedSourcesQuery } from '../../store/metadata/SourceSlice';
import { useGetDisabledRegistrationsQuery, useGetUnapprovedRegistrationsQuery } from '../../store/dynamic-registration/DynamicRegistrationSlice';

export function Dashboard () {

    const { path, url } = useRouteMatch();

    const isAdmin = useIsAdmin();
    const isApprover = useIsApprover();

    const loadingUser = useCurrentUserLoading();

    const [actions, setActions] = React.useState(0);

    const {data: users = []} = useGetNewUsersQuery();
    const {data: disabledSources = []} = useGetDisabledSourcesQuery();
    const {data: unApprovedSources = []} = useGetUnapprovedSourcesQuery();
    const {data: unApprovedRegistrations = []} = useGetUnapprovedRegistrationsQuery();
    const {data: disabledRegistrations = []} = useGetDisabledRegistrationsQuery();

    React.useEffect(() => {
        const count = 
            (users?.length || 0) +
            (disabledSources?.length || 0) +
            (unApprovedRegistrations?.length || 0) +
            (disabledSources?.length || 0) +
            (disabledRegistrations.length || 0)
        setActions(count);
    }, [users, disabledSources, unApprovedSources, disabledRegistrations, unApprovedRegistrations]);

    return (
        <div className="container-fluid p-3" role="navigation">
            {loadingUser ?
            <div className="d-flex justify-content-center text-primary mt-5">
                <FontAwesomeIcon icon={faSpinner} spin={true} pulse={true} size="3x" />
            </div>
            :
            <React.Fragment>
                <Nav variant="tabs">
                    <Nav.Item>
                        <NavLink className="nav-link" to={`${path}/metadata/manager/resolvers`}>
                            <Translate value="label.metadata-sources">Metadata Sources</Translate>
                        </NavLink>
                    </Nav.Item>
                    {isAdmin &&
                        <Nav.Item>
                            <NavLink className="nav-link" to={`${path}/metadata/manager/providers`}>
                                <Translate value="label.metadata-providers">Metadata Providers</Translate>
                            </NavLink>
                        </Nav.Item>
                    }
                    <Nav.Item>
                        <NavLink className="nav-link" to={`${path}/dynamic-registration`}>
                            <Translate value="label.dynamic-registration">Dynamic Registration</Translate>
                        </NavLink>
                    </Nav.Item>
                    {isAdmin &&
                    <>
                        <Nav.Item>
                            <NavLink className="nav-link" to={`${path}/admin/management`}>
                                <Translate value="label.admin">Admin</Translate>
                            </NavLink>
                        </Nav.Item>
                    </>
                    }
                    {isApprover && 
                    <Nav.Item>
                        <NavLink className="nav-link d-flex align-items-center" to={`${path}/admin/actions`}>
                            <Translate value="label.action-required">Action Required</Translate>
                            <Badge pill bg="danger" className="ms-1">{actions}</Badge>
                        </NavLink>
                    </Nav.Item>
                    }
                </Nav>
                <Switch>
                    <Route exact path={`${path}`}>
                        <Redirect to={`${url}/metadata/manager/resolvers`} />
                    </Route>
                    <Route path={`${path}/metadata/manager/resolvers`} component={SourcesTab} />
                    <Route path={`${path}/metadata/manager/providers`} component={ProvidersTab} />
                    <Route path={`${path}/dynamic-registration`} render={() =>
                        <DynamicRegistrationsTab />
                    } />
                    <Route path={`${path}/admin/actions`} render={() =>
                        <ActionsTab
                            sources={disabledSources.data}
                            users={users}
                            approvals={unApprovedSources} />
                    } />
                    <Route path={`${path}/admin/management`} render={() =>
                        <ProtectRoute redirectTo="/dashboard">
                            <AdminTab />
                        </ProtectRoute>
                    } />
                    <Route exact path={`${path}/*`}>
                        <Redirect to={`${url}/metadata/manager/resolvers`} />
                    </Route>
                </Switch>
            </React.Fragment>
            }
        </div>
    );
}
export default Dashboard;