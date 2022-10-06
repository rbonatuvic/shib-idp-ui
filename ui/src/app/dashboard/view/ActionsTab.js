import React from 'react';
import { useParams } from 'react-router';
import { MetadataActions } from '../../admin/container/MetadataActions';
import UserActions from '../../admin/container/UserActions';
import Spinner from '../../core/components/Spinner';

import Translate from '../../i18n/components/translate';
import SourceList from '../../metadata/domain/source/component/SourceList';

import Nav from 'react-bootstrap/Nav';
import { Switch, Route, useRouteMatch, Redirect } from 'react-router-dom';
import { NavLink } from 'react-router-dom';
import Badge from 'react-bootstrap/Badge';

export function ActionsTab({ sources, users, reloadSources, reloadUsers, loadingSources, loadingUsers }) {

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
                            <Nav.Item>
                                <NavLink className="nav-link" to={`${path}/enable`}>
                                    <Translate value="label.enable-metadata-sources">Enable Metadata Sources</Translate>
                                    { sources.length ? <Badge pill bg="danger" className="ms-1">{sources.length}</Badge> : '' }
                                </NavLink>
                            </Nav.Item>
                            <Nav.Item>
                                <NavLink className="nav-link" to={`${path}/useraccess`}>
                                    <Translate value="label.user-access-request">User Access Request</Translate>
                                    { users.length ? <Badge pill bg="danger" className="ms-1">{users.length}</Badge> : '' }
                                </NavLink>
                            </Nav.Item>
                            <Nav.Item>
                                <NavLink className="nav-link" to={`${path}/approve`}>
                                    <Translate value="label.approve-metadata-sources">Approve Metadata Sources</Translate>
                                </NavLink>
                            </Nav.Item>
                        </Nav>
                        <hr />
                    </div>
                    
                    <Switch>
                        <Route exact path={`${path}`}>
                            <Redirect to={`${url}/enable`} />
                        </Route>
                        <Route path={`${path}/enable`}>
                            <MetadataActions type="source">
                                {(enable) =>
                                    <SourceList entities={sources} onDelete={reloadSources} onEnable={(s, e) => enable(s, e, reloadSources)}>
                                        {loadingSources && <div className="d-flex justify-content-center text-primary"><Spinner size="4x" /></div> }
                                    </SourceList>
                                }
                            </MetadataActions>
                        </Route>
                        <Route path={`${path}/useraccess`} render={() =>
                            <UserActions users={users} reloadUsers={reloadUsers}>
                                {loadingUsers && <div className="d-flex justify-content-center text-primary"><Spinner size="4x" /></div> }
                            </UserActions>
                        } />
                    </Switch>
                </div>
            </section>
        </>

    );
}

export default ActionsTab;