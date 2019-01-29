import { Action } from '@ngrx/store';
import { User } from '../model/user';


export enum CurrentUserActionTypes {
    USER_LOAD_REQUEST = '[Current User] Load User Request',
    USER_LOAD_SUCCESS = '[Current User] Load User Success',
    USER_LOAD_ERROR = '[Current User] Load User Fail',
    REDIRECT = '[Current User] Redirect'
}

/**
 * Add User to Collection Actions
 */
export class UserLoadRequestAction implements Action {
    readonly type = CurrentUserActionTypes.USER_LOAD_REQUEST;

    constructor() { }
}

export class UserLoadSuccessAction implements Action {
    readonly type = CurrentUserActionTypes.USER_LOAD_SUCCESS;

    constructor(public payload: User) { }
}

export class UserLoadErrorAction implements Action {
    readonly type = CurrentUserActionTypes.USER_LOAD_ERROR;

    constructor(public payload: { message: string }) { }
}

export class UserRedirect implements Action {
    readonly type = CurrentUserActionTypes.REDIRECT;

    constructor(public payload: string) { }
}

export type CurrentUserActionsUnion =
    | UserLoadRequestAction
    | UserLoadSuccessAction
    | UserLoadErrorAction
    | UserRedirect;
