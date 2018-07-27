import { Action } from '@ngrx/store';

export enum EditorActionTypes {
    UPDATE_STATUS = '[Provider Editor] Update Status',
    LOAD_SCHEMA_REQUEST = '[Provider Editor] Load Schema Request',
    LOAD_SCHEMA_SUCCESS = '[Provider Editor] Load Schema Success',
    LOAD_SCHEMA_FAIL = '[Provider Editor] Load Schema Fail',

    SELECT_PROVIDER_TYPE = '[Provider Editor] Select Provider Type',

    CLEAR = '[Provider Editor] Clear',

    LOCK = '[Provider Editor] Lock',
    UNLOCK = '[Provider Editor] Unlock'
}

export class UpdateStatus implements Action {
    readonly type = EditorActionTypes.UPDATE_STATUS;

    constructor(public payload: { [key: string]: string }) { }
}

export class LoadSchemaRequest implements Action {
    readonly type = EditorActionTypes.LOAD_SCHEMA_REQUEST;

    constructor(public payload: string) { }
}

export class LoadSchemaSuccess implements Action {
    readonly type = EditorActionTypes.LOAD_SCHEMA_SUCCESS;

    constructor(public payload: any) { }
}

export class LoadSchemaFail implements Action {
    readonly type = EditorActionTypes.LOAD_SCHEMA_FAIL;

    constructor(public payload: Error) { }
}

export class SelectProviderType implements Action {
    readonly type = EditorActionTypes.SELECT_PROVIDER_TYPE;

    constructor(public payload: string) { }
}

export class ClearEditor implements Action {
    readonly type = EditorActionTypes.CLEAR;
}

export class LockEditor implements Action {
    readonly type = EditorActionTypes.LOCK;
}

export class UnlockEditor implements Action {
    readonly type = EditorActionTypes.UNLOCK;
}

export type EditorActionUnion =
    | UpdateStatus
    | LoadSchemaRequest
    | LoadSchemaSuccess
    | LoadSchemaFail
    | SelectProviderType
    | ClearEditor
    | LockEditor
    | UnlockEditor;
