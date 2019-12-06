import { Action } from '@ngrx/store';

export enum LocationActionTypes {
    SET_TITLE = '[Location] Set Title'
}

export class SetTitle implements Action {
    readonly type = LocationActionTypes.SET_TITLE;

    constructor(public payload: string) { }
}

export type LocationActionUnion =
    | SetTitle;
