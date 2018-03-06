import { createSelector, createFeatureSelector } from '@ngrx/store';
import * as fromRoot from '../../core/reducer';
import * as fromFilter from './filter.reducer';

export interface FilterState {
    filter: fromFilter.FilterState;
}

export const reducers = {
    filter: fromFilter.reducer
};

export interface State extends fromRoot.State {
    'metadata-filter': FilterState;
}

