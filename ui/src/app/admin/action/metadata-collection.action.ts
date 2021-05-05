import { Action } from '@ngrx/store';
import { MetadataResolver } from '../../metadata/domain/model';
import { Update } from '@ngrx/entity';

export enum MetadataCollectionActionTypes {
    UPDATE_METADATA_REQUEST = '[Admin Metadata Collection] Update Request',
    UPDATE_METADATA_SUCCESS = '[Admin Metadata Collection] Update Success',
    UPDATE_METADATA_FAIL = '[Admin Metadata Collection] Update Fail',
    UPDATE_METADATA_CONFLICT = '[Admin Metadata Collection] Update Conflict',

    LOAD_METADATA_REQUEST = '[Admin Metadata Collection] Load Metadata REQUEST',
    LOAD_METADATA_SUCCESS = '[Admin Metadata Collection] Load Metadata SUCCESS',
    LOAD_METADATA_ERROR = '[Admin Metadata Collection] Load Metadata ERROR',

    REMOVE_METADATA = '[Admin Metadata Collection] Remove Metadata',
    REMOVE_METADATA_SUCCESS = '[Admin Metadata Collection] Remove Metadata Success',
    REMOVE_METADATA_FAIL = '[Admin Metadata Collection] Remove Metadata Fail',
}

export class LoadMetadataRequest implements Action {
    readonly type = MetadataCollectionActionTypes.LOAD_METADATA_REQUEST;

    constructor() { }
}

export class LoadMetadataSuccess implements Action {
    readonly type = MetadataCollectionActionTypes.LOAD_METADATA_SUCCESS;

    constructor(public payload: MetadataResolver[]) { }
}

export class LoadMetadataError implements Action {
    readonly type = MetadataCollectionActionTypes.LOAD_METADATA_ERROR;

    constructor(public payload: any) { }
}

export class UpdateMetadataRequest implements Action {
    readonly type = MetadataCollectionActionTypes.UPDATE_METADATA_REQUEST;

    constructor(public payload: MetadataResolver) { }
}

export class UpdateMetadataSuccess implements Action {
    readonly type = MetadataCollectionActionTypes.UPDATE_METADATA_SUCCESS;

    constructor(public payload: Update<MetadataResolver>) { }
}

export class UpdateMetadataFail implements Action {
    readonly type = MetadataCollectionActionTypes.UPDATE_METADATA_FAIL;

    constructor(public payload: any) { }
}

export class UpdateMetadataConflict implements Action {
    readonly type = MetadataCollectionActionTypes.UPDATE_METADATA_CONFLICT;

    constructor(public payload: MetadataResolver) { }
}

export class RemoveMetadataRequest implements Action {
    readonly type = MetadataCollectionActionTypes.REMOVE_METADATA;

    constructor(public payload: string) { }
}

export class RemoveMetadataSuccess implements Action {
    readonly type = MetadataCollectionActionTypes.REMOVE_METADATA_SUCCESS;

    constructor(public payload: string) { }
}

export class RemoveMetadataFail implements Action {
    readonly type = MetadataCollectionActionTypes.REMOVE_METADATA_FAIL;

    constructor(public payload: MetadataResolver) { }
}

export type MetadataCollectionActionsUnion =
    | LoadMetadataRequest
    | LoadMetadataSuccess
    | LoadMetadataError
    | RemoveMetadataRequest
    | RemoveMetadataSuccess
    | RemoveMetadataFail
    | UpdateMetadataRequest
    | UpdateMetadataSuccess
    | UpdateMetadataFail
    | UpdateMetadataConflict;
