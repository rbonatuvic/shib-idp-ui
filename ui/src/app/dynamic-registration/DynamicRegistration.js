import React from 'react';
import { Switch, Route, useRouteMatch } from 'react-router-dom';

import { DynamicRegistrationDetail } from './view/DynamicRegistrationDetail';

import { DynamicRegistrationEdit } from './view/DynamicRegistrationEdit';
import { DynamicRegistrationCreate } from './view/DynamicRegistrationCreate';

export function DynamicRegistration () {

    const { path } = useRouteMatch();

    return (
        <div className='container-fluid p-3'>
            <Switch>
                <Route exact path={`${path}/new`} render={() =>
                    <DynamicRegistrationCreate />
                } />
                <Route exact path={`${path}/:id`} render={() =>
                    <DynamicRegistrationDetail />
                } />
                <Route path={`${path}/:id/edit`} render={() =>
                    <DynamicRegistrationEdit />
                } />
            </Switch>
        </div>
    )
}