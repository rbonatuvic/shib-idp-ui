import { Action } from '@ngrx/store';
import { MetadataHistory } from '../model/history';
import { MetadataVersion } from '../model/version';
import { Metadata } from '../../domain/domain.type';

export enum CompareActionTypes {
    COMPARE_METADATA_REQUEST = '[Compare Version] Compare Version Request',
    COMPARE_METADATA_SUCCESS = '[Compare Version] Compare Version Success',
    COMPARE_METADATA_ERROR = '[Compare Version] Compare Version Error',
    SET_VERSIONS = '[Compare Version] Set Versions',
    CLEAR_VERSIONS = '[Compare Version] Clear Versions'
}

export class CompareVersionRequest implements Action {
    readonly type = CompareActionTypes.COMPARE_METADATA_REQUEST;

    constructor(public payload: string[]) { }
}

export class CompareVersionSuccess implements Action {
    readonly type = CompareActionTypes.COMPARE_METADATA_SUCCESS;

    constructor(public payload: Metadata[]) { }
}

export class CompareVersionError implements Action {
    readonly type = CompareActionTypes.COMPARE_METADATA_ERROR;

    constructor(public payload: any) { }
}

export class SetMetadataVersions implements Action {
    readonly type = CompareActionTypes.SET_VERSIONS;

    constructor(public payload: Metadata[]) { }
}

export class ClearVersions implements Action {
    readonly type = CompareActionTypes.CLEAR_VERSIONS;
}

export type CompareActionsUnion =
    | CompareVersionRequest
    | CompareVersionSuccess
    | CompareVersionError
    | SetMetadataVersions
    | ClearVersions;
