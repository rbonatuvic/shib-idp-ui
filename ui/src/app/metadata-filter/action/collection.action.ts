import { Action } from '@ngrx/store';

export const CANCEL_CREATE_FILTER = '[Filter Collection] Cancel Create Filter';

export class CancelCreateFilter implements Action {
    readonly type = CANCEL_CREATE_FILTER;

    constructor(public payload: boolean) { }
}

/*
export class SaveChanges implements Action {
    readonly type = SAVE_CHANGES;

    constructor(public payload: MetadataProvider) { }
}
*/

export type Actions =
    | CancelCreateFilter;
