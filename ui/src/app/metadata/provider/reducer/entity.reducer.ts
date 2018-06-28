import { MetadataProvider } from '../../domain/model';
import { EntityActionTypes, EntityActionUnion } from '../action/entity.action';

export interface EntityState {
    saving: boolean;
    base: MetadataProvider;
    changes: MetadataProvider;
}

export const initialState: EntityState = {
    saving: false,
    base: null,
    changes: null
};

export function reducer(state = initialState, action: EntityActionUnion): EntityState {
    switch (action.type) {
        case EntityActionTypes.RESET_CHANGES: {
            return {
                ...state,
                changes: initialState.changes
            };
        }
        case EntityActionTypes.SELECT_PROVIDER:
        case EntityActionTypes.CREATE_PROVIDER: {
            return {
                ...state,
                base: {
                    ...action.payload
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
        case EntityActionTypes.SAVE_PROVIDER_REQUEST: {
            return {
                ...state,
                saving: true
            };
        }
        case EntityActionTypes.SAVE_PROVIDER_SUCCESS: {
            return {
                ...initialState,
            };
        }
        case EntityActionTypes.SAVE_PROVIDER_FAIL: {
            return {
                ...state,
                saving: false
            };
        }
        default: {
            return state;
        }
    }
}

export const isEntitySaved = (state: EntityState) => !Object.keys(state.changes).length && !state.saving;
export const getEntityChanges = (state: EntityState) => state.changes;
export const isEditorSaving = (state: EntityState) => state.saving;
export const getUpdatedEntity = (state: EntityState) => ({ ...state.base, ...state.changes });
