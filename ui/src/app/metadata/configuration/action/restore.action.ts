import { Action } from '@ngrx/store';
import { Metadata } from '../../domain/domain.type';
import { VersionRequest } from '../model/request';

export enum RestoreActionTypes {
    RESTORE_VERSION_REQUEST = '[Restore Version] Restore Version Request',
    RESTORE_VERSION_SUCCESS = '[Restore Version] Restore Version Success',
    RESTORE_VERSION_ERROR = '[Restore Version] Restore Version Error',

    UPDATE_RESTORATION_REQUEST = '[Restore Version] Update Changes Request',
    UPDATE_RESTORATION_SUCCESS = '[Restore Version] Update Changes Success',

    UPDATE_STATUS = '[Restore Version] Update Restore Form Status',
    SET_SAVING_STATUS = '[Restore Version] Set Saving Status',

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
    constructor(public payload: Partial<Metadata>) { }
}

export class UpdateRestorationChangesSuccess implements Action {
    readonly type = RestoreActionTypes.UPDATE_RESTORATION_SUCCESS;
    constructor(public payload: Partial<Metadata>) { }
}

export class UpdateRestoreFormStatus implements Action {
    readonly type = RestoreActionTypes.UPDATE_STATUS;

    constructor(public payload: { [key: string]: string }) { }
}

export class SetSavingStatus implements Action {
    readonly type = RestoreActionTypes.SET_SAVING_STATUS;

    constructor(public payload: boolean) { }
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
    | UpdateRestoreFormStatus
    | SetSavingStatus
    | CancelRestore;
