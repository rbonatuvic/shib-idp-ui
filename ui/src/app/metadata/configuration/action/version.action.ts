import { Action } from '@ngrx/store';
import { Metadata } from '../../domain/domain.type';
import { VersionRequest } from '../model/request';

export enum VersionActionTypes {
    SELECT_VERSION_SUCCESS = '[Version] Select Version Success',
    SELECT_VERSION_ERROR = '[Version] Select Version Error',
    SELECT_VERSION_REQUEST = '[Version] Select Version Request',

    CLEAR_VERSION = '[Version] Clear Versions'
}

export class SelectVersionRequest implements Action {
    readonly type = VersionActionTypes.SELECT_VERSION_REQUEST;

    constructor(public payload: VersionRequest) { }
}

export class SelectVersionSuccess implements Action {
    readonly type = VersionActionTypes.SELECT_VERSION_SUCCESS;

    constructor(public payload: Metadata) { }
}
export class SelectVersionError implements Action {
    readonly type = VersionActionTypes.SELECT_VERSION_ERROR;

    constructor(public payload: any) { }
}

export class ClearVersion implements Action {
    readonly type = VersionActionTypes.CLEAR_VERSION;

    constructor() { }
}

export type VersionActionsUnion =
    | SelectVersionRequest
    | SelectVersionError
    | SelectVersionSuccess
    | ClearVersion;
