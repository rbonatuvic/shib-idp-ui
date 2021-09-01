import React from 'react';
import { Switch, Route, useRouteMatch, Redirect } from 'react-router-dom';
import { RolesProvider } from './hoc/RolesProvider';
import { NewRole } from './container/NewRole';
import { EditRole } from './container/EditRole';
import { RoleList } from './container/RoleList';

export function Roles() {

    let { path } = useRouteMatch();

    return (
        <>
            <Switch>
                <Route path={`${path}/list`} render={() =>
                    <RolesProvider>
                        {(roles, onDelete) =>
                            <RoleList roles={roles} onDelete={onDelete} />
                        }
                    </RolesProvider>
                } />
                <Route path={`${path}/new`} render={() =>
                    <NewRole />
                } />
                <Route path={`${path}/:id/edit`} render={() =>
                    <EditRole />
                } />
                <Redirect exact path={`${path}`} to={`${path}/list`} />
            </Switch>
        </>
    );
}