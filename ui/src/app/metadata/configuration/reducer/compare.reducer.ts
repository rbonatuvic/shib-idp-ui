import { CompareActionTypes, CompareActionsUnion } from '../action/compare.action';
import { Metadata } from '../../domain/domain.type';

export interface State {
    models: Metadata[];
    loaded: Boolean;
}

export const initialState: State = {
    models: [],
    loaded: false
};

export function reducer(state = initialState, action: CompareActionsUnion): State {
    switch (action.type) {
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
