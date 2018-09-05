import {
    ActionReducerMap,
    createSelector,
    createFeatureSelector,
    createSelectorFactory,
    ActionReducer,
    MetaReducer,
    combineReducers
} from '@ngrx/store';

import * as fromUser from './user.reducer';
import * as fromVersion from './version.reducer';
import * as fromMessages from './message.reducer';
import * as fromRoot from '../../app.reducer';

export interface CoreState {
    user: fromUser.UserState;
    version: fromVersion.VersionState;
    messages: fromMessages.MessageState;
}

export interface State extends fromRoot.State {
    core: CoreState;
}

export const reducers = {
    user: fromUser.reducer,
    version: fromVersion.reducer,
    messages: fromMessages.reducer
};

export const getCoreFeature = createFeatureSelector<CoreState>('core');
export const getUserStateFn = (state: CoreState) => state.user;
export const getVersionStateFn = (state: CoreState) => state.version;
export const getMessageStateFn = (state: CoreState) => state.messages;

export const getUserState = createSelector(getCoreFeature, getUserStateFn);
export const getUser = createSelector(getUserState, fromUser.getUser);
export const isFetching = createSelector(getUserState, fromUser.isFetching);
export const getUserError = createSelector(getUserState, fromUser.getError);

export const getVersionState = createSelector(getCoreFeature, (state: CoreState) => state.version);
export const getVersionInfo = createSelector(getVersionState, fromVersion.getVersionInfo);
export const getVersionLoading = createSelector(getVersionState, fromVersion.getVersionIsLoading);
export const getVersionError = createSelector(getVersionState, fromVersion.getVersionError);

export const getMessageState = createSelector(getCoreFeature, getMessageStateFn);
export const getLanguage = createSelector(getMessageState, fromMessages.getLanguage);
export const getMessages = createSelector(getMessageState, fromMessages.getMessages);
export const getFetchingMessages = createSelector(getMessageState, fromMessages.isFetching);
