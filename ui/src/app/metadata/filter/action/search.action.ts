import { Action } from '@ngrx/store';

import { QueryParams } from '../../../core/model/query';

export enum SearchActionTypes {
    QUERY_ENTITY_IDS = '[Filter] Query Entity Ids',
    VIEW_MORE_IDS = '[Filter] View More Ids Modal',
    CANCEL_VIEW_MORE = '[Filter] Cancel View More',
    CLEAR_SEARCH = '[Filter] Clear Search',
    LOAD_ENTITY_IDS_SUCCESS = '[Entity ID Collection] Load Entity Ids Success',
    LOAD_ENTITY_IDS_ERROR = '[Entity ID Collection] Load Entity Ids Error'
}

export class QueryEntityIds implements Action {
    readonly type = SearchActionTypes.QUERY_ENTITY_IDS;

    constructor(public payload: QueryParams) { }
}

export class ViewMoreIds implements Action {
    readonly type = SearchActionTypes.VIEW_MORE_IDS;

    constructor(public payload: string) { }
}

export class ClearSearch implements Action {
    readonly type = SearchActionTypes.CLEAR_SEARCH;
}

export class CancelViewMore implements Action {
    readonly type = SearchActionTypes.CANCEL_VIEW_MORE;
}

export class LoadEntityIdsSuccess implements Action {
    readonly type = SearchActionTypes.LOAD_ENTITY_IDS_SUCCESS;

    constructor(public payload: string[]) { }
}

export class LoadEntityIdsError implements Action {
    readonly type = SearchActionTypes.LOAD_ENTITY_IDS_ERROR;

    constructor(public payload: Error) { }
}

export type SearchActionsUnion =
    | ViewMoreIds
    | CancelViewMore
    | ClearSearch
    | LoadEntityIdsSuccess
    | LoadEntityIdsError
    | QueryEntityIds;
