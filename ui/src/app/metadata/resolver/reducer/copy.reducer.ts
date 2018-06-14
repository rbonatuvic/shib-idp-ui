import { CopySourceActionTypes, CopySourceActionUnion } from '../action/copy.action';
import { MetadataResolver } from '../../domain/model';
import { ProviderCollectionActionsUnion, ProviderCollectionActionTypes } from '../action/collection.action';

export interface CopyState {
    target: string;
    serviceProviderName: string;
    entityId: string;
    provider: MetadataResolver;
    saving: boolean;
    sections: string[];
}

export const initialState: CopyState = {
    target: null,
    serviceProviderName: null,
    entityId: null,
    provider: null,
    saving: false,
    sections: []
};

export function reducer(state = initialState, action: CopySourceActionUnion | ProviderCollectionActionsUnion): CopyState {
    switch (action.type) {
        case CopySourceActionTypes.UPDATE_PROVIDER_COPY_SECTIONS: {
            return {
                ...state,
                sections: [
                    ...action.payload
                ]
            };
        }
        case CopySourceActionTypes.CREATE_PROVIDER_COPY_REQUEST: {
            return {
                ...state,
                ...action.payload
            };
        }
        case CopySourceActionTypes.CREATE_PROVIDER_COPY_SUCCESS: {
            return {
                ...state,
                provider: action.payload
            };
        }
        case CopySourceActionTypes.UPDATE_PROVIDER_COPY: {
            return {
                ...state,
                provider: {
                    ...state.provider,
                    ...action.payload
                }
            };
        }
        case ProviderCollectionActionTypes.ADD_PROVIDER: {
            return {
                ...state,
                saving: true
            };
        }
        case ProviderCollectionActionTypes.ADD_PROVIDER_FAIL:
        case ProviderCollectionActionTypes.ADD_PROVIDER_SUCCESS: {
            return {
                ...initialState
            };
        }
        default: {
            return state;
        }
    }
}

export const getTarget = (state: CopyState) => state.target;
export const getName = (state: CopyState) => state.serviceProviderName;
export const getEntityId = (state: CopyState) => state.entityId;
export const getCopy = (state: CopyState) => state.provider;
export const getCopyAttributes = (state: CopyState) => ({
    entityId: state.entityId,
    serviceProviderName: state.serviceProviderName,
    target: state.target
});
export const getCopySections = (state: CopyState) => state.sections;
export const getSaving = (state: CopyState) => state.saving;
