import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Badge from 'react-bootstrap/Badge';
import Nav from 'react-bootstrap/Nav';
import { Switch, Route, useRouteMatch, Redirect, NavLink } from 'react-router-dom';

import { MetadataActions } from '../../admin/container/MetadataActions';
import UserActions from '../../admin/container/UserActions';
import Spinner from '../../core/components/Spinner';

import Translate from '../../i18n/components/translate';
import SourceList from '../../metadata/domain/source/component/SourceList';
import { ProtectRoute } from '../../core/components/ProtectRoute';


import { DynamicRegistrationList } from '../../dynamic-registration/component/DynamicRegistrationList';
import { useGetNewUsersQuery } from '../../store/user/UserSlice';
import { useGetDisabledSourcesQuery, useGetUnapprovedSourcesQuery } from '../../store/metadata/SourceSlice';
import { DynamicRegistrationActions } from '../../dynamic-registration/hoc/DynamicRegistrationActions';
import {
    useGetDisabledRegistrationsQuery,
    useGetUnapprovedRegistrationsQuery
} from '../../store/dynamic-registration/DynamicRegistrationSlice';

export function ActionsTab({ registrations }) {

    const { path, url } = useRouteMatch();

    const {data: users = [], isLoading: loadingUsers} = useGetNewUsersQuery();
    const {data: disabledSources = [], isLoading: loadingSources} = useGetDisabledSourcesQuery();
    const {data: unApprovedSources = [], isLoading: loadingApprovals} = useGetUnapprovedSourcesQuery();
    const {data: unApprovedRegistrations = []} = useGetUnapprovedRegistrationsQuery();
    const {data: disabledRegistrations = []} = useGetDisabledRegistrationsQuery();

    return (
        <>
            <section className="section">
                <div className="section-body border border-top-0 border-primary">
                    <div className="section-header bg-primary p-2 text-light">
                        <div className="row justify-content-between">
                            <div className="col-12">
                                <span className="lead">Actions Required<Translate value=""></Translate></span>
                            </div>
                        </div>
                    </div>
                    <Container fluid className="p-3">
                        <Row>
                            <Col xxl={3} xl={4}>
                                <Nav variant="pills"
                                    activeKey="/home"
                                    className="flex-column"
                                    >
                                    {disabledSources !== null && 
                                    <Nav.Item>
                                        <NavLink className="nav-link" to={`${path}/enable-sources`} id="enable-btn">
                                            <Translate value="label.enable-metadata-sources">Enable Metadata Sources</Translate>
                                            { disabledSources.length ? <Badge pill bg="danger" className="ms-1">{disabledSources.length}</Badge> : '' }
                                        </NavLink>
                                    </Nav.Item>
                                    }
                                    <Nav.Item>
                                        <NavLink className="nav-link" to={`${path}/approve-sources`}  id="approve-btn">
                                            <Translate value="label.approve-metadata-sources">Approve Metadata Sources</Translate>
                                            { unApprovedSources.length ? <Badge pill bg="danger" className="ms-1">{unApprovedSources.length}</Badge> : '' }
                                        </NavLink>
                                    </Nav.Item>
                                    {disabledRegistrations && 
                                    <Nav.Item>
                                        <NavLink className="nav-link" to={`${path}/enable-registrations`} id="enable-dr-btn">
                                            <Translate value="label.enable-dynamic-registrations">Enable Dynamic Registrations</Translate>
                                            { disabledRegistrations.length ? <Badge pill bg="danger" className="ms-1">{disabledRegistrations.length}</Badge> : '' }
                                        </NavLink>
                                    </Nav.Item>
                                    }
                                    <Nav.Item>
                                        <NavLink className="nav-link" to={`${path}/approve-registrations`}  id="approve-dr-btn">
                                            <Translate value="label.approve-dynamic-registrations">Approve Dynamic Registrations</Translate>
                                            { unApprovedRegistrations.length ? <Badge pill bg="danger" className="ms-1">{unApprovedRegistrations.length}</Badge> : '' }
                                        </NavLink>
                                    </Nav.Item>
                                    {users !== null &&
                                    <Nav.Item>
                                        <NavLink className="nav-link" to={`${path}/useraccess`} id="user-access-btn">
                                            <Translate value="label.user-access-request">User Access Request</Translate>
                                            { users?.length ? <Badge pill bg="danger" className="ms-1">{users.length}</Badge> : '' }
                                        </NavLink>
                                    </Nav.Item>
                                    }
                                </Nav>
                            </Col>
                            <Col className="border-start">
                                <Switch>
                                    <Route exact path={`${path}`}>
                                        <Redirect to={`${url}/approve-sources`} />
                                    </Route>
                                    <Route path={`${path}/approve-sources`} render={() =>
                                        <MetadataActions entities={unApprovedSources} type="source">
                                            {({approve, remove}) =>
                                                <SourceList entities={unApprovedSources}
                                                    onDelete={(id) => remove(id)}
                                                    onApprove={(s, e) => approve(s, e)}>
                                                    {loadingApprovals && <div className="d-flex justify-content-center text-primary"><Spinner size="4x" /></div> }
                                                </SourceList>
                                            }
                                        </MetadataActions>
                                    } />
                                    <Route path={`${path}/approve-registrations`} render={() =>
                                        <ProtectRoute redirectTo="/dashboard">
                                            <DynamicRegistrationActions>
                                                {({approve}) =>
                                                    <DynamicRegistrationList
                                                        entities={unApprovedRegistrations}
                                                        onApprove={(id, approved) => approve({id, approved})}>
                                                        {loadingSources && <div className="d-flex justify-content-center text-primary"><Spinner size="4x" /></div> }
                                                    </DynamicRegistrationList>
                                                }
                                            </DynamicRegistrationActions>
                                        </ProtectRoute>
                                    } />
                                    <Route path={`${path}/enable-sources`}>
                                        <ProtectRoute redirectTo="/dashboard">
                                            <MetadataActions type="source">
                                                {({enable, remove}) =>
                                                    <SourceList entities={disabledSources}
                                                        onDelete={(id) => remove(id)}
                                                        onEnable={(s, e) => enable(s, e)}>
                                                        {loadingSources && <div className="d-flex justify-content-center text-primary"><Spinner size="4x" /></div> }
                                                    </SourceList>
                                                }
                                            </MetadataActions>
                                        </ProtectRoute>
                                    </Route>
                                    <Route path={`${path}/enable-registrations`}>
                                        <ProtectRoute redirectTo="/dashboard">
                                            <DynamicRegistrationActions>
                                                {({enable}) =>
                                                    <DynamicRegistrationList
                                                        entities={disabledRegistrations}
                                                        onEnable={(id, enabled) => {
                                                            console.log(id, enabled)
                                                            enable({ id, enabled });
                                                        }}>
                                                        {loadingSources && <div className="d-flex justify-content-center text-primary"><Spinner size="4x" /></div> }
                                                    </DynamicRegistrationList>
                                                }
                                            </DynamicRegistrationActions>
                                        </ProtectRoute>
                                    </Route>
                                    <Route path={`${path}/useraccess`} render={() =>
                                        <ProtectRoute redirectTo="/dashboard">
                                            <UserActions users={users}>
                                                {loadingUsers && <div className="d-flex justify-content-center text-primary"><Spinner size="4x" /></div> }
                                            </UserActions>
                                        </ProtectRoute>
                                    } />
                                </Switch>
                            </Col>
                        </Row>
                    </Container>
                </div>
            </section>
        </>

    );
}

export default ActionsTab;