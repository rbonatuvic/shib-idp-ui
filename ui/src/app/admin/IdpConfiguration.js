import React from 'react';
import { Switch, Route, useRouteMatch, Redirect } from 'react-router-dom';
import { ConfigurationsProvider } from './hoc/ConfigurationsProvider';
import { NewConfiguration } from './container/NewConfiguration';
import { EditConfiguration } from './container/EditConfiguration';
import { ConfigurationList } from './container/ConfigurationList';

export function IdpConfiguration() {

    let { path, url } = useRouteMatch();

    return (
        <>
            <Switch>
                <Route path={`${path}/list`} render={() =>
                    <ConfigurationsProvider>
                        {(properties, onDelete) =>
                            <ConfigurationList properties={properties} onDelete={onDelete} />
                        }
                    </ConfigurationsProvider>
                } />
                <Route path={`${path}/new`} render={() =>
                    <NewConfiguration />
                } />
                <Route path={`${path}/:id/edit`} render={() =>
                    <EditConfiguration />
                } />
                <Route path={`${path}`} exact render={() => 
                    <Redirect to={`${url}/list`} />
                } />
            </Switch>
        </>
    );
}