import { createSelector, createFeatureSelector } from '@ngrx/store';
import * as fromRoot from '../../../core/reducer';
import * as fromSearch from './search.reducer';

export interface DashboardState {
    search: fromSearch.SearchState;
}

export interface State extends fromRoot.State {
    'manager': DashboardState;
}

export const reducers = {
    search: fromSearch.reducer
};

export const getFeatureState = createFeatureSelector<DashboardState>('manager');

export const getSearchState = createSelector(getFeatureState,
    (state: DashboardState) => state.search
);

export const getSearchResults = createSelector(
    getSearchState,
    fromSearch.getEntities
);
export const getSearchQuery = createSelector(
    getSearchState,
    fromSearch.getQuery
);
export const getSearchLoading = createSelector(
    getSearchState,
    fromSearch.getLoading
);
