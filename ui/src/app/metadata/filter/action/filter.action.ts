import { Action } from '@ngrx/store';

import { QueryParams } from '../../core/model/query';
import { MetadataFilter } from '../../domain/model/metadata-filter';
import { MDUI } from '../../domain/model/mdui';

export const SELECT_ID = '[Filter] Select Entity ID';

export const UPDATE_FILTER = '[Filter] Update Filter';
export const CANCEL_CREATE_FILTER = '[Filter] Cancel Create Filter';

export const LOAD_ENTITY_PREVIEW = '[Filter] Load Preview data';
export const LOAD_ENTITY_PREVIEW_SUCCESS = '[Filter] Load Preview data success';
export const LOAD_ENTITY_PREVIEW_ERROR = '[Filter] Load Preview data error';

export class SelectId implements Action {
    readonly type = SELECT_ID;

    constructor(public payload: string) { }
}

export class LoadEntityPreview implements Action {
    readonly type = LOAD_ENTITY_PREVIEW;

    constructor(public payload: string) { }
}
export class LoadEntityPreviewSuccess implements Action {
    readonly type = LOAD_ENTITY_PREVIEW_SUCCESS;

    constructor(public payload: MDUI) { }
}
export class LoadEntityPreviewError implements Action {
    readonly type = LOAD_ENTITY_PREVIEW_ERROR;

    constructor(public payload: string) { }
}

export class CancelCreateFilter implements Action {
    readonly type = CANCEL_CREATE_FILTER;
}

export class UpdateFilterChanges implements Action {
    readonly type = UPDATE_FILTER;

    constructor(public payload: Partial<MetadataFilter>) { }
}

export type Actions =
    | SelectId
    | UpdateFilterChanges
    | CancelCreateFilter
    | LoadEntityPreview
    | LoadEntityPreviewSuccess
    | LoadEntityPreviewError;
