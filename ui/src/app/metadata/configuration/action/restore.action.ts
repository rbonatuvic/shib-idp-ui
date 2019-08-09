import { Action } from '@ngrx/store';
import { Metadata } from '../../domain/domain.type';

export enum RestoreActionTypes {
    SELECT_VERSION_SUCCESS = '[Restore Version] Select Version Success',
    SELECT_VERSION_ERROR = '[Restore Version] Select Version Error',
    SELECT_VERSION_REQUEST = '[Restore Version] Select Version Request',
    CLEAR_VERSION = '[Restore Version] Clear Versions'
}

export class SelectVersionRestoreRequest implements Action {
    readonly type = RestoreActionTypes.SELECT_VERSION_REQUEST;

    constructor(public payload: { type: string, id: string, version: string }) { }
}

export class SelectVersionRestoreSuccess implements Action {
    readonly type = RestoreActionTypes.SELECT_VERSION_SUCCESS;

    constructor(public payload: Metadata) { }
}
export class SelectVersionRestoreError implements Action {
    readonly type = RestoreActionTypes.SELECT_VERSION_ERROR;

    constructor(public payload: any) { }
}

export class ClearVersionRestore implements Action {
    readonly type = RestoreActionTypes.CLEAR_VERSION;
}

export type RestoreActionsUnion =
    | SelectVersionRestoreRequest
    | SelectVersionRestoreError
    | SelectVersionRestoreSuccess
    | ClearVersionRestore;
