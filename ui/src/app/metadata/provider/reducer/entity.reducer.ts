import { MetadataProvider } from '../../domain/model';
import { EntityActionTypes, EntityActionUnion } from '../action/entity.action';
import { ProviderCollectionActionsUnion, ProviderCollectionActionTypes } from '../action/collection.action';

export interface EntityState {
    saving: boolean;
    changes: MetadataProvider;
}

export const initialState: EntityState = {
    saving: false,
    changes: null
};

export function reducer(state = initialState, action: EntityActionUnion | ProviderCollectionActionsUnion): EntityState {
    switch (action.type) {
        case ProviderCollectionActionTypes.ADD_PROVIDER_REQUEST:
        case ProviderCollectionActionTypes.UPDATE_PROVIDER_REQUEST: {
            return {
                ...state,
                saving: true
            };
        }

        case ProviderCollectionActionTypes.UPDATE_PROVIDER_FAIL:
        case ProviderCollectionActionTypes.UPDATE_PROVIDER_SUCCESS:
        case ProviderCollectionActionTypes.ADD_PROVIDER_FAIL:
        case ProviderCollectionActionTypes.ADD_PROVIDER_SUCCESS: {
            return {
                ...state,
                saving: false
            };
        }
        case EntityActionTypes.CLEAR_PROVIDER: {
            return {
                ...initialState
            };
        }
        case EntityActionTypes.RESET_CHANGES: {
            return {
                ...state,
                changes: {
                    ...initialState.changes
                }
            };
        }
        case EntityActionTypes.UPDATE_PROVIDER: {
            return {
                ...state,
                changes: {
                    ...state.changes,
                    ...action.payload
                }
            };
        }
        default: {
            return state;
        }
    }
}

export const isEntitySaved = (state: EntityState) => state.changes ? !Object.keys(state.changes).length && !state.saving : true;
export const getEntityChanges = (state: EntityState) => state.changes;
export const isEditorSaving = (state: EntityState) => state.saving;
export const getUpdatedEntity = (state: EntityState) => state.changes;
