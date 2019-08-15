import { Action } from '@ngrx/store';
import { Metadata } from '../../domain/domain.type';
import { VersionRequest } from '../model/request';

export enum RestoreActionTypes {
    RESTORE_VERSION_REQUEST = '[Restore Version] Restore Version Request',
    RESTORE_VERSION_SUCCESS = '[Restore Version] Restore Version Success',
    RESTORE_VERSION_ERROR = '[Restore Version] Restore Version Error',

    UPDATE_RESTORATION_REQUEST = '[Restore Version] Update Changes Request',
    UPDATE_RESTORATION_SUCCESS = '[Restore Version] Update Changes Success',

    CLEAR_VERSION = '[Restore Version] Clear Versions',
    CANCEL_RESTORE = '[Restore Version] Cancel Restore'
}

export class RestoreVersionRequest implements Action {
    readonly type = RestoreActionTypes.RESTORE_VERSION_REQUEST;
    constructor() { }
}

export class RestoreVersionSuccess implements Action {
    readonly type = RestoreActionTypes.RESTORE_VERSION_SUCCESS;
    constructor(public payload: { id: string, type: string, model: Metadata }) { }
}

export class RestoreVersionError implements Action {
    readonly type = RestoreActionTypes.RESTORE_VERSION_ERROR;
    constructor(public payload: any) { }
}

export class UpdateRestorationChangesRequest implements Action {
    readonly type = RestoreActionTypes.UPDATE_RESTORATION_REQUEST;
    constructor(public payload: any) { }
}

export class UpdateRestorationChangesSuccess implements Action {
    readonly type = RestoreActionTypes.UPDATE_RESTORATION_SUCCESS;
    constructor(public payload: any) { }
}

export class CancelRestore implements Action {
    readonly type = RestoreActionTypes.CANCEL_RESTORE;
    constructor() { }
}

export type RestoreActionsUnion =
    | RestoreVersionRequest
    | RestoreVersionSuccess
    | RestoreVersionError
    | UpdateRestorationChangesRequest
    | UpdateRestorationChangesSuccess
    | CancelRestore;
