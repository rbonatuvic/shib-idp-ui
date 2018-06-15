import { CopySourceActionTypes, CopySourceActionUnion } from '../action/copy.action';
import { MetadataResolver } from '../../domain/model';
import { ResolverCollectionActionsUnion, ResolverCollectionActionTypes } from '../action/collection.action';

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

export function reducer(state = initialState, action: CopySourceActionUnion | ResolverCollectionActionsUnion): CopyState {
    switch (action.type) {
        case CopySourceActionTypes.UPDATE_RESOLVER_COPY_SECTIONS: {
            return {
                ...state,
                sections: [
                    ...action.payload
                ]
            };
        }
        case CopySourceActionTypes.CREATE_RESOLVER_COPY_REQUEST: {
            return {
                ...state,
                ...action.payload
            };
        }
        case CopySourceActionTypes.CREATE_RESOLVER_COPY_SUCCESS: {
            return {
                ...state,
                provider: action.payload
            };
        }
        case CopySourceActionTypes.UPDATE_RESOLVER_COPY: {
            return {
                ...state,
                provider: {
                    ...state.provider,
                    ...action.payload
                }
            };
        }
        case ResolverCollectionActionTypes.ADD_RESOLVER: {
            return {
                ...state,
                saving: true
            };
        }
        case ResolverCollectionActionTypes.ADD_RESOLVER_FAIL:
        case ResolverCollectionActionTypes.ADD_RESOLVER_SUCCESS: {
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
