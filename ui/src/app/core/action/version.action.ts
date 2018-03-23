import { Action } from '@ngrx/store';

import { VersionInfo } from '../model/version';

export const VERSION_LOAD_REQUEST = '[Version] Load REQUEST';
export const VERSION_LOAD_SUCCESS = '[Version] Load SUCCESS';
export const VERSION_LOAD_ERROR = '[Version] Load ERROR';

/**
 * Add User to Collection Actions
 */
export class VersionInfoLoadRequestAction implements Action {
    readonly type = VERSION_LOAD_REQUEST;
}

export class VersionInfoLoadSuccessAction implements Action {
    readonly type = VERSION_LOAD_SUCCESS;

    constructor (public payload: VersionInfo) { }
}

export class VersionInfoLoadErrorAction implements Action {
    readonly type = VERSION_LOAD_ERROR;

    constructor(public payload: Error) { }
}

export type Actions =
    | VersionInfoLoadRequestAction
    | VersionInfoLoadSuccessAction
    | VersionInfoLoadErrorAction;
