import { createSelector, createFeatureSelector } from '@ngrx/store';

import * as fromRoot from '../../../app.reducer';
import * as fromConfiguration from './configuration.reducer';
import * as fromHistory from './history.reducer';
import * as fromCompare from './compare.reducer';
import { WizardStep } from '../../../wizard/model';

import * as utils from '../../domain/utility/configuration';
import { getSplitSchema } from '../../../wizard/reducer';
import { getInCollectionFn } from '../../domain/domain.util';
import { MetadataConfiguration } from '../model/metadata-configuration';
import { Property } from '../../domain/model/property';
import { Metadata } from '../../domain/domain.type';

export interface ConfigurationState {
    configuration: fromConfiguration.State;
    history: fromHistory.HistoryState;
    compare: fromCompare.State;
}

export const reducers = {
    configuration: fromConfiguration.reducer,
    history: fromHistory.reducer,
    compare: fromCompare.reducer
};

export interface State extends fromRoot.State {
    'metadata-configuration': ConfigurationState;
}

export const getState = createFeatureSelector<ConfigurationState>('metadata-configuration');

export const getConfigurationStateFn = (state: ConfigurationState) => state.configuration;
export const getHistoryStateFn = (state: ConfigurationState) => state.history;
export const getCompareStateFn = (state: ConfigurationState) => state.compare;

export const getConfigurationState = createSelector(getState, getConfigurationStateFn);
export const getConfigurationModel = createSelector(getConfigurationState, fromConfiguration.getModel);
export const getConfigurationModelList = createSelector(getConfigurationModel, (model) => [model]);
export const getConfigurationDefinition = createSelector(getConfigurationState, fromConfiguration.getDefinition);
export const getConfigurationSchema = createSelector(getConfigurationState, fromConfiguration.getSchema);
export const getConfigurationXml = createSelector(getConfigurationState, fromConfiguration.getXml);

export const assignValueToProperties = (models, properties): any[] => {
    return properties.map(prop => {
        switch (prop.type) {
            case 'object':
                return {
                    ...prop,
                    properties: assignValueToProperties(models.map(model => model[prop.id] || {}), prop.properties)
                };
            default:
                return {
                    ...prop,
                    value: models.map(model => {
                        return model[prop.id];
                    })
                };
        }
    });
};

export const getConfigurationSectionsFn = (models, definition, schema): MetadataConfiguration => {
    return !definition || !schema ? null :
        ({
            dates: models.map(m => m.modifiedDate),
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
                                definition.formatter({}),
                                schema.definitions || {}
                            )
                        });
                    }
                )
                .map((section: any) => {
                    return {
                        ...section,
                        properties: assignValueToProperties(models, section.properties)
                    };
                })
        });
    };

export const getConfigurationSections = createSelector(
    getConfigurationModelList,
    getConfigurationDefinition,
    getConfigurationSchema,
    getConfigurationSectionsFn
);

export const getConfigurationModelEnabledFn =
    (config: Metadata) => config ? ('serviceEnabled' in config) ? config.serviceEnabled : config.enabled : false;

export const getConfigurationModelNameFn =
    (config: Metadata) => config ? ('serviceProviderName' in config) ? config.serviceProviderName : config.name : false;

export const getConfigurationModelEnabled = createSelector(getConfigurationModel, getConfigurationModelEnabledFn);
export const getConfigurationModelName = createSelector(getConfigurationModel, getConfigurationModelNameFn);

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

// Version Comparison

export const getCompareState = createSelector(getState, getCompareStateFn);
export const getVersionModels = createSelector(getCompareState, fromCompare.getVersionModels);
export const getVersionModelsLoaded = createSelector(getCompareState, fromCompare.getVersionModelsLoaded);
export const getVersionConfigurations = createSelector(
    getVersionModels,
    getConfigurationDefinition,
    getConfigurationSchema,
    getConfigurationSectionsFn
);


