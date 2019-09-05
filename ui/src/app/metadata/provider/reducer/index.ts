import { createSelector, createFeatureSelector } from '@ngrx/store';
import * as fromRoot from '../../../app.reducer';
import * as fromEditor from './editor.reducer';
import * as fromEntity from './entity.reducer';
import * as fromCollection from './collection.reducer';
import * as utils from '../../domain/domain.util';

import * as fromWizard from '../../../wizard/reducer';

import { MetadataProvider } from '../../domain/model';

export interface ProviderState {
    editor: fromEditor.EditorState;
    entity: fromEntity.EntityState;
    collection: fromCollection.CollectionState;
}

export const reducers = {
    editor: fromEditor.reducer,
    entity: fromEntity.reducer,
    collection: fromCollection.reducer
};

export interface State extends fromRoot.State {
    provider: ProviderState;
}

export const getProviderState = createFeatureSelector<ProviderState>('provider');

export const getEditorStateFn = (state: ProviderState) => state.editor;
export const getEntityStateFn = (state: ProviderState) => state.entity;
export const getCollectionStateFn = (state: ProviderState) => state.collection;

export const getEditorState = createSelector(getProviderState, getEditorStateFn);
export const getEntityState = createSelector(getProviderState, getEntityStateFn);
export const getCollectionState = createSelector(getProviderState, getCollectionStateFn);

/*
Editor State
*/

export const getEditorIsValid = createSelector(getEditorState, fromEditor.isEditorValid);

export const getFormStatus = createSelector(getEditorState, fromEditor.getFormStatus);
export const getInvalidEditorForms = createSelector(getEditorState, fromEditor.getInvalidForms);


/*
Entity State
*/

export const getEntityIsSaved = createSelector(getEntityState, fromEntity.isEntitySaved);
export const getEntityChanges = createSelector(getEntityState, fromEntity.getEntityChanges);
export const getEntityIsSaving = createSelector(getEntityState, fromEntity.isEditorSaving);
export const getUpdatedEntity = createSelector(getEntityState, fromEntity.getUpdatedEntity);

/*
 *   Select pieces of Provider Collection
*/
export const getProviderOrder = createSelector(getCollectionState, fromCollection.getProviderOrder);
export const getAllProviders = createSelector(getCollectionState, fromCollection.selectAllProviders);
export const getProviderEntities = createSelector(getCollectionState, fromCollection.selectProviderEntities);
export const getSelectedProviderId = createSelector(getCollectionState, fromCollection.getSelectedProviderId);
export const getSelectedProvider = createSelector(getProviderEntities, getSelectedProviderId, utils.getInCollectionFn);
export const getProviderIds = createSelector(getCollectionState, fromCollection.selectProviderIds);
export const getProviderCollectionIsLoaded = createSelector(getCollectionState, fromCollection.getIsLoaded);

export const getProviderNames = createSelector(getAllProviders, (providers: MetadataProvider[]) => providers.map(p => p.name));
export const getFilteredProviderNames = createSelector(
    getProviderNames,
    getSelectedProvider, (names, provider) => names.filter(name => name !== provider.name)
);


export const getProviderFilters = createSelector(getSelectedProvider, provider => provider.metadataFilters);

export const getProviderXmlIds = createSelector(getAllProviders, (providers: MetadataProvider[]) => providers.map(p => p.xmlId));
export const getOrderedProviders = createSelector(getAllProviders, getProviderOrder, utils.mergeOrderFn);
export const getOrderedProvidersInSearch = createSelector(getAllProviders, getProviderOrder, utils.mergeOrderFn);

export const getFilteredProviderXmlIds = createSelector(
    getProviderXmlIds,
    getSelectedProvider, (ids, provider) => ids.filter(id => id !== provider.xmlId)
);
