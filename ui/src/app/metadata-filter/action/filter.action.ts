import { Action } from '@ngrx/store';

export const QUERY_ENTITY_IDS = '[Filter] Query Entity Ids';

export class QueryEntityIds implements Action {
    readonly type = QUERY_ENTITY_IDS;

    constructor(public payload: string[]) { }
}

export type Actions =
    | QueryEntityIds;
