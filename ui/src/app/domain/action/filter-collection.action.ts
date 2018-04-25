import { Action } from '@ngrx/store';
import { MetadataFilter } from '../../domain/model/metadata-filter';
import { Update } from '@ngrx/entity';

export enum FilterCollectionActionTypes {
    FIND = '[Metadata Filter] Find',
    SELECT = '[Metadata Filter] Select',
    SELECT_FILTER_SUCCESS = '[Metadata Filter] Select Success',
    SELECT_FILTER_FAIL = '[Metadata Filter] Select Fail',

    UPDATE_FILTER_REQUEST = '[Metadata Filter] Update Request',
    UPDATE_FILTER_SUCCESS = '[Metadata Filter] Update Success',
    UPDATE_FILTER_FAIL = '[Metadata Filter] Update Fail',

    LOAD_FILTER_REQUEST = '[Metadata Filter Collection] Filter REQUEST',
    LOAD_FILTER_SUCCESS = '[Metadata Filter Collection] Filter SUCCESS',
    LOAD_FILTER_ERROR = '[Metadata Filter Collection] Filter ERROR',
    ADD_FILTER = '[Metadata Filter Collection] Add Filter',
    ADD_FILTER_SUCCESS = '[Metadata Filter Collection] Add Filter Success',
    ADD_FILTER_FAIL = '[Metadata Filter Collection] Add Filter Fail',
    REMOVE_FILTER = '[Metadata Filter Collection] Remove Filter',
    REMOVE_FILTER_SUCCESS = '[Metadata Filter Collection] Remove Filter Success',
    REMOVE_FILTER_FAIL = '[Metadata Filter Collection] Remove Filter Fail'
}


export class FindFilter implements Action {
    readonly type = FilterCollectionActionTypes.FIND;

    constructor(public payload: string) { }
}

export class SelectFilter implements Action {
    readonly type = FilterCollectionActionTypes.SELECT;

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

    constructor() { }
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

    constructor(public err: any) { }
}

export class AddFilterRequest implements Action {
    readonly type = FilterCollectionActionTypes.ADD_FILTER;

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
    readonly type = FilterCollectionActionTypes.REMOVE_FILTER;

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
    | FindFilter
    | SelectFilter
    | SelectFilterSuccess
    | SelectFilterFail
    | UpdateFilterRequest
    | UpdateFilterSuccess
    | UpdateFilterFail;
