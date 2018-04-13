import { Action } from '@ngrx/store';
import { MetadataFilter } from '../../domain/model/metadata-filter';

export const FIND = '[Metadata Filter] Find';
export const SELECT = '[Metadata Filter] Select';
export const SELECT_FILTER_SUCCESS = '[Metadata Filter] Select Success';
export const SELECT_FILTER_FAIL = '[Metadata Filter] Select Fail';

export const UPDATE_FILTER_REQUEST = '[Metadata Filter] Update Request';
export const UPDATE_FILTER_SUCCESS = '[Metadata Filter] Update Success';
export const UPDATE_FILTER_FAIL = '[Metadata Filter] Update Fail';

export const LOAD_FILTER_REQUEST = '[Metadata Filter Collection] Filter REQUEST';
export const LOAD_FILTER_SUCCESS = '[Metadata Filter Collection] Filter SUCCESS';
export const LOAD_FILTER_ERROR = '[Metadata Filter Collection] Filter ERROR';
export const ADD_FILTER = '[Metadata Filter Collection] Add Filter';
export const ADD_FILTER_SUCCESS = '[Metadata Filter Collection] Add Filter Success';
export const ADD_FILTER_FAIL = '[Metadata Filter Collection] Add Filter Fail';
export const REMOVE_FILTER = '[Metadata Filter Collection] Remove Filter';
export const REMOVE_FILTER_SUCCESS = '[Metadata Filter Collection] Remove Filter Success';
export const REMOVE_FILTER_FAIL = '[Metadata Filter Collection] Remove Filter Fail';

export class FindFilter implements Action {
    readonly type = FIND;

    constructor(public payload: string) { }
}

export class SelectFilter implements Action {
    readonly type = SELECT;

    constructor(public payload: string) { }
}

export class SelectFilterSuccess implements Action {
    readonly type = SELECT_FILTER_SUCCESS;

    constructor(public payload: MetadataFilter) { }
}

export class SelectFilterFail implements Action {
    readonly type = SELECT_FILTER_FAIL;

    constructor(public payload: Error) { }
}

export class LoadFilterRequest implements Action {
    readonly type = LOAD_FILTER_REQUEST;

    constructor() { }
}

export class LoadFilterSuccess implements Action {
    readonly type = LOAD_FILTER_SUCCESS;

    constructor(public payload: MetadataFilter[]) { }
}

export class LoadFilterError implements Action {
    readonly type = LOAD_FILTER_ERROR;

    constructor(public payload: any) { }
}

export class UpdateFilterRequest implements Action {
    readonly type = UPDATE_FILTER_REQUEST;

    constructor(public payload: MetadataFilter) { }
}

export class UpdateFilterSuccess implements Action {
    readonly type = UPDATE_FILTER_SUCCESS;

    constructor(public payload: MetadataFilter) { }
}

export class UpdateFilterFail implements Action {
    readonly type = UPDATE_FILTER_FAIL;

    constructor(public err: any) { }
}

export class AddFilterRequest implements Action {
    readonly type = ADD_FILTER;

    constructor(public payload: MetadataFilter) { }
}

export class AddFilterSuccess implements Action {
    readonly type = ADD_FILTER_SUCCESS;

    constructor(public payload: MetadataFilter) { }
}

export class AddFilterFail implements Action {
    readonly type = ADD_FILTER_FAIL;

    constructor(public payload: any) { }
}

export class RemoveFilterRequest implements Action {
    readonly type = REMOVE_FILTER;

    constructor(public payload: MetadataFilter) { }
}

export class RemoveFilterSuccess implements Action {
    readonly type = REMOVE_FILTER_SUCCESS;

    constructor(public payload: MetadataFilter) { }
}

export class RemoveFilterFail implements Action {
    readonly type = REMOVE_FILTER_FAIL;

    constructor(public payload: MetadataFilter) { }
}

export type Actions =
    | LoadFilterRequest
    | LoadFilterSuccess
    | LoadFilterError
    | AddFilterRequest
    | AddFilterSuccess
    | AddFilterFail
    | RemoveFilterRequest
    | RemoveFilterSuccess
    | RemoveFilterFail
    | FindFilter
    | SelectFilter
    | SelectFilterSuccess
    | SelectFilterFail
    | UpdateFilterRequest
    | UpdateFilterSuccess
    | UpdateFilterFail;
