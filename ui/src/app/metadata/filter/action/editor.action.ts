import { Action } from '@ngrx/store';

export enum EditorActionTypes {
    UPDATE_STATUS = '[Filter Editor] Update Status',
    CLEAR = '[Filter Editor] Clear'
}

export class UpdateStatus implements Action {
    readonly type = EditorActionTypes.UPDATE_STATUS;

    constructor(public payload: { [key: string]: string }) { }
}

export class ClearEditor implements Action {
    readonly type = EditorActionTypes.CLEAR;
}

export type EditorActionUnion =
    | UpdateStatus
    | ClearEditor;
