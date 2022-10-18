import React from 'react';
import { MetadataActions } from '../../admin/container/MetadataActions';
import UserActions from '../../admin/container/UserActions';
import Spinner from '../../core/components/Spinner';

import Translate from '../../i18n/components/translate';
import SourceList from '../../metadata/domain/source/component/SourceList';
import { ProtectRoute } from '../../core/components/ProtectRoute';
import Nav from 'react-bootstrap/Nav';
import { Switch, Route, useRouteMatch, Redirect } from 'react-router-dom';
import { NavLink } from 'react-router-dom';
import Badge from 'react-bootstrap/Badge';
import { ApprovalActions } from '../../admin/container/ApprovalActions';

export function ActionsTab({ sources, users, approvals, reloadSources, reloadUsers, reloadApprovals, loadingSources, loadingUsers, loadingApprovals }) {

    const { path, url } = useRouteMatch();

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
                    <div className="p-3 pb-0">
                        <Nav variant="pills"
                            activeKey="/home"
                            onSelect={(selectedKey) => alert(`selected ${selectedKey}`)}
                            >
                            {sources !== null && 
                            <Nav.Item>
                                <NavLink className="nav-link" to={`${path}/enable`} id="enable-btn">
                                    <Translate value="label.enable-metadata-sources">Enable Metadata Sources</Translate>
                                    { sources.length ? <Badge pill bg="danger" className="ms-1">{sources.length}</Badge> : '' }
                                </NavLink>
                            </Nav.Item>
                            }
                            <Nav.Item>
                                <NavLink className="nav-link" to={`${path}/approve`}  id="approve-btn">
                                    <Translate value="label.approve-metadata-sources">Approve Metadata Sources</Translate>
                                </NavLink>
                            </Nav.Item>
                            {users !== null &&
                            <Nav.Item>
                                <NavLink className="nav-link" to={`${path}/useraccess`} id="user-access-btn">
                                    <Translate value="label.user-access-request">User Access Request</Translate>
                                    { users.length ? <Badge pill bg="danger" className="ms-1">{users.length}</Badge> : '' }
                                </NavLink>
                            </Nav.Item>
                            }
                        </Nav>
                        <hr />
                    </div>
                    <div className="px-3 pb-0">
                    <Switch>
                        <Route exact path={`${path}`}>
                            <Redirect to={`${url}/approve`} />
                        </Route>
                        <Route path={`${path}/approve`} render={() =>
                            <ApprovalActions entities={approvals} reloadUsers={reloadApprovals}>
                                {(approve) =>
                                    <SourceList entities={approvals} onDelete={reloadSources} onApprove={(s, e) => approve(s, e, reloadApprovals)}>
                                        {loadingApprovals && <div className="d-flex justify-content-center text-primary"><Spinner size="4x" /></div> }
                                    </SourceList>
                                }
                            </ApprovalActions>
                        } />
                        <Route path={`${path}/enable`}>
                            <ProtectRoute redirectTo="/dashboard">
                                <MetadataActions type="source">
                                    {(enable) =>
                                        <SourceList entities={sources} onDelete={reloadSources} onEnable={(s, e) => enable(s, e, reloadSources)}>
                                            {loadingSources && <div className="d-flex justify-content-center text-primary"><Spinner size="4x" /></div> }
                                        </SourceList>
                                    }
                                </MetadataActions>
                            </ProtectRoute>
                        </Route>
                        <Route path={`${path}/useraccess`} render={() =>
                            <ProtectRoute redirectTo="/dashboard">
                                <UserActions users={users} reloadUsers={reloadUsers}>
                                    {loadingUsers && <div className="d-flex justify-content-center text-primary"><Spinner size="4x" /></div> }
                                </UserActions>
                            </ProtectRoute>
                        } />
                    </Switch>
                    </div>
                </div>
            </section>
        </>

    );
}

export default ActionsTab;