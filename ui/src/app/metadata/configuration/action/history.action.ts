import { Action } from '@ngrx/store';
import { MetadataHistory } from '../model/history';

export enum HistoryActionTypes {
    LOAD_HISTORY_REQUEST = '[Configuration History] Load History Request',
    LOAD_HISTORY_SUCCESS = '[Configuration History] Load History Success',
    LOAD_HISTORY_ERROR = '[Configuration History] Load History Error',
    SET_HISTORY = '[Configuration History] Set History',
    CLEAR_HISTORY = '[Configuration History] Clear History',
    SELECT_VERSION = '[Configuration History] Select Version'
}

export class LoadHistoryRequest implements Action {
    readonly type = HistoryActionTypes.LOAD_HISTORY_REQUEST;

    constructor(public payload: { id: string, type: string }) { }
}

export class LoadHistorySuccess implements Action {
    readonly type = HistoryActionTypes.LOAD_HISTORY_SUCCESS;

    constructor(public payload: MetadataHistory) { }
}

export class LoadHistoryError implements Action {
    readonly type = HistoryActionTypes.LOAD_HISTORY_ERROR;

    constructor(public payload: any) { }
}

export class SelectVersion implements Action {
    readonly type = HistoryActionTypes.SELECT_VERSION;
    constructor(public payload: string | null) { }
}

export class SetHistory implements Action {
    readonly type = HistoryActionTypes.SET_HISTORY;

    constructor(public payload: MetadataHistory) {}
}

export class ClearHistory implements Action {
    readonly type = HistoryActionTypes.CLEAR_HISTORY;
}

export type HistoryActionsUnion =
    | LoadHistoryRequest
    | LoadHistorySuccess
    | LoadHistoryError
    | SetHistory
    | ClearHistory
    | SelectVersion;
