import { Action } from '@ngrx/store';
import { Notification } from '../model/notification';

export const ADD_NOTIFICATION = '[Notification] Add Notification';
export const CLEAR_NOTIFICATION = '[Metadata Draft] Clear Notification';

export class AddNotification implements Action {
    readonly type = ADD_NOTIFICATION;

    constructor(public payload: Notification) { }
}

export class ClearNotification implements Action {
    readonly type = CLEAR_NOTIFICATION;

    constructor(public payload: Notification) { }
}

export type Actions =
    | AddNotification
    | ClearNotification;
