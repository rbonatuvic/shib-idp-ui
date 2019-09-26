import { createSelector, createFeatureSelector } from '@ngrx/store';

import * as fromRoot from '../../../app.reducer';
import * as fromConfiguration from './configuration.reducer';
import * as fromHistory from './history.reducer';
import * as fromCompare from './compare.reducer';
import * as fromVersion from './version.reducer';
import * as fromRestore from './restore.reducer';
import * as fromFilter from './filter.reducer';
import { WizardStep } from '../../../wizard/model';

import * as utils from '../../domain/utility/configuration';
import { getConfigurationSectionsFn, assignValueToProperties } from './utilities';
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
    filter: fromFilter.State;
}

export const reducers = {
    configuration: fromConfiguration.reducer,
    history: fromHistory.reducer,
    compare: fromCompare.reducer,
    version: fromVersion.reducer,
    restore: fromRestore.reducer,
    filter: fromFilter.reducer
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
export const getFilterStateFn = (state: ConfigurationState) => state.filter;

export const getConfigurationState = createSelector(getState, getConfigurationStateFn);
export const getConfigurationModelKind = createSelector(getConfigurationState, fromConfiguration.getModelKind);
export const getConfigurationModelId = createSelector(getConfigurationState, fromConfiguration.getModelId);

export const getConfigurationDefinition = createSelector(getConfigurationState, fromConfiguration.getDefinition);
export const getSchema = createSelector(getConfigurationState, fromConfiguration.getSchema);
export const getConfigurationXml = createSelector(getConfigurationState, fromConfiguration.getXml);

export const processSchemaFn = (definition, schema) => {
    return definition && schema ?
        definition.schemaPreprocessor ?
            definition.schemaPreprocessor(schema) : schema
        : schema;
};

export const getConfigurationSchema = createSelector(getConfigurationDefinition, getSchema, processSchemaFn);
export const getConfigurationModelEnabledFn =
    (config: Metadata) => config ? ('serviceEnabled' in config) ? config.serviceEnabled : config.enabled : false;

export const getConfigurationModelNameFn =
    (config: Metadata) => config ? ('serviceProviderName' in config) ? config.serviceProviderName : config.name : '';

export const getConfigurationModelTypeFn =
    (config: Metadata) => config ? ('@type' in config) ? config['@type'] : 'resolver' : null;

export const filterPluginTypes = ['RequiredValidUntil', 'SignatureValidation', 'EntityRoleWhiteList'];
export const isAdditionalFilter = (type) => filterPluginTypes.indexOf(type) === -1;

export const getVersionModelFiltersFn =
    (model, kind) => kind === 'provider' ?
        model.metadataFilters ? model.metadataFilters.filter(filter => isAdditionalFilter(filter['@type'])) :
        [] : null;

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
export const getComparisonFilterId = createSelector(getCompareState, fromCompare.getFilterId);

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

export const getComparisonFilterListFn = (models) => models.map(m => getVersionModelFiltersFn(m, 'provider'));
export const getComparisonFilterList = createSelector(getComparisonModels, getComparisonFilterListFn);

export const getComparisonDatesFn = (config) => config.map(m => m ? m.modifiedDate : null);
export const getComparisonDates = createSelector(getComparisonModels, getComparisonDatesFn);

export const getComparisonFilterOrderedFn = (list) =>
    list.map(models =>
        models.map(filter =>
            ({
                ...filter,
                comparable: list
                    .reduce((acc, v) => acc.concat(v), [])
                    .map(v => v.resourceId)
                    .some((id, index, coll) => {
                        return coll.indexOf(filter.resourceId) !== coll.lastIndexOf(filter.resourceId);
                    })
            })
));

export const getComparisonFilterOrdered = createSelector(getComparisonFilterList, getComparisonFilterOrderedFn);

export const getComparisonFilterConfiguration = createSelector(
    getComparisonFilterOrdered,
    getComparisonDates,
    (filters, dates) => {
        const rows = filters.reduce((num, version) => version.length > num ? version.length : num, 0);
        const range = [...Array(rows).keys()];
        return {
            dates,
            filters: range.reduce((collection, index) => {
                const val = filters.map(version => version[index]);
                collection[index] = val;
                return collection;
            }, [])
        };
    }
);

export const getComparisonSelectedFilters = createSelector(
    getComparisonModels,
    getComparisonDates,
    getComparisonFilterId,
    (models, dates, id) => ({
        dates,
        sections: []
    })
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

// Filter Comparison State

export const getFilterState = createSelector(getState, getFilterStateFn);
export const getFilterComparisonDefinition = createSelector(getFilterState, fromFilter.getDefinition);
export const getFilterComparisonSchema = createSelector(getFilterState, fromFilter.getSchema);
export const getFilterComparisonModels = createSelector(getFilterState, fromFilter.getModels);
export const getFilterComparisonConfigurations = createSelector(
    getFilterComparisonModels,
    getFilterComparisonDefinition,
    getFilterComparisonSchema,
    getConfigurationSectionsFn
);

export const getLimitedFilterComparisonConfiguration = createSelector(
    getFilterComparisonConfigurations,
    getViewChangedOnly,
    getLimitedConfigurationsFn
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
