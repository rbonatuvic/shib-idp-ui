import { Action } from '@ngrx/store';

import { QueryParams } from '../../core/model/query';
import { MetadataProvider } from '../../metadata-provider/model/metadata-provider';

export const QUERY_ENTITY_IDS = '[Filter] Query Entity Ids';
export const VIEW_MORE_IDS = '[Filter] View More Ids Modal';
export const CANCEL_VIEW_MORE = '[Filter] Cancel View More';
export const SELECT_ID = '[Filter] Select Entity ID';
export const LOAD_ENTITY_IDS_SUCCESS = '[Entity ID Collection] Load Entity Ids Success';
export const LOAD_ENTITY_IDS_ERROR = '[Entity ID Collection] Load Entity Ids Error';

export const CREATE_FILTER = '[Filter] Create Filter';
export const UPDATE_FILTER = '[Filter] Update Filter';
export const SAVE_FILTER = '[Filter] Save Filter';
export const SAVE_FILTER_SUCCESS = '[Filter] Save Filter Success';
export const SAVE_FILTER_ERROR = '[Filter] Save Filter Error';
export const CANCEL_CREATE_FILTER = '[Filter] Cancel Create Filter';

export class QueryEntityIds implements Action {
    readonly type = QUERY_ENTITY_IDS;

    constructor(public payload: QueryParams) { }
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

export class CreateFilter implements Action {
    readonly type = CREATE_FILTER;

    constructor(public payload: MetadataProvider) { }
}

export class UpdateFilter implements Action {
    readonly type = UPDATE_FILTER;

    constructor(public payload: Partial<MetadataProvider>) { }
}

export class SaveFilter implements Action {
    readonly type = SAVE_FILTER;

    constructor(public payload: Partial<MetadataProvider>) { }
}

export class SaveFilterSuccess implements Action {
    readonly type = SAVE_FILTER_SUCCESS;

    constructor(public payload: MetadataProvider) { }
}

export class SaveFilterError implements Action {
    readonly type = SAVE_FILTER_ERROR;

    constructor(public payload: Error) { }
}

export class CancelCreateFilter implements Action {
    readonly type = CANCEL_CREATE_FILTER;
}

export type Actions =
    | ViewMoreIds
    | CancelViewMore
    | SelectId
    | LoadEntityIdsSuccess
    | LoadEntityIdsError
    | QueryEntityIds
    | CreateFilter
    | UpdateFilter
    | SaveFilter
    | SaveFilterSuccess
    | SaveFilterError
    | CancelCreateFilter;
