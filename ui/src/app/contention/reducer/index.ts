import { createSelector, createFeatureSelector } from '@ngrx/store';
import * as fromContention from './contention.reducer';
import * as fromRoot from '../../app.reducer';

export interface ContentionState {
    contention: fromContention.State;
}

export const reducers = {
    contention: fromContention.reducer
};

export interface State extends fromRoot.State {
    'contention': ContentionState;
}

export const getCoreState = createFeatureSelector<ContentionState>('contention');

export const getContentionStateFromStateFn = (state: ContentionState) => state.contention;
export const getContentionStateFromState = createSelector(getCoreState, getContentionStateFromStateFn);

export const getContention = createSelector(getContentionStateFromState, fromContention.getContention);
