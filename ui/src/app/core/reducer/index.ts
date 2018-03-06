import {
    ActionReducerMap,
    createSelector,
    createFeatureSelector,
    ActionReducer,
    MetaReducer,
    combineReducers
} from '@ngrx/store';

import { routerReducer, RouterReducerState } from '@ngrx/router-store';
import * as fromRouter from '@ngrx/router-store';
import * as fromUser from './user.reducer';
import { RouterStateUrl } from '../../shared/util';

export interface State {
    routerReducer: fromRouter.RouterReducerState<RouterStateUrl>;
    user: fromUser.UserState;
}

export const reducers: ActionReducerMap<State> = {
    routerReducer: fromRouter.routerReducer,
    user: fromUser.reducer
};

export const getState = createFeatureSelector<State>('user');
export const getUserState = createSelector(getState, (state: State) => state.user);
export const getUser = createSelector(getUserState, fromUser.getUser);
export const isFetching = createSelector(getUserState, fromUser.isFetching);
export const getError = createSelector(getUserState, fromUser.getError);
