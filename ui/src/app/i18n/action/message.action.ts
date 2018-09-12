import { Action } from '@ngrx/store';

export enum MessagesActionTypes {
    MESSAGES_LOAD_REQUEST = '[Messages] Load REQUEST',
    MESSAGES_LOAD_SUCCESS = '[Messages] Load SUCCESS',
    MESSAGES_LOAD_ERROR = '[Messages] Load ERROR',

    SET_LOCALE = '[Messages] Set Locale'
}

export class MessagesLoadRequestAction implements Action {
    readonly type = MessagesActionTypes.MESSAGES_LOAD_REQUEST;

    constructor() { }
}

export class MessagesLoadSuccessAction implements Action {
    readonly type = MessagesActionTypes.MESSAGES_LOAD_SUCCESS;

    constructor(public payload: any) { }
}

export class MessagesLoadErrorAction implements Action {
    readonly type = MessagesActionTypes.MESSAGES_LOAD_ERROR;

    constructor(public payload: { message: string, type: string }) { }
}

export class SetLocale implements Action {
    readonly type = MessagesActionTypes.SET_LOCALE;

    constructor(public payload: string) {}
}

export type Actions =
    | MessagesLoadRequestAction
    | MessagesLoadSuccessAction
    | MessagesLoadErrorAction
    | SetLocale;
