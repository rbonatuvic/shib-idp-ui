import { createSelector, createFeatureSelector } from '@ngrx/store';
import merge from 'deepmerge';

import * as fromRoot from '../../../app.reducer';
import * as fromConfiguration from './configuration.reducer';
import { WizardStep } from '../../../wizard/model';

import * as utils from '../service/utility';
import { getSplitSchema } from '../../../wizard/reducer';

export interface ConfigurationState {
    configuration: fromConfiguration.State;
}

export const reducers = {
    configuration: fromConfiguration.reducer
};

export interface State extends fromRoot.State {
    'metadata-configuration': ConfigurationState;
}

export const getState = createFeatureSelector<ConfigurationState>('metadata-configuration');

export const getConfigurationStateFn = (state: ConfigurationState) => state.configuration;

export const getConfigurationState = createSelector(getState, getConfigurationStateFn);
export const getConfigurationModel = createSelector(getConfigurationState, fromConfiguration.getModel);
export const getConfigurationDefinition = createSelector(getConfigurationState, fromConfiguration.getDefinition);
export const getConfigurationSchema = createSelector(getConfigurationState, fromConfiguration.getSchema);

export const mergedSchema = createSelector(getConfigurationSchema, schema => !schema ? null : Object.keys(schema).reduce((coll, key) => ({
    ...merge(coll, schema[key])
}), {} as any));

export const getConfigurationSectionsFn = (model, definition, schema) => !definition || !schema ? null :
    definition.steps
        .filter(step => step.id !== 'summary')
        .map(
            (step: WizardStep, num: number) => {
                return ({
                    id: step.id,
                    pageNumber: num + 1,
                    index: step.index,
                    label: step.label,
                    properties: utils.getStepProperties(
                        getSplitSchema(schema, step),
                        definition.formatter(model),
                        schema.definitions || {}
                    )
                });
            }
        );

export const getConfigurationColumnsFn = sections => !sections ? null :
    sections.reduce((resultArray, item, index) => {
        const chunkIndex = Math.floor(index / Math.round(this.sections.length / 2));

        if (!resultArray[chunkIndex]) {
            resultArray[chunkIndex] = [];
        }

        resultArray[chunkIndex].push(item);

        return resultArray;
    }, []);

export const getConfigurationSections = createSelector(
    getConfigurationModel,
    getConfigurationDefinition,
    mergedSchema,
    getConfigurationSectionsFn
);

export const getConfigurationColumns = createSelector(getConfigurationSections, getConfigurationColumnsFn);
