import { createSelector, createFeatureSelector } from '@ngrx/store';
import * as fromRoot from '../../core/reducer';
import * as fromDashboard from './dashboard.reducer';
import * as fromSearch from './search.reducer';
import * as fromProviders from '../../metadata-provider/reducer';

export interface DashboardState {
    dashboard: fromDashboard.State;
    search: fromSearch.SearchState;
}

export interface State extends fromRoot.State {
    'dashboard': DashboardState;
}

export const reducers = {
    dashboard: fromDashboard.reducer,
    search: fromSearch.reducer
};

export const getFeatureState = createFeatureSelector<DashboardState>('dashboard');
export const getDashboardState = createSelector(getFeatureState, (state: DashboardState) => state.dashboard);
export const getOpenProviders = createSelector(getDashboardState, (dashboard: fromDashboard.State) => dashboard.providersOpen);

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
