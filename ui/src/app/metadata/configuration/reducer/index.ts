import { createSelector, createFeatureSelector } from '@ngrx/store';

import * as fromRoot from '../../../app.reducer';
import * as fromConfiguration from './configuration.reducer';
import * as fromHistory from './history.reducer';
import { WizardStep } from '../../../wizard/model';

import * as utils from '../../domain/utility/configuration';
import { getSplitSchema } from '../../../wizard/reducer';
import { getInCollectionFn } from '../../domain/domain.util';

export interface ConfigurationState {
    configuration: fromConfiguration.State;
    history: fromHistory.HistoryState;
}

export const reducers = {
    configuration: fromConfiguration.reducer,
    history: fromHistory.reducer
};

export interface State extends fromRoot.State {
    'metadata-configuration': ConfigurationState;
}

export const getState = createFeatureSelector<ConfigurationState>('metadata-configuration');

export const getConfigurationStateFn = (state: ConfigurationState) => state.configuration;
export const getHistoryStateFn = (state: ConfigurationState) => state.history;

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

// Version History

export const getHistoryState = createSelector(getState, getHistoryStateFn);

export const getVersionEntities = createSelector(getHistoryState, fromHistory.selectVersionEntities);
export const getSelectedVersionId = createSelector(getHistoryState, fromHistory.getSelectedVersionId);
export const getVersionIds = createSelector(getHistoryState, fromHistory.selectVersionIds);
export const getVersionCollection = createSelector(getHistoryState, getVersionIds, fromHistory.selectAllVersions);
export const getSelectedVersion = createSelector(getVersionEntities, getSelectedVersionId, getInCollectionFn);
export const getSelectedVersionNumber = createSelector(
    getVersionCollection,
    getSelectedVersionId,
    (versions, selectedId) => versions.indexOf(versions.find(v => v.id === selectedId)) + 1
);

export const getSelectedIsCurrent = createSelector(
    getSelectedVersion,
    getVersionCollection,
    (selected, collection) => {
        return selected ? collection[0].id === selected.id : null;
    }
);
