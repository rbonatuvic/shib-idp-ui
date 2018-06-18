import { Action } from '@ngrx/store';
import { MetadataEntity } from '../../domain/model';

export const ENTITY_SEARCH = '[Metadata Entity Search] Entity Search';
export const ENTITY_FILTER = '[Metadata Entity Filter] Entity Filter';
export const ENTITY_SEARCH_COMPLETE = '[Metadata Entity Search] Entity Search COMPLETE';

/**
 * Add Resolver to Collection Actions
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

    constructor(public payload: Array<MetadataEntity>) { }
}

export type Actions =
    | SearchAction
    | FilterAction
    | SearchCompleteAction;
