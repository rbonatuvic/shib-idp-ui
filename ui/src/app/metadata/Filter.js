import React from 'react';
import { Switch, Route, useRouteMatch, Redirect } from 'react-router-dom';
import { NewFilter } from './new/NewFilter';

export function Filter() {

    const { path } = useRouteMatch();

    return (
        <Switch>
            <Route path={`${path}/new/:section`} render={() =>
                <NewFilter />
            } />
            <Redirect exact path={`${path}/new`} to={`${path}/new/common`} />
        </Switch>
    );
}