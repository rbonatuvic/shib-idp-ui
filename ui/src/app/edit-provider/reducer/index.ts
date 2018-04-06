import { createSelector, createFeatureSelector } from '@ngrx/store';
import * as fromRoot from '../../app.reducer';
import * as fromEditor from './editor.reducer';

export interface EditProviderState {
    editor: fromEditor.EditorState;
}

export const reducers = {
    editor: fromEditor.reducer
};

export interface State extends fromRoot.State {
    'edit-provider': EditProviderState;
}

export const getEditProviderState = createFeatureSelector<EditProviderState>('edit-provider');
export const getEditorState = createSelector(getEditProviderState, (state: EditProviderState) => state.editor);
export const getEditorIsValid = createSelector(getEditorState, fromEditor.isEditorValid);
export const getEditorIsSaved = createSelector(getEditorState, fromEditor.isEditorSaved);
export const getEditorChanges = createSelector(getEditorState, fromEditor.getChanges);
export const getEditorIsSaving = createSelector(getEditorState, fromEditor.isEditorSaving);
export const getFormStatus = createSelector(getEditorState, fromEditor.getFormStatus);
export const getInvalidEditorForms = createSelector(getEditorState, fromEditor.getInvalidForms);
