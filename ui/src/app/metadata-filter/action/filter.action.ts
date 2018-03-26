import { Action } from '@ngrx/store';

import { QueryParams } from '../../core/model/query';

export const QUERY_ENTITY_IDS = '[Filter] Query Entity Ids';
export const VIEW_MORE_IDS = '[Filter] View More Ids Modal';
export const CANCEL_VIEW_MORE = '[Filter] Cancel View More';
export const SELECT_ID = '[Filter] Select Entity ID';
export const CANCEL_CREATE_FILTER = '[Filter] Cancel Create Filter';
export const LOAD_ENTITY_IDS_SUCCESS = '[Entity ID Collection] Load Entity Ids Success';
export const LOAD_ENTITY_IDS_ERROR = '[Entity ID Collection] Load Entity Ids Error';

export class QueryEntityIds implements Action {
    readonly type = QUERY_ENTITY_IDS;

    constructor(public payload: QueryParams) { }
}

export class CancelCreateFilter implements Action {
    readonly type = CANCEL_CREATE_FILTER;
}

export class ViewMoreIds implements Action {
    readonly type = VIEW_MORE_IDS;

    constructor(public payload: string) {  }
}

export class CancelViewMore implements Action {
    readonly type = CANCEL_VIEW_MORE;
}

export class SelectId implements Action {
    readonly type = SELECT_ID;

    constructor(public payload: string) { }
}

export class LoadEntityIdsSuccess implements Action {
    readonly type = LOAD_ENTITY_IDS_SUCCESS;

    constructor(public payload: string[]) { }
}

export class LoadEntityIdsError implements Action {
    readonly type = LOAD_ENTITY_IDS_ERROR;

    constructor(public payload: Error) { }
}

export type Actions =
    | ViewMoreIds
    | CancelViewMore
    | CancelCreateFilter
    | SelectId
    | LoadEntityIdsSuccess
    | LoadEntityIdsError
    | QueryEntityIds;
