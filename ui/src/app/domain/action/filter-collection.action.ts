import { Action } from '@ngrx/store';
import { MetadataFilter } from '../../domain/model/metadata-filter';

export const SAVE_FILTER = '[Filter] Save Filter';
export const SAVE_FILTER_SUCCESS = '[Filter] Save Filter Success';
export const SAVE_FILTER_ERROR = '[Filter] Save Filter Error';

export class SaveFilter implements Action {
    readonly type = SAVE_FILTER;

    constructor(public payload: Partial<MetadataFilter>) { }
}

export class SaveFilterSuccess implements Action {
    readonly type = SAVE_FILTER_SUCCESS;

    constructor(public payload: MetadataFilter) { }
}

export class SaveFilterError implements Action {
    readonly type = SAVE_FILTER_ERROR;

    constructor(public payload: Error) { }
}

export type Actions =
    | SaveFilter
    | SaveFilterSuccess
    | SaveFilterError;
