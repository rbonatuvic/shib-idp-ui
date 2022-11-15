import React, { Fragment } from 'react';
import { Switch, Route, useRouteMatch, Redirect } from 'react-router-dom';
import { GroupsProvider } from './hoc/GroupsProvider';
import { NewGroup } from './container/NewGroup';
import { EditGroup } from './container/EditGroup';
import { GroupsList } from './container/GroupsList';
import Spinner from '../core/components/Spinner';

export function Groups() {

    let { path, url } = useRouteMatch();

    return (
        <>
            <Switch>
                <Route path={`${path}/list`} render={() =>
                    <GroupsProvider>
                        {(groups, onDelete) =>
                            <GroupsList groups={groups} onDelete={onDelete} />
                        }
                    </GroupsProvider>
                } />
                <Route path={`${path}/new`} render={() =>
                    <GroupsProvider>
                        {(groups, onDelete, loading) =>
                            <Fragment>{ loading ? <div className="d-flex justify-content-center text-primary"><Spinner size="4x" /></div> : <NewGroup groups={groups} /> }</Fragment>
                        }
                    </GroupsProvider>
                } />
                <Route path={`${path}/:id/edit`} render={() =>
                    <GroupsProvider>
                        {(groups, onDelete, loading) =>
                            <Fragment>{ loading ? <div className="d-flex justify-content-center text-primary"><Spinner size="4x" /></div> : <EditGroup groups={groups} /> }</Fragment>
                        }
                    </GroupsProvider>
                } />
                <Route path={`${path}`} exact render={() =>
                    <Redirect to={`${url}/list`} />
                } />
            </Switch>
        </>
    );
}