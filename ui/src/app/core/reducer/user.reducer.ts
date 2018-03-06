import { createSelector, createFeatureSelector } from '@ngrx/store';
import { User } from '../model/user';
import * as user from '../action/user.action';
import * as fromRoot from '../../core/reducer';

export interface UserState {
    fetching: boolean;
    user: User | null;
    error: {
        type: string,
        message: string
    };
}

export const initialState: UserState = {
    fetching: false,
    user: null,
    error: null
};

export function reducer(state = initialState, action: user.Actions): UserState {
    switch (action.type) {
        case user.USER_LOAD_REQUEST: {
            return Object.assign({}, state, {
                fetching: true
            });
        }
        case user.USER_LOAD_SUCCESS: {
            return Object.assign({}, state, {
                fetching: false,
                user: action.payload
            });
        }
        case user.USER_LOAD_ERROR: {
            return Object.assign({}, state, {
                fetching: false,
                user: null,
                error: action.payload
            });
        }
        default: {
            return state;
        }
    }
}


export const getUser = (state: UserState) => state.user;
export const getError = (state: UserState) => state.error;
export const isFetching = (state: UserState) => state.fetching;
