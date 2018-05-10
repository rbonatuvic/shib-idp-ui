import { createSelector, createFeatureSelector } from '@ngrx/store';
import * as fromRoot from '../../app.reducer';
import * as fromSearch from './search.reducer';
import * as fromCopy from './copy.reducer';

export interface ProviderState {
    copy: fromCopy.CopyState;
    search: fromSearch.SearchState;
}

export const reducers = {
    copy: fromCopy.reducer,
    search: fromSearch.reducer
};

export interface State extends fromRoot.State {
    'provider': ProviderState;
}

export const getProviderState = createFeatureSelector<ProviderState>('provider');

export const getCopyFromStateFn = (state: ProviderState) => state.copy;
export const getSearchFromStateFn = (state: ProviderState) => state.search;

export const getCopyFromState = createSelector(getProviderState, getCopyFromStateFn);
export const getCopy = createSelector(getCopyFromState, fromCopy.getCopy);
export const getSaving = createSelector(getCopyFromState, fromCopy.getSaving);
export const getAttributes = createSelector(getCopyFromState, fromCopy.getCopyAttributes);

export const getSearchFromState = createSelector(getProviderState, getSearchFromStateFn);
export const getSearchResults = createSelector(getSearchFromState, fromSearch.getMatches);
export const getSearchQuery = createSelector(getSearchFromState, fromSearch.getQuery);
export const getSearchLoading = createSelector(getSearchFromState, fromSearch.getSearching);
