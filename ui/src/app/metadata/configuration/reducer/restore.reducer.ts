import { Metadata } from '../../domain/domain.type';
import { RestoreActionTypes, RestoreActionsUnion } from '../action/restore.action';

export interface RestoreState {
    saving: boolean;
    status: { [key: string]: string };
    changes: Metadata;
}

export const initialState: RestoreState = {
    saving: false,
    status: {},
    changes: {} as Metadata
};

export function reducer(state = initialState, action: RestoreActionsUnion): RestoreState {
    switch (action.type) {
        case RestoreActionTypes.UPDATE_RESTORATION_SUCCESS:
            return {
                ...state,
                changes: {
                    ...state.changes,
                    ...action.payload
                }
            };
        case RestoreActionTypes.SET_SAVING_STATUS:
            return {
                ...state,
                saving: action.payload
            };
        case RestoreActionTypes.UPDATE_STATUS: {
            return {
                ...state,
                status: {
                    ...state.status,
                    ...action.payload
                }
            };
        }
        default: {
            return state;
        }
    }
}

export const isRestorationSaved = (state: RestoreState) => !Object.keys(state.changes).length;
export const getChanges = (state: RestoreState) => state.changes;
export const isRestorationSaving = (state: RestoreState) => state.saving;
export const getFormStatus = (state: RestoreState) => state.status;

export const isRestorationValid = (state: RestoreState) =>
    !Object.keys(state.status).some(key => state.status[key] === ('INVALID'));
export const getInvalidRestorationForms = (state: RestoreState) =>
    Object.keys(state.status).filter(key => state.status[key] === 'INVALID');
