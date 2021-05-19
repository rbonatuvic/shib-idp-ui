import React from 'react';
import { Switch, Route, useRouteMatch, Redirect } from 'react-router-dom';
import { MetadataFilterList } from './editor/MetadataFilterList';
import MetadataSchema from './hoc/MetadataSchema';
import MetadataSelector from './hoc/MetadataSelector';
import { NewFilter } from './new/NewFilter';
import { EditFilter } from './view/EditFilter';

export function Filter() {

    const { path } = useRouteMatch();

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
                <EditFilter />
            } />
            <Redirect exact path={`${path}/new`} to={`${path}/new/common`} />
        </Switch>
    );
}