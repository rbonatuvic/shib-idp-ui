import { createSelector, createFeatureSelector } from '@ngrx/store';

import * as fromRoot from '../../../app.reducer';
import * as fromConfiguration from './configuration.reducer';
import * as fromHistory from './history.reducer';
import * as fromCompare from './compare.reducer';
import * as fromVersion from './version.reducer';
import * as fromRestore from './restore.reducer';
import { WizardStep } from '../../../wizard/model';

import * as utils from '../../domain/utility/configuration';
import { getSplitSchema } from '../../../wizard/reducer';
import { getInCollectionFn } from '../../domain/domain.util';
import { MetadataConfiguration } from '../model/metadata-configuration';
import { Metadata } from '../../domain/domain.type';

import * as fromResolver from '../../resolver/reducer';
import * as fromProvider from '../../provider/reducer';

export interface ConfigurationState {
    configuration: fromConfiguration.State;
    history: fromHistory.HistoryState;
    compare: fromCompare.State;
    version: fromVersion.State;
    restore: fromRestore.RestoreState;
}

export const reducers = {
    configuration: fromConfiguration.reducer,
    history: fromHistory.reducer,
    compare: fromCompare.reducer,
    version: fromVersion.reducer,
    restore: fromRestore.reducer
};

export interface State extends fromRoot.State {
    'metadata-configuration': ConfigurationState;
}

export const getState = createFeatureSelector<ConfigurationState>('metadata-configuration');

export const getConfigurationStateFn = (state: ConfigurationState) => state.configuration;
export const getHistoryStateFn = (state: ConfigurationState) => state.history;
export const getCompareStateFn = (state: ConfigurationState) => state.compare;
export const getVersionStateFn = (state: ConfigurationState) => state.version;
export const getRestoreStateFn = (state: ConfigurationState) => state.restore;

export const getConfigurationState = createSelector(getState, getConfigurationStateFn);
export const getConfigurationModelKind = createSelector(getConfigurationState, fromConfiguration.getModelKind);
export const getConfigurationModelId = createSelector(getConfigurationState, fromConfiguration.getModelId);

export const getConfigurationDefinition = createSelector(getConfigurationState, fromConfiguration.getDefinition);
export const getConfigurationSchema = createSelector(getConfigurationState, fromConfiguration.getSchema);
export const getConfigurationXml = createSelector(getConfigurationState, fromConfiguration.getXml);

export const assignValueToProperties = (models, properties, definition: any): any[] => {
    return properties.map(prop => {
        switch (prop.type) {
            case 'object':
                return {
                    ...prop,
                    properties: assignValueToProperties(
                        models.map(model => definition.formatter(model)[prop.id] || {}),
                        prop.properties,
                        definition
                    )
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
    return !definition || !schema || !models ? null :
        ({
            dates: models.map(m => m ? m.modifiedDate : null),
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
                        properties: assignValueToProperties(models, section.properties, definition)
                    };
                })
        });
    };



export const getConfigurationModelEnabledFn =
    (config: Metadata) => config ? ('serviceEnabled' in config) ? config.serviceEnabled : config.enabled : false;

export const getConfigurationModelNameFn =
    (config: Metadata) => config ? ('serviceProviderName' in config) ? config.serviceProviderName : config.name : false;

export const getConfigurationModelTypeFn =
    (config: Metadata) => config ? ('@type' in config) ? config['@type'] : 'resolver' : null;

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
export const getComparisonModels = createSelector(getCompareState, fromCompare.getVersionModels);
export const getComparisonModelsLoaded = createSelector(getCompareState, fromCompare.getVersionModelsLoaded);
export const getComparisonConfigurations = createSelector(
    getComparisonModels,
    getConfigurationDefinition,
    getConfigurationSchema,
    getConfigurationSectionsFn
);

export const getComparisonConfigurationCount = createSelector(getComparisonConfigurations, (config) => config ? config.dates.length : 0);

// Version Restoration

export const getRestoreState = createSelector(getState, getRestoreStateFn);

export const filterPluginTypes = ['RequiredValidUntil', 'SignatureValidation', 'EntityRoleWhiteList'];
export const isAdditionalFilter = (type) => filterPluginTypes.indexOf(type) === -1;

export const getVersionModelFiltersFn =
    (model, kind) => kind === 'provider' ?
    model.metadataFilters.filter(filter => isAdditionalFilter(filter['@type'])) :
    null;

export const getVersionState = createSelector(getState, getVersionStateFn);
export const getVersionModel = createSelector(getVersionState, fromVersion.getVersionModel);
export const getVersionModels = createSelector(getVersionModel, (model) => model ? [model] : null);
export const getVersionConfigurationSections = createSelector(
    getVersionModels,
    getConfigurationDefinition,
    getConfigurationSchema,
    getConfigurationSectionsFn
);

export const getVersionModelFilters = createSelector(
    getVersionModel,
    getConfigurationModelKind,
    getVersionModelFiltersFn
);

export const getRestorationIsValid = createSelector(getRestoreState, fromRestore.isRestorationValid);
export const getRestorationIsSaved = createSelector(getRestoreState, fromRestore.isRestorationSaved);
export const getRestorationChanges = createSelector(getRestoreState, fromRestore.getChanges);
export const getRestorationIsSaving = createSelector(getRestoreState, fromRestore.isRestorationSaving);
export const getRestorationFormStatus = createSelector(getRestoreState, fromRestore.getFormStatus);
export const getInvalidRestorationForms = createSelector(getRestoreState, fromRestore.getInvalidRestorationForms);

export const getFormattedModel = createSelector(
    getVersionModel,
    getConfigurationDefinition,
    (model, definition) => definition.formatter(model)
);

// Mixed states

export const getConfigurationModelFn = (kind, version, provider, resolver) => {
    return (kind === 'provider') ? provider : resolver;
};

export const getConfigurationModel = createSelector(
    getConfigurationModelKind,
    getSelectedVersionId,
    fromProvider.getSelectedProvider,
    fromResolver.getSelectedResolver,
    getConfigurationModelFn
);
export const getConfigurationModelList = createSelector(getConfigurationModel, (model) => [model]);

export const getConfigurationSections = createSelector(
    getConfigurationModelList,
    getConfigurationDefinition,
    getConfigurationSchema,
    getConfigurationSectionsFn
);

export const getConfigurationModelEnabled = createSelector(getConfigurationModel, getConfigurationModelEnabledFn);
export const getConfigurationModelName = createSelector(getConfigurationModel, getConfigurationModelNameFn);
export const getConfigurationModelType = createSelector(getConfigurationModel, getConfigurationModelTypeFn);

export const getConfigurationHasXml = createSelector(getConfigurationXml, xml => !!xml);
export const getConfigurationFilters = createSelector(getConfigurationModel, model => model.metadataFilters);
export const getConfigurationVersionDate = createSelector(getConfigurationModel, version => version.modifiedDate);
