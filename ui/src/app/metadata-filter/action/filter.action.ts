import { Action } from '@ngrx/store';

import { QueryParams } from '../../core/model/query';
import { MetadataFilter } from '../../domain/model/metadata-filter';

export const SELECT_ID = '[Filter] Select Entity ID';

export const CREATE_FILTER = '[Filter] Create Filter';
export const UPDATE_FILTER = '[Filter] Update Filter';
export const CANCEL_CREATE_FILTER = '[Filter] Cancel Create Filter';

export class SelectId implements Action {
    readonly type = SELECT_ID;

    constructor(public payload: string) { }
}

export class CreateFilter implements Action {
    readonly type = CREATE_FILTER;

    constructor(public payload: MetadataFilter) { }
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
    | CreateFilter
    | UpdateFilterChanges
    | CancelCreateFilter;
