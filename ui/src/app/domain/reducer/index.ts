import { createSelector, createFeatureSelector, ActionReducerMap } from '@ngrx/store';
import * as fromFilter from './filter-collection.reducer';
import * as fromProvider from './provider-collection.reducer';
import * as fromDraft from './draft-collection.reducer';
import * as fromRoot from '../../app.reducer';

export interface CollectionState {
    filters: fromFilter.FilterCollectionState;
    providers: fromProvider.ProviderCollectionState;
    drafts: fromDraft.DraftCollectionState;
}

export const reducers: ActionReducerMap<CollectionState> = {
    filters: fromFilter.reducer,
    providers: fromProvider.reducer,
    drafts: fromDraft.reducer
};

export interface State extends fromRoot.State {
    'collections': CollectionState;
}

export const getCollectionState = createFeatureSelector<CollectionState>('collections');

/*
 *   Select pieces of Collection State - Functions
*/
export const getFiltersFromStateFn = (state: CollectionState) => state.filters;
export const getProvidersStateFn = (state: CollectionState) => state.providers;
export const getDraftsStateFn = (state: CollectionState) => state.drafts;

export const getFilterEntityState = createSelector(getCollectionState, getFiltersFromStateFn);
export const getProviderEntityState = createSelector(getCollectionState, getProvidersStateFn);
export const getDraftEntityState = createSelector(getCollectionState, getDraftsStateFn);

/*
 *   Utility functions
*/

export const combineAllFn = (d, p) => [...p, ...d];
export const doesExistFn = (ids, selected) => ids.indexOf(selected) > -1;
export const getInCollectionFn = (entities, selectedId) => {
    return selectedId && entities[selectedId];
};
export const getEntityIdsFn = list => list.map(entity => entity.entityId);

/*
 *   Select pieces of Provider Collection
*/

export const getProviderEntities = createSelector(getProviderEntityState, fromProvider.selectProviderEntities);
export const getSelectedProviderId = createSelector(getProviderEntityState, fromProvider.getSelectedProviderId);
export const getSelectedProvider = createSelector(getProviderEntities, getSelectedProviderId, getInCollectionFn);
export const getProviderIds = createSelector(getProviderEntityState, fromProvider.selectProviderIds);
export const getProviderCollection = createSelector(getProviderEntityState, getProviderIds, fromProvider.selectAllProviders);

/*
 *   Select pieces of Draft Collection
*/

export const getDraftEntities = createSelector(getDraftEntityState, fromDraft.selectDraftEntities);
export const getDraftIds = createSelector(getDraftEntityState, fromDraft.selectDraftIds);
export const getDraftCollection = createSelector(getDraftEntityState, getDraftIds, fromDraft.selectAllDrafts);

export const getSelectedDraftId = createSelector(getDraftEntityState, fromDraft.getSelectedDraftId);
export const getSelectedDraft = createSelector(getDraftEntities, getSelectedDraftId, getInCollectionFn);
export const isSelectedProviderInCollection = createSelector(getProviderIds, getSelectedProviderId, doesExistFn);
export const isSelectedDraftInCollection = createSelector(getDraftIds, getSelectedDraftId, doesExistFn);

/*
 *   Select pieces of Filter Collection
*/

export const getAllFilters = createSelector(getFilterEntityState, fromFilter.selectAllFilters);
export const getFilterEntities = createSelector(getFilterEntityState, fromFilter.selectFilterEntities);
export const getSelectedFilterId = createSelector(getFilterEntityState, fromFilter.getSelectedFilterId);
export const getSelectedFilter = createSelector(getFilterEntities, getSelectedFilterId, getInCollectionFn);
export const getFilterIds = createSelector(getFilterEntityState, fromFilter.selectFilterIds);
export const getFilterCollectionIsLoaded = createSelector(getFilterEntityState, fromFilter.getIsLoaded);

/*
 *   Combine pieces of Collection State
*/

export const getAllProviders = createSelector(getDraftCollection, getProviderCollection, combineAllFn);
export const getAllProviderIds = createSelector(getDraftIds, getProviderIds, combineAllFn);

export const getAllEntityIds = createSelector(getAllProviders, getEntityIdsFn);
