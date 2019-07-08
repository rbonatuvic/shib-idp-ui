import { Action, MemoizedSelector } from '@ngrx/store';
import { Metadata } from '../../domain/domain.type';

export enum DashboardSearchActionTypes {
    ENTITY_SEARCH_COMPLETE = '[Metadata Entity Search] Entity Search COMPLETE',
    ENTITY_FILTER = '[Metadata Entity Filter] Entity Filter',
    ENTITY_SEARCH = '[Metadata Entity Search] Entity Search',
}

/**
 * Add Resolver to Collection Actions
 */
export class SearchAction implements Action {
    readonly type = DashboardSearchActionTypes.ENTITY_SEARCH;

    constructor(public payload: { query: string, selector: MemoizedSelector<object, any[]> }) { }
}

export class FilterAction implements Action {
    readonly type = DashboardSearchActionTypes.ENTITY_FILTER;

    constructor(public payload: string) { }
}

export class SearchCompleteAction implements Action {
    readonly type = DashboardSearchActionTypes.ENTITY_SEARCH_COMPLETE;

    constructor(public payload: Array<Metadata>) { }
}

export type DashboardSearchActionsUnion =
    | SearchAction
    | FilterAction
    | SearchCompleteAction;
