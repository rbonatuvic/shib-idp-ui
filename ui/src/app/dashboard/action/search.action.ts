import { Action } from '@ngrx/store';
import { MetadataProvider } from '../../domain/model/metadata-provider';
import { MetadataFilter } from '../../domain/model/metadata-filter';

export const ENTITY_SEARCH = '[Metadata Entity Search] Entity Search';
export const ENTITY_FILTER = '[Metadata Entity Filter] Entity Filter';
export const ENTITY_SEARCH_COMPLETE = '[Metadata Entity Search] Entity Search COMPLETE';

/**
 * Add Provider to Collection Actions
 */
export class SearchAction implements Action {
    readonly type = ENTITY_SEARCH;

    constructor(public payload: string) { }
}

export class FilterAction implements Action {
    readonly type = ENTITY_FILTER;

    constructor(public payload: string) { }
}

export class SearchCompleteAction implements Action {
    readonly type = ENTITY_SEARCH_COMPLETE;

    constructor(public payload: Array<MetadataProvider | MetadataFilter>) { }
}

export type Actions =
    | SearchAction
    | FilterAction
    | SearchCompleteAction;
