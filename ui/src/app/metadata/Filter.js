import React from 'react';
import { Switch, Route, useRouteMatch, Redirect } from 'react-router-dom';
import { MetadataFilterList } from './editor/MetadataFilterList';
import MetadataFilterSelector from './hoc/MetadataFilterSelector';
import MetadataSchema from './hoc/MetadataSchema';
import MetadataSelector from './hoc/MetadataSelector';
import { NewFilter } from './new/NewFilter';
import { EditFilter } from './view/EditFilter';

export function Filter() {

    const { path, url } = useRouteMatch();

    return (
        <Switch>
            <Route path={`${path}/list`} render={() =>
                <MetadataSelector type="provider">
                    {(entity) =>
                        <MetadataSchema type={entity['@type']}>
                            <MetadataFilterList />
                        </MetadataSchema>
                    }
                </MetadataSelector>
            } />
            <Route path={`${path}/new/:section`} render={() =>
                <NewFilter />
            } />
            <Route path={`${path}/:filterId/edit/:section`} render={() =>
                <MetadataFilterSelector>
                    <EditFilter />
                </MetadataFilterSelector>
            } />
            <Route exact path={`${path}/new`} render={() =>
                <Redirect to={`${url}/new/common`} />
            } />
        </Switch>
    );
}