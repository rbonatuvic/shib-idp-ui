import { createSelector, createFeatureSelector } from '@ngrx/store';
import * as fromRoot from '../../../core/reducer';
import * as fromCollection from './collection.reducer';

export interface AdminState {
    collection: fromCollection.CollectionState;
}

export const reducers = {
    collection: fromCollection.reducer
};

export interface State extends fromRoot.State {
    'admin': AdminState;
}

export const getCollectionFromStateFn = (state: AdminState) => state.collection;

export const getAdminState = createFeatureSelector<AdminState>('admin');

/*
 *   Select pieces of Admin Collection
*/
export const getCollectionState = createSelector(getAdminState, getCollectionFromStateFn);
export const getAllAdmins = createSelector(getCollectionState, fromCollection.selectAllAdmins);
export const getCollectionSaving = createSelector(getCollectionState, fromCollection.getIsSaving);

export const getAdminEntities = createSelector(getCollectionState, fromCollection.selectAdminEntities);
export const getSelectedAdminId = createSelector(getCollectionState, fromCollection.getSelectedAdminId);
export const getSelectedAdmin = createSelector(getAdminEntities, getSelectedAdminId, (entities, selectedId) => {
    return selectedId && entities[selectedId];
});
export const getAdminIds = createSelector(getCollectionState, fromCollection.selectAdminIds);
