import { createSelector, createFeatureSelector } from '@ngrx/store';
import merge from 'deepmerge';

import * as fromRoot from '../../../app.reducer';
import * as fromConfiguration from './configuration.reducer';
import { WizardStep } from '../../../wizard/model';

import * as utils from '../../domain/utility/configuration';
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
export const getConfigurationXml = createSelector(getConfigurationState, fromConfiguration.getXml);

export const getConfigurationSectionsFn = (model, definition, schema) => !definition || !schema ? null :
    ({
        sections: definition.steps
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
            )
    });
export const getConfigurationSections = createSelector(
    getConfigurationModel,
    getConfigurationDefinition,
    getConfigurationSchema,
    getConfigurationSectionsFn
);
