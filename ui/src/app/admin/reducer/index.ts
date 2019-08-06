import { createSelector, createFeatureSelector } from '@ngrx/store';
import * as fromRoot from '../../core/reducer';
import * as fromAdminCollection from './admin-collection.reducer';
import * as fromMetadataCollection from './metadata-collection.reducer';
import { getInCollectionFn } from '../../metadata/domain/domain.util';

export interface AdminState {
    admins: fromAdminCollection.CollectionState;
    metadata: fromMetadataCollection.CollectionState;
}

export const reducers = {
    admins: fromAdminCollection.reducer,
    metadata: fromMetadataCollection.reducer
};

export interface State extends fromRoot.State {
    'admin': AdminState;
}

export const getAdminsCollectionFromStateFn = (state: AdminState) => state.admins;
export const getMetadataCollectionFromStateFn = (state: AdminState) => state.metadata;

export const getFeatureState = createFeatureSelector<AdminState>('admin');

/*
 *   Select pieces of Admin Collection
*/
export const getAdminCollectionState = createSelector(getFeatureState, getAdminsCollectionFromStateFn);
export const getAllAdmins = createSelector(getAdminCollectionState, fromAdminCollection.selectAllAdmins);
export const getCollectionSaving = createSelector(getAdminCollectionState, fromAdminCollection.getIsSaving);

export const getAdminEntities = createSelector(getAdminCollectionState, fromAdminCollection.selectAdminEntities);
export const getSelectedAdminId = createSelector(getAdminCollectionState, fromAdminCollection.getSelectedAdminId);
export const getSelectedAdmin = createSelector(getAdminEntities, getSelectedAdminId, getInCollectionFn);
export const getAdminIds = createSelector(getAdminCollectionState, fromAdminCollection.selectAdminIds);


export const getConfiguredAdminsFn = (admins) => admins.filter(a => a.role !== 'ROLE_NONE');
export const getAllConfiguredAdmins = createSelector(getAllAdmins, getConfiguredAdminsFn);

export const getNewUsersFn = (admins) => admins.filter(a => a.role === 'ROLE_NONE');
export const getAllNewUsers = createSelector(getAllAdmins, getNewUsersFn);

/*
 *   Select pieces of Metadata Collection
*/
export const getMetadataCollectionState = createSelector(getFeatureState, getMetadataCollectionFromStateFn);

export const getMetadataEntities = createSelector(getMetadataCollectionState, fromMetadataCollection.selectMetadataEntities);
export const getSelectedMetadataId = createSelector(getMetadataCollectionState, fromMetadataCollection.getSelectedMetadataId);
export const getMetadataIds = createSelector(getMetadataCollectionState, fromMetadataCollection.selectMetadataIds);

export const getMetadataCollection = createSelector(getMetadataCollectionState, getMetadataIds, fromMetadataCollection.selectAllMetadata);
export const getSelectedMetadata = createSelector(getMetadataEntities, getSelectedMetadataId, getInCollectionFn);

export const totalUserFn = (users) => users.length;
export const totalMetadataFn = (md) => md.filter(obj => !obj.serviceEnabled).length;
export const totalActionsFn = (users, md) => md + users;

export const getTotalNewUsers = createSelector(getAllNewUsers, totalUserFn);
export const getTotalNewMetadata = createSelector(getMetadataCollection, totalMetadataFn);

export const getTotalActionsRequired = createSelector(getTotalNewUsers, getTotalNewMetadata, totalActionsFn);
