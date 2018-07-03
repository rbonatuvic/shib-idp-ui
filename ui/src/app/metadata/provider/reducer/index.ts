import { createSelector, createFeatureSelector } from '@ngrx/store';
import * as fromRoot from '../../../app.reducer';
import * as fromEditor from './editor.reducer';
import * as fromEntity from './entity.reducer';

export interface ProviderState {
    editor: fromEditor.EditorState;
    entity: fromEntity.EntityState;
}

export const reducers = {
    editor: fromEditor.reducer,
    entity: fromEntity.reducer
};

export interface State extends fromRoot.State {
    provider: ProviderState;
}

export const getProviderState = createFeatureSelector<ProviderState>('provider');

export const getEditorStateFn = (state: ProviderState) => state.editor;
export const getEntityStateFn = (state: ProviderState) => state.entity;

export const getEditorState = createSelector(getProviderState, getEditorStateFn);
export const getEntityState = createSelector(getProviderState, getEntityStateFn);

/*
Editor State
*/

export const getSchema = createSelector(getEditorState, fromEditor.getSchema);

export const getEditorIsValid = createSelector(getEditorState, fromEditor.isEditorValid);

export const getFormStatus = createSelector(getEditorState, fromEditor.getFormStatus);
export const getInvalidEditorForms = createSelector(getEditorState, fromEditor.getInvalidForms);

/*
Entity State
*/

export const getEntityIsSaved = createSelector(getEntityState, fromEntity.isEntitySaved);
export const getEntityChanges = createSelector(getEntityState, fromEntity.getEntityChanges);
export const getEntityIsSaving = createSelector(getEntityState, fromEntity.isEditorSaving);
export const getUpdatedEntity = createSelector(getEntityState, fromEntity.getUpdatedEntity);