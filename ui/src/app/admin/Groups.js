import React from 'react';
import { Switch, Route, useRouteMatch, Redirect } from 'react-router-dom';
import { GroupsProvider } from './hoc/GroupsProvider';
import { NewGroup } from './container/NewGroup';
import { EditGroup } from './container/EditGroup';
import { GroupsList } from './container/GroupsList';

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
                        {(groups) =>
                            <NewGroup groups={groups} />
                        }
                    </GroupsProvider>
                } />
                <Route path={`${path}/:id/edit`} render={() =>
                    <GroupsProvider>
                        {(groups) =>
                            <EditGroup groups={groups} />
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