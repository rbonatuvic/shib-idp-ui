import { CompareActionTypes, CompareActionsUnion } from '../action/compare.action';
import { Metadata } from '../../domain/domain.type';

export interface State {
    models: Metadata[];
    loaded: boolean;
    loading: boolean;
    compareChangedOnly: boolean;
    filter: string;
}

export const initialState: State = {
    models: [],
    loaded: false,
    loading: false,
    compareChangedOnly: false,
    filter: null
};

export function reducer(state = initialState, action: CompareActionsUnion): State {
    switch (action.type) {
        case CompareActionTypes.SET_VIEW_CHANGED:
            return {
                ...state,
                compareChangedOnly: action.payload
            };
        case CompareActionTypes.COMPARE_METADATA_REQUEST:
            return {
                ...state,
                loading: true
            };
        case CompareActionTypes.COMPARE_METADATA_ERROR:
        case CompareActionTypes.COMPARE_METADATA_SUCCESS:
            return {
                ...state,
                loading: false
            };
        case CompareActionTypes.SET_VERSIONS:
            return {
                ...state,
                models: action.payload,
                loaded: true
            };
        case CompareActionTypes.CLEAR_VERSIONS:
            return {
                ...initialState
            };
        default: {
            return state;
        }
    }
}

export const getVersionModels = (state: State) => state.models;
export const getVersionModelsLoaded = (state: State) => state.loaded;
export const getComparisonLoading = (state: State) => state.loading;
export const getViewChangedOnly = (state: State) => state.compareChangedOnly;
export const getFilterId = (state: State) => state.filter;
