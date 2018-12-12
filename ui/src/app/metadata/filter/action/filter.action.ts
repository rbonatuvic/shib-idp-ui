import { Action } from '@ngrx/store';
import { MetadataFilter } from '../../domain/model/metadata-filter';
import { MDUI } from '../../domain/model';

export enum FilterActionTypes {
    SELECT_ID = '[Filter] Select Entity ID',
    SELECT_FILTER_TYPE = '[Filter] Select Filter Type',
    UPDATE_FILTER = '[Filter] Update Filter',
    CANCEL_CREATE_FILTER = '[Filter] Cancel Create Filter',
    CLEAR_FILTER = '[Filter] Clear Filter',
    LOAD_ENTITY_PREVIEW = '[Filter] Load Preview data',
    LOAD_ENTITY_PREVIEW_SUCCESS = '[Filter] Load Preview data success',
    LOAD_ENTITY_PREVIEW_ERROR = '[Filter] Load Preview data error'
}

export class SelectId implements Action {
    readonly type = FilterActionTypes.SELECT_ID;

    constructor(public payload: string) { }
}

export class LoadEntityPreview implements Action {
    readonly type = FilterActionTypes.LOAD_ENTITY_PREVIEW;

    constructor(public payload: string) { }
}
export class LoadEntityPreviewSuccess implements Action {
    readonly type = FilterActionTypes.LOAD_ENTITY_PREVIEW_SUCCESS;

    constructor(public payload: MDUI) { }
}
export class LoadEntityPreviewError implements Action {
    readonly type = FilterActionTypes.LOAD_ENTITY_PREVIEW_ERROR;

    constructor(public payload: string) { }
}

export class CancelCreateFilter implements Action {
    readonly type = FilterActionTypes.CANCEL_CREATE_FILTER;
}

export class ClearFilter implements Action {
    readonly type = FilterActionTypes.CLEAR_FILTER;
}

export class UpdateFilterChanges implements Action {
    readonly type = FilterActionTypes.UPDATE_FILTER;

    constructor(public payload: Partial<MetadataFilter>) { }
}

export class SelectFilterType implements Action {
    readonly type = FilterActionTypes.SELECT_FILTER_TYPE;

    constructor(public payload: string) { }
}

export type FilterActionsUnion =
    | SelectId
    | SelectFilterType
    | UpdateFilterChanges
    | CancelCreateFilter
    | LoadEntityPreview
    | LoadEntityPreviewSuccess
    | LoadEntityPreviewError
    | ClearFilter;
