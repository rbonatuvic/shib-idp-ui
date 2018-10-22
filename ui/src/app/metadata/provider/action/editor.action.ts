import { Action } from '@ngrx/store';

export enum EditorActionTypes {
    UPDATE_STATUS = '[Provider Editor] Update Status',
    SELECT_PROVIDER_TYPE = '[Provider Editor] Select Provider Type',
    CLEAR = '[Provider Editor] Clear'
}

export class UpdateStatus implements Action {
    readonly type = EditorActionTypes.UPDATE_STATUS;

    constructor(public payload: { [key: string]: string }) { }
}

export class SelectProviderType implements Action {
    readonly type = EditorActionTypes.SELECT_PROVIDER_TYPE;

    constructor(public payload: string) { }
}

export class ClearEditor implements Action {
    readonly type = EditorActionTypes.CLEAR;
}

export type EditorActionUnion =
    | UpdateStatus
    | SelectProviderType
    | ClearEditor;
