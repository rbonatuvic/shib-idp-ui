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
                        {(configurations, onDelete) =>
                            <ConfigurationList configurations={configurations} onDelete={onDelete} />
                        }
                    </ConfigurationsProvider>
                } />
                <Route path={`${path}/new`} render={() =>
                    <ConfigurationsProvider>
                        {(configurations) =>
                            <NewConfiguration configurations={configurations} />
                        }
                    </ConfigurationsProvider>
                    
                } />
                <Route path={`${path}/:id/edit`} render={() =>
                    <ConfigurationsProvider>
                        {(configurations) =>
                            <EditConfiguration configurations={configurations} />
                        }
                    </ConfigurationsProvider>
                } />
                <Route path={`${path}`} exact render={() => 
                    <Redirect to={`${url}/list`} />
                } />
            </Switch>
        </>
    );
}