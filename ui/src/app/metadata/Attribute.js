import React from 'react';
import { Switch, Route, useRouteMatch, Redirect } from 'react-router-dom';
import { MetadataAttributes } from './hoc/MetadataAttributes';
import { NewAttribute } from './new/NewAttribute';
import { MetadataAttributeEdit } from './view/MetadataAttributeEdit';
import { MetadataAttributeList } from './view/MetadataAttributeList';
import { MetadataAttributeBundles } from './view/MetadataAttributeBundles';
import { NewBundle } from './new/NewBundle';
import { MetadataAttributeBundleEdit } from './view/MetadataAttributeBundleEdit';

export function Attribute() {

    let { path } = useRouteMatch();

    return (
        <Switch>
            <Route path={`${path}/list`} render={() =>
                <MetadataAttributes>
                    {(entities, onDelete) =>
                        <MetadataAttributeList entities={entities} onDelete={onDelete} />
                    }
                </MetadataAttributes>
            } />
            <Route path={`${path}/new`} render={() =>
                <NewAttribute />
            } />
            <Route path={`${path}/:id/edit`} render={() =>
                <MetadataAttributeEdit />
            } />
            <Route exact path={`${path}/bundles`} render={() =>
                <MetadataAttributeBundles />
            } />
            <Route exact path={`${path}/bundles/new`} render={() =>
                <NewBundle />
            } />
            <Route exact path={`${path}/bundles/:id/edit`} render={() =>
                <MetadataAttributeBundleEdit />
            } />
            <Redirect exact path={`${path}`} to={`${path}/list`} />
        </Switch>
    );
}