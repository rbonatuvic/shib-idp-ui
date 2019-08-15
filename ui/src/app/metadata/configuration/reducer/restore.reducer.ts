import { RestoreActionTypes, RestoreActionsUnion } from '../action/restore.action';
import { Metadata } from '../../domain/domain.type';

export interface State {
    model: Metadata;
    selectedVersionId: string;
    selectedVersionType: string;
    selectedMetadataId: string;
    loaded: Boolean;
}

export const initialState: State = {
    model: null,
    selectedVersionId: null,
    selectedMetadataId: null,
    selectedVersionType: null,
    loaded: false
};

export function reducer(state = initialState, action: RestoreActionsUnion): State {
    switch (action.type) {
        case RestoreActionTypes.SELECT_VERSION_REQUEST:
            return {
                ...state,
                selectedMetadataId: action.payload.id,
                selectedVersionId: action.payload.version,
                selectedVersionType: action.payload.type
            };
        case RestoreActionTypes.SELECT_VERSION_SUCCESS:
            return {
                ...state,
                model: action.payload,
                loaded: true
            };
        case RestoreActionTypes.CLEAR_VERSION:
            return {
                ...initialState
            };
        default: {
            return state;
        }
    }
}

export const getVersionModel = (state: State) => state.model;
export const getVersionModelLoaded = (state: State) => state.loaded;
