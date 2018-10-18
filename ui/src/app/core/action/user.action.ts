import { Action } from '@ngrx/store';
import { User } from '../model/user';

export const USER_LOAD_REQUEST = '[Auth] User REQUEST';
export const USER_LOAD_SUCCESS = '[Auth] User SUCCESS';
export const USER_LOAD_ERROR = '[Auth] User ERROR';
export const REDIRECT = '[Auth] User Redirect';

/**
 * Add User to Collection Actions
 */
export class UserLoadRequestAction implements Action {
    readonly type = USER_LOAD_REQUEST;

    constructor() { }
}

export class UserLoadSuccessAction implements Action {
    readonly type = USER_LOAD_SUCCESS;

    constructor(public payload: User) { }
}

export class UserLoadErrorAction implements Action {
    readonly type = USER_LOAD_ERROR;

    constructor(public payload: { message: string }) { }
}

export class UserRedirect implements Action {
    readonly type = REDIRECT;

    constructor(public payload: string) { }
}

export type Actions =
    | UserLoadRequestAction
    | UserLoadSuccessAction
    | UserLoadErrorAction
    | UserRedirect;
