import { createSelector, createFeatureSelector } from '@ngrx/store';
import * as fromRoot from '../../core/reducer';
import * as fromFilter from './filter.reducer';
import * as fromSearch from './search.reducer';

export interface FilterState {
    filter: fromFilter.FilterState;
    search: fromSearch.SearchState;
}

export const reducers = {
    filter: fromFilter.reducer,
    search: fromSearch.reducer
};

export interface State extends fromRoot.State {
    'metadata-filter': FilterState;
}

export const getFiltersFromStateFn = (state: FilterState) => state.filter;
export const getSearchFromStateFn = (state: FilterState) => state.search;
export const getFilterState = createFeatureSelector<FilterState>('metadata-filter');

export const getFilterFromState = createSelector(getFilterState, getFiltersFromStateFn);
export const getSelected = createSelector(getFilterFromState, fromFilter.getSelected);
export const getFilter = createSelector(getFilterFromState, fromFilter.getFilterChanges);
export const getPreview = createSelector(getFilterFromState, fromFilter.getPreview);
export const getSaving = createSelector(getFilterFromState, fromFilter.getSaving);

export const getSearchFromState = createSelector(getFilterState, getSearchFromStateFn);
export const getEntityCollection = createSelector(getSearchFromState, fromSearch.getEntityIds);
export const getIsLoading = createSelector(getSearchFromState, fromSearch.getLoading);
export const getError = createSelector(getSearchFromState, fromSearch.getError);
export const getTerm = createSelector(getSearchFromState, fromSearch.getTerm);
export const getViewingMore = createSelector(getSearchFromState, fromSearch.getViewMore);
