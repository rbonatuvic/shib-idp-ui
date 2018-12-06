import { createSelector, createFeatureSelector } from '@ngrx/store';
import * as fromRoot from '../../../core/reducer';
import * as fromFilter from './filter.reducer';
import * as fromSearch from './search.reducer';
import * as fromCollection from './collection.reducer';
import * as utils from '../../domain/domain.util';
import { MetadataFilter } from '../../domain/model';

export interface FilterState {
    filter: fromFilter.FilterState;
    search: fromSearch.SearchState;
    collection: fromCollection.CollectionState;
}

export const reducers = {
    filter: fromFilter.reducer,
    search: fromSearch.reducer,
    collection: fromCollection.reducer
};

export interface State extends fromRoot.State {
    'filter': FilterState;
}

export const getFiltersFromStateFn = (state: FilterState) => state.filter;
export const getSearchFromStateFn = (state: FilterState) => state.search;
export const getCollectionFromStateFn = (state: FilterState) => state.collection;

export const getFilterState = createFeatureSelector<FilterState>('filter');

export const getFilterFromState = createSelector(getFilterState, getFiltersFromStateFn);

export const getSelected = createSelector(getFilterFromState, fromFilter.getSelected);
export const getFilter = createSelector(getFilterFromState, fromFilter.getFilterChanges);
export const getPreview = createSelector(getFilterFromState, fromFilter.getPreview);

/*
 *   Select pieces of Search Collection
*/

export const getSearchFromState = createSelector(getFilterState, getSearchFromStateFn);
export const getEntityCollection = createSelector(getSearchFromState, fromSearch.getEntityIds);
export const getIsLoading = createSelector(getSearchFromState, fromSearch.getLoading);
export const getError = createSelector(getSearchFromState, fromSearch.getError);
export const getTerm = createSelector(getSearchFromState, fromSearch.getTerm);
export const getViewingMore = createSelector(getSearchFromState, fromSearch.getViewMore);

/*
 *   Select pieces of Filter Collection
*/
export const getCollectionState = createSelector(getFilterState, getCollectionFromStateFn);
export const getAllFilters = createSelector(getCollectionState, fromCollection.selectAllFilters);
export const getCollectionSaving = createSelector(getCollectionState, fromCollection.getIsSaving);
export const getCollectionOrder = createSelector(getCollectionState, fromCollection.getOrder);

export const getFilterEntities = createSelector(getCollectionState, fromCollection.selectFilterEntities);
export const getSelectedFilterId = createSelector(getCollectionState, fromCollection.getSelectedFilterId);
export const getSelectedFilter = createSelector(getFilterEntities, getSelectedFilterId, utils.getInCollectionFn);
export const getFilterIds = createSelector(getCollectionState, fromCollection.selectFilterIds);
export const getFilterCollectionIsLoaded = createSelector(getCollectionState, fromCollection.getIsLoaded);

export const filterPluginTypes = ['RequiredValidUntil', 'SignatureValidation', 'EntityRoleWhiteList'];
export const isAdditionalFilter = (type) => filterPluginTypes.indexOf(type) === -1;
export const isFilterPlugin = (type) => filterPluginTypes.indexOf(type) >= 0;

export const filterTypeFn = filters => [...filters.filter(f => isAdditionalFilter(f['@type']))];
export const filterOrderFn = (filters, order) => order.filter(id => filters.hasOwnProperty(id) && isAdditionalFilter(filters[id]['@type']));
export const pluginOrderFn = (filters, order) => order.filter(id => filters.hasOwnProperty(id) && isFilterPlugin(filters[id]['@type']));

export const getFilterList = createSelector(getAllFilters, filterTypeFn);
export const getAdditionalFilterOrder = createSelector(getFilterEntities, getCollectionOrder, filterOrderFn);
export const getAdditionalFilters = createSelector(getFilterList, getAdditionalFilterOrder, utils.mergeOrderFn);
export const getPluginFilterOrder = createSelector(getFilterEntities, getCollectionOrder, pluginOrderFn);

export const getFilterNames = createSelector(getAllFilters, (filters: MetadataFilter[]) => filters.map(f => f.name).filter(f => !!f));

/*
 *   Combine pieces of State
*/

export const mergeFn = (changes, filter) => ({ ...filter, ...changes });
export const detectFilterType = (changes) => changes.type ? changes.type : changes.hasOwnProperty('@type') ? changes['@type'] : null;

export const getFilterWithChanges = createSelector(getFilter, getSelectedFilter, mergeFn);
export const getFilterType = createSelector(getFilter, (changes: MetadataFilter) => {
    const type = changes ? detectFilterType(changes) : null;
    console.log(type, changes);
    return type;
});

