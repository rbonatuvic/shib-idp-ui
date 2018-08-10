import { Action } from '@ngrx/store';
import { MetadataFilter } from '../../domain/model/metadata-filter';
import { Update } from '@ngrx/entity';

export enum FilterCollectionActionTypes {
    SELECT_FILTER_REQUEST = '[Metadata Filter Collection] Select Filter Request',
    SELECT_FILTER_SUCCESS = '[Metadata Filter Collection] Select Filter Success',
    SELECT_FILTER_FAIL = '[Metadata Filter Collection] Select Filter Fail',

    UPDATE_FILTER_REQUEST = '[Metadata Filter Collection] Update Filter Request',
    UPDATE_FILTER_SUCCESS = '[Metadata Filter Collection] Update Filter Success',
    UPDATE_FILTER_FAIL = '[Metadata Filter Collection] Update Filter Fail',

    LOAD_FILTER_REQUEST = '[Metadata Filter Collection] Load Filter Request',
    LOAD_FILTER_SUCCESS = '[Metadata Filter Collection] Load Filter Success',
    LOAD_FILTER_ERROR = '[Metadata Filter Collection] Load Filter Error',

    ADD_FILTER_REQUEST = '[Metadata Filter Collection] Add Filter Request',
    ADD_FILTER_SUCCESS = '[Metadata Filter Collection] Add Filter Success',
    ADD_FILTER_FAIL = '[Metadata Filter Collection] Add Filter Fail',

    REMOVE_FILTER_REQUEST = '[Metadata Filter Collection] Remove Filter Request',
    REMOVE_FILTER_SUCCESS = '[Metadata Filter Collection] Remove Filter Success',
    REMOVE_FILTER_FAIL = '[Metadata Filter Collection] Remove Filter Fail'
}

export class SelectFilter implements Action {
    readonly type = FilterCollectionActionTypes.SELECT_FILTER_REQUEST;

    constructor(public payload: string) { }
}

export class SelectFilterSuccess implements Action {
    readonly type = FilterCollectionActionTypes.SELECT_FILTER_SUCCESS;

    constructor(public payload: MetadataFilter) { }
}

export class SelectFilterFail implements Action {
    readonly type = FilterCollectionActionTypes.SELECT_FILTER_FAIL;

    constructor(public payload: Error) { }
}

export class LoadFilterRequest implements Action {
    readonly type = FilterCollectionActionTypes.LOAD_FILTER_REQUEST;

    constructor(public payload: string) { }
}

export class LoadFilterSuccess implements Action {
    readonly type = FilterCollectionActionTypes.LOAD_FILTER_SUCCESS;

    constructor(public payload: MetadataFilter[]) { }
}

export class LoadFilterError implements Action {
    readonly type = FilterCollectionActionTypes.LOAD_FILTER_ERROR;

    constructor(public payload: any) { }
}

export class UpdateFilterRequest implements Action {
    readonly type = FilterCollectionActionTypes.UPDATE_FILTER_REQUEST;

    constructor(public payload: MetadataFilter) { }
}

export class UpdateFilterSuccess implements Action {
    readonly type = FilterCollectionActionTypes.UPDATE_FILTER_SUCCESS;

    constructor(public payload: Update<MetadataFilter>) { }
}

export class UpdateFilterFail implements Action {
    readonly type = FilterCollectionActionTypes.UPDATE_FILTER_FAIL;

    constructor(public payload: MetadataFilter) { }
}

export class AddFilterRequest implements Action {
    readonly type = FilterCollectionActionTypes.ADD_FILTER_REQUEST;

    constructor(public payload: MetadataFilter) { }
}

export class AddFilterSuccess implements Action {
    readonly type = FilterCollectionActionTypes.ADD_FILTER_SUCCESS;

    constructor(public payload: MetadataFilter) { }
}

export class AddFilterFail implements Action {
    readonly type = FilterCollectionActionTypes.ADD_FILTER_FAIL;

    constructor(public payload: any) { }
}

export class RemoveFilterRequest implements Action {
    readonly type = FilterCollectionActionTypes.REMOVE_FILTER_REQUEST;

    constructor(public payload: MetadataFilter) { }
}

export class RemoveFilterSuccess implements Action {
    readonly type = FilterCollectionActionTypes.REMOVE_FILTER_SUCCESS;

    constructor(public payload: MetadataFilter) { }
}

export class RemoveFilterFail implements Action {
    readonly type = FilterCollectionActionTypes.REMOVE_FILTER_FAIL;

    constructor(public payload: MetadataFilter) { }
}

export type FilterCollectionActionsUnion =
    | LoadFilterRequest
    | LoadFilterSuccess
    | LoadFilterError
    | AddFilterRequest
    | AddFilterSuccess
    | AddFilterFail
    | RemoveFilterRequest
    | RemoveFilterSuccess
    | RemoveFilterFail
    | SelectFilter
    | SelectFilterSuccess
    | SelectFilterFail
    | UpdateFilterRequest
    | UpdateFilterSuccess
    | UpdateFilterFail;
