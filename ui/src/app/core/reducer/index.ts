import {
    createSelector,
    createFeatureSelector
} from '@ngrx/store';

import * as fromUser from './user.reducer';
import * as fromVersion from './version.reducer';
import * as fromConfig from './configuration.reducer';
import * as fromLocation from './location.reducer';
import * as fromRoot from '../../app.reducer';

export interface CoreState {
    user: fromUser.UserState;
    version: fromVersion.VersionState;
    config: fromConfig.ConfigState;
    location: fromLocation.LocationState;
}

export interface State extends fromRoot.State {
    core: CoreState;
}

export const reducers = {
    user: fromUser.reducer,
    version: fromVersion.reducer,
    config: fromConfig.reducer,
    location: fromLocation.reducer
};

export const getCoreFeature = createFeatureSelector<CoreState>('core');
export const getUserStateFn = (state: CoreState) => state.user;
export const getVersionStateFn = (state: CoreState) => state.version;
export const getConfigStateFn = (state: CoreState) => state.config;
export const getLocationStateFn = (state: CoreState) => state.location;

export const getUserState = createSelector(getCoreFeature, getUserStateFn);
export const getUser = createSelector(getUserState, fromUser.getUser);
export const isFetching = createSelector(getUserState, fromUser.isFetching);
export const getUserError = createSelector(getUserState, fromUser.getError);

export const getVersionState = createSelector(getCoreFeature, getVersionStateFn);
export const getVersionInfo = createSelector(getVersionState, fromVersion.getVersionInfo);
export const getVersionLoading = createSelector(getVersionState, fromVersion.getVersionIsLoading);
export const getVersionError = createSelector(getVersionState, fromVersion.getVersionError);

export const filterRolesFn = (roles: string[]) => roles.filter(r => r !== 'ROLE_NONE');
export const isUserAdminFn = (user) => user ? user.role === 'ROLE_ADMIN' : false;

export const getConfigState = createSelector(getCoreFeature, getConfigStateFn);
export const getRoles = createSelector(getConfigState, fromConfig.getRoles);

export const getUserRoles = createSelector(getRoles, filterRolesFn);
export const getCurrentUserRole = createSelector(getUser, u => u ? u.role : null);

export const isCurrentUserAdmin = createSelector(getUser, isUserAdminFn);

export const getLocationState = createSelector(getCoreFeature, getLocationStateFn);
export const getLocationTitle = createSelector(getLocationState, fromLocation.getTitle);
