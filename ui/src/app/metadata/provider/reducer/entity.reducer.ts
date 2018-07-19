import { MetadataProvider } from '../../domain/model';
import { EntityActionTypes, EntityActionUnion } from '../action/entity.action';

export interface EntityState {
    saving: boolean;
    changes: MetadataProvider;
}

export const initialState: EntityState = {
    saving: false,
    changes: null
};

export function reducer(state = initialState, action: EntityActionUnion): EntityState {
    switch (action.type) {
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

export const isEntitySaved = (state: EntityState) => !Object.keys(state.changes).length && !state.saving;
export const getEntityChanges = (state: EntityState) => state.changes;
export const isEditorSaving = (state: EntityState) => state.saving;
export const getUpdatedEntity = (state: EntityState) => state.changes;
