import { createSelector, createFeatureSelector } from '@ngrx/store';

import * as fromRoot from '../../../app.reducer';
import * as fromConfiguration from './configuration.reducer';
import * as fromHistory from './history.reducer';
import * as fromCompare from './compare.reducer';
import * as fromVersion from './version.reducer';
import * as fromRestore from './restore.reducer';
import { WizardStep } from '../../../wizard/model';

import * as utils from '../../domain/utility/configuration';
import { getSplitSchema, getModel } from '../../../wizard/reducer';
import { getInCollectionFn } from '../../domain/domain.util';
import { MetadataConfiguration } from '../model/metadata-configuration';
import { Metadata } from '../../domain/domain.type';

import * as fromResolver from '../../resolver/reducer';
import * as fromProvider from '../../provider/reducer';
import { SectionProperty } from '../model/section';

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
        const differences = models.some((model, index, array) => {
            if (!array) {
                return false;
            }
            return JSON.stringify(model[prop.id]) !== JSON.stringify(array[0][prop.id]);
        });

        const widget = prop.type === 'array' && prop.widget && prop.widget.data ? ({
            ...prop.widget,
            data: prop.widget.data.map(item => ({
                ...item,
                differences: models
                    .map((model) => {
                        const value = model[prop.id];
                        return value ? value.indexOf(item.key) > -1 : false;
                    })
                    .reduce((current, val) => current !== val ? true : false, false)
            }))
        }) : null;

        switch (prop.type) {
            case 'object':
                return {
                    ...prop,
                    differences,
                    properties: assignValueToProperties(
                        models.map(model => definition.formatter(model)[prop.id] || {}),
                        prop.properties,
                        definition
                    )
                };
            default:
                return {
                    ...prop,
                    differences,
                    value: models.map(model => {
                        return model[prop.id];
                    }),
                    widget
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
                .map((section: any) => ({
                    ...section,
                    differences: section.properties.some(prop => prop.differences)
                }))
        });
    };



export const getConfigurationModelEnabledFn =
    (config: Metadata) => config ? ('serviceEnabled' in config) ? config.serviceEnabled : config.enabled : false;

export const getConfigurationModelNameFn =
    (config: Metadata) => config ? ('serviceProviderName' in config) ? config.serviceProviderName : config.name : false;

export const getConfigurationModelTypeFn =
    (config: Metadata) => config ? ('@type' in config) ? config['@type'] : 'resolver' : null;

export const filterPluginTypes = ['RequiredValidUntil', 'SignatureValidation', 'EntityRoleWhiteList'];
export const isAdditionalFilter = (type) => filterPluginTypes.indexOf(type) === -1;

export const getVersionModelFiltersFn =
    (model, kind) => kind === 'provider' ?
        model.metadataFilters.filter(filter => isAdditionalFilter(filter['@type'])) :
        null;

// Version History

export const getHistoryState = createSelector(getState, getHistoryStateFn);

export const getHistoryLoading = createSelector(getHistoryState, fromHistory.getHistoryLoading);
export const getVersionEntities = createSelector(getHistoryState, fromHistory.selectVersionEntities);
export const getSelectedVersionId = createSelector(getHistoryState, fromHistory.getSelectedVersionId);
export const getVersionIds = createSelector(getHistoryState, fromHistory.selectVersionIds);
export const getVersionCollection = createSelector(getHistoryState, getVersionIds, fromHistory.selectAllVersions);
export const getSelectedVersion = createSelector(getVersionEntities, getSelectedVersionId, getInCollectionFn);
export const getSelectedVersionNumberFn = (versions, selectedId) => versions.indexOf(versions.find(v => v.id === selectedId)) + 1;
export const getSelectedVersionNumber = createSelector(
    getVersionCollection,
    getSelectedVersionId,
    getSelectedVersionNumberFn
);

export const getSelectedIsCurrentFn = (selected, collection) => {
    return selected ? collection[0].id === selected.id : false;
};

export const getSelectedIsCurrent = createSelector(
    getSelectedVersion,
    getVersionCollection,
    getSelectedIsCurrentFn
);

// Version Comparison

export const getCompareState = createSelector(getState, getCompareStateFn);
export const getComparisonLoading = createSelector(getCompareState, fromCompare.getComparisonLoading);
export const getComparisonModels = createSelector(getCompareState, fromCompare.getVersionModels);
export const getComparisonModelsLoaded = createSelector(getCompareState, fromCompare.getVersionModelsLoaded);

export const getComparisonModelsFilteredFn = (models) => models.map((model) => ({
    ...model,
    metadataFilters: getVersionModelFiltersFn(model, model.type)
}));

export const getComparisonModelsFiltered = createSelector(getComparisonModels, getComparisonModelsFilteredFn);

export const getComparisonConfigurations = createSelector(
    getComparisonModelsFiltered,
    getConfigurationDefinition,
    getConfigurationSchema,
    getConfigurationSectionsFn
);

export const getComparisonConfigurationCount = createSelector(getComparisonConfigurations, (config) => config ? config.dates.length : 0);

export const getViewChangedOnly = createSelector(getCompareState, fromCompare.getViewChangedOnly);

export const getLimitedPropertiesFn = (properties: SectionProperty[]) => {
    return ([
        ...properties
            .filter(p => p.differences)
            .map(p => {
                const parsed = { ...p };
                if (p.widget && p.widget.data) {
                    parsed.widget = {
                        ...p.widget,
                        data: p.widget.data.filter(item => item.differences)
                    };
                }
                if (p.properties) {
                    parsed.properties = getLimitedPropertiesFn(p.properties);
                }
                return parsed;
            })
    ]);
};

export const getLimitedConfigurationsFn = (configurations, limited) => configurations ? ({
    ...configurations,
    sections: limited ? configurations.sections :
        configurations.sections.map(s => ({
            ...s,
            properties: getLimitedPropertiesFn(s.properties),
        }))
}) : configurations;

export const getLimitedComparisonConfigurations = createSelector(
    getComparisonConfigurations,
    getViewChangedOnly,
    getLimitedConfigurationsFn
);

// Version Restoration

export const getRestoreState = createSelector(getState, getRestoreStateFn);



export const getVersionState = createSelector(getState, getVersionStateFn);

export const getVersionLoading = createSelector(getVersionState, fromVersion.isVersionLoading);

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
    (model, definition) => definition ? definition.formatter(model) : null
);

export const getFormattedChanges = createSelector(
    getRestorationChanges,
    getConfigurationDefinition,
    (model, definition) => definition ? definition.formatter(model) : null
);

export const getFormattedModelWithChanges = createSelector(
    getVersionModel,
    getRestorationChanges,
    getConfigurationDefinition,
    (model, changes, definition) => definition ? definition.formatter({
        ...model,
        ...changes
    }) : null
);

export const getRestorationModel = createSelector(
    getVersionModel,
    getRestorationChanges,
    getModel,
    (model, changes, empty) => ({
        ...model,
        ...empty,
        ...changes
    })
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
export const getConfigurationVersionDate = createSelector(getVersionModel, version => version && version.modifiedDate);
