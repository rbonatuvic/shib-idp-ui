import { MetadataResolver } from '../../domain/model';
import * as entity from '../action/entity.action';
import { ResolverEntityActionTypes, ResolverEntityActionUnion } from '../action/entity.action';

export interface EntityState {
    saving: boolean;
    status: { [key: string]: string };
    changes: MetadataResolver;
}

export const initialState: EntityState = {
    saving: false,
    status: {},
    changes: {} as MetadataResolver
};

export function reducer(state = initialState, action: ResolverEntityActionUnion): EntityState {
    switch (action.type) {
        case ResolverEntityActionTypes.UPDATE_CHANGES_SUCCESS: {
            return {
                ...state,
                changes: { ...action.payload }
            };
        }
        case ResolverEntityActionTypes.UPDATE_STATUS: {
            return {
                ...state,
                status: { ...state.status, ...action.payload }
            };
        }
        case ResolverEntityActionTypes.UPDATE_SAVING: {
            return {
                ...state,
                saving: action.payload
            };
        }
        case ResolverEntityActionTypes.CLEAR:
            return {
                ...state,
                changes: { ...initialState.changes }
            };
        default: {
            return state;
        }
    }
}

export const isEntitySaved = (state: EntityState) => !Object.keys(state.changes).length;
export const getChanges = (state: EntityState) => state.changes;
export const isEntitySaving = (state: EntityState) => state.saving;
export const getFormStatus = (state: EntityState) => state.status;

export const isEntityValid = (state: EntityState) =>
    !Object.keys(state.status).some(key => state.status[key] === ('INVALID'));
export const getInvalidForms = (state: EntityState) =>
    Object.keys(state.status).filter(key => state.status[key] === 'INVALID');
