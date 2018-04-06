import { createSelector, createFeatureSelector } from '@ngrx/store';
import { MetadataProvider } from '../../domain/model/metadata-provider';
import * as editor from '../action/editor.action';
import * as provider from '../../domain/action/provider-collection.action';
import * as fromRoot from '../../core/reducer';

export interface EditorState {
    saving: boolean;
    formStatus: { [key: string]: string };
    changes: MetadataProvider;
}

export const initialState: EditorState = {
    saving: false,
    formStatus: {},
    changes: {} as MetadataProvider
};

export function reducer(state = initialState, action: editor.Actions | provider.Actions): EditorState {
    switch (action.type) {
        case provider.ADD_PROVIDER: {
            return {
                ...state,
                saving: true,
            };
        }
        case provider.ADD_PROVIDER_FAIL: {
            return {
                ...state,
                saving: false
            };
        }
        case provider.ADD_PROVIDER_SUCCESS: {
            return {
                ...state,
                changes: { ...initialState.changes },
                saving: false
            };
        }
        case editor.UPDATE_STATUS: {
            return Object.assign({}, state, {
                formStatus: { ...state.formStatus, ...action.payload }
            });
        }
        case editor.UPDATE_CHANGES: {
            return Object.assign({}, state, {
                changes: { ...state.changes, ...action.payload }
            });
        }
        case editor.CANCEL_CHANGES:
        case editor.SAVE_CHANGES:
        case editor.RESET_CHANGES:
            return Object.assign({}, state, {
                changes: { ...initialState.changes }
            });
        default: {
            return state;
        }
    }
}

export const isEditorValid = (state: EditorState) =>
    !Object.keys(state.formStatus).some(key => state.formStatus[key] === ('INVALID'));
export const isEditorSaved = (state: EditorState) => !Object.keys(state.changes).length;
export const getChanges = (state: EditorState) => state.changes;
export const isEditorSaving = (state: EditorState) => state.saving;
export const getFormStatus = (state: EditorState) => state.formStatus;
export const getInvalidForms = (state: EditorState) =>
    Object.keys(state.formStatus).filter(key => state.formStatus[key] === 'INVALID');
