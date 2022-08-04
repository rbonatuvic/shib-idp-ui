import React from 'react';
import { Switch, Route, useRouteMatch, Redirect } from 'react-router-dom';
import { PropertiesProvider } from './hoc/PropertiesProvider';
import { NewProperty } from './container/NewProperty';
import { EditProperty } from './container/EditProperty';
import { PropertyList } from './container/PropertyList';

export function Properties() {

    let { path, url } = useRouteMatch();

    return (
        <>
            <Switch>
                <Route path={`${path}/list`} render={() =>
                    <PropertiesProvider>
                        {(properties, onDelete) =>
                            <PropertyList properties={properties} onDelete={onDelete} />
                        }
                    </PropertiesProvider>
                } />
                <Route path={`${path}/new`} render={() =>
                    <NewProperty />
                } />
                <Route path={`${path}/:id/edit`} render={() =>
                    <EditProperty />
                } />
                <Route path={`${path}`} exact render={() => 
                    <Redirect to={`${url}/list`} />
                } />
            </Switch>
        </>
    );
}