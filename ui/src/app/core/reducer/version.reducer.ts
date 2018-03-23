import { createSelector, createFeatureSelector } from '@ngrx/store';
import * as version from '../action/version.action';
import * as fromRoot from '../../core/reducer';

export interface VersionState {
    info: any;
    loading: boolean;
    error: Error | null;
}

export const initialState: VersionState = {
    info: {},
    loading: false,
    error: null
};

export function reducer(state = initialState, action: version.Actions): VersionState {
    switch (action.type) {
        case version.VERSION_LOAD_REQUEST: {
            return {
                ...state,
                loading: true
            };
        }
        case version.VERSION_LOAD_SUCCESS: {
            return {
                ...state,
                loading: false,
                info: action.payload
            };
        }
        case version.VERSION_LOAD_ERROR: {
            return {
                ...state,
                loading: false,
                error: action.payload
            };
        }
        default: {
            return state;
        }
    }
}

export const getVersionInfo = (state: VersionState) => state.info;
export const getVersionIsLoading = (state: VersionState) => state.loading;
export const getVersionError = (state: VersionState) => state.error;
