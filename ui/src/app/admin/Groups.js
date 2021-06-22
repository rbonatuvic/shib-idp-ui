import React from 'react';
import { Switch, Route, useRouteMatch, Redirect } from 'react-router-dom';
import { GroupsProvider } from './hoc/GroupsProvider';
import { NewGroup } from './container/NewGroup';
import { EditGroup } from './container/EditGroup';
import { GroupsList } from './container/GroupsList';

export function Groups() {

    let { path } = useRouteMatch();

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
                    <NewGroup />
                } />
                <Route path={`${path}/:id/edit`} render={() =>
                    <EditGroup />
                } />
                <Redirect exact path={`${path}`} to={`${path}/list`} />
            </Switch>
        </>
    );
}