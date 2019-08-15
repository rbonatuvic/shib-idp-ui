import { VersionActionTypes, VersionActionsUnion } from '../action/version.action';
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

export function reducer(state = initialState, action: VersionActionsUnion): State {
    switch (action.type) {
        case VersionActionTypes.SELECT_VERSION_REQUEST:
            return {
                ...state,
                selectedMetadataId: action.payload.id,
                selectedVersionId: action.payload.version,
                selectedVersionType: action.payload.type
            };
        case VersionActionTypes.SELECT_VERSION_SUCCESS:
            return {
                ...state,
                model: action.payload,
                loaded: true
            };
        case VersionActionTypes.CLEAR_VERSION:
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

export const getSelectedMetadataId = (state: State) => state.selectedMetadataId;
export const getSelectedVersionId = (state: State) => state.selectedVersionId;
export const getSelectedVersionType = (state: State) => state.selectedVersionType;
