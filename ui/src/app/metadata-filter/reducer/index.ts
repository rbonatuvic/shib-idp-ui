import { createSelector, createFeatureSelector } from '@ngrx/store';
import * as fromRoot from '../../core/reducer';
import * as fromFilter from './filter.reducer';

export interface FilterState {
    filter: fromFilter.FilterState;
}

export const reducers = {
    filter: fromFilter.reducer,
};

export interface State extends fromRoot.State {
    'metadata-filter': FilterState;
}

export const getFiltersFromStateFn = (state: FilterState) => state.filter;
export const getFilterState = createFeatureSelector<FilterState>('metadata-filter');

export const getFilterFromState = createSelector(getFilterState, getFiltersFromStateFn);
export const getViewingMore = createSelector(getFilterFromState, fromFilter.getViewMore);
export const getSelected = createSelector(getFilterFromState, fromFilter.getSelected);
export const getEntityCollection = createSelector(getFilterFromState, fromFilter.getEntityIds);
export const getIsLoading = createSelector(getFilterFromState, fromFilter.getLoading);
export const getError = createSelector(getFilterFromState, fromFilter.getError);
export const getTerm = createSelector(getFilterFromState, fromFilter.getTerm);
export const getFilter = createSelector(getFilterFromState, fromFilter.getFilter);
