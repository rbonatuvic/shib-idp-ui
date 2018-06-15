import { createSelector, createFeatureSelector } from '@ngrx/store';
import * as fromRoot from '../../../core/reducer';
import * as fromDashboard from './manager.reducer';
import * as fromSearch from './search.reducer';

export interface DashboardState {
    manager: fromDashboard.State;
    search: fromSearch.SearchState;
}

export interface State extends fromRoot.State {
    'manager': DashboardState;
}

export const reducers = {
    manager: fromDashboard.reducer,
    search: fromSearch.reducer
};

export const getFeatureState = createFeatureSelector<DashboardState>('manager');
export const getDashboardState = createSelector(getFeatureState, (state: DashboardState) => state.manager);
export const getOpenProviders = createSelector(getDashboardState, (manager: fromDashboard.State) => manager.providersOpen);

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
export const getFilterType = createSelector(
    getSearchState,
    fromSearch.getFilter
);
export const getSearchLoading = createSelector(
    getSearchState,
    fromSearch.getLoading
);
