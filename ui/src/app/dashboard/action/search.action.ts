import { Action } from '@ngrx/store';
import { MetadataProvider } from '../../metadata-provider/model/metadata-provider';

export const PROVIDER_SEARCH = '[Metadata Provider Search] Provider Search';
export const PROVIDER_SEARCH_COMPLETE = '[Metadata Provider Search] Provider Search COMPLETE';

/**
 * Add Provider to Collection Actions
 */
export class SearchAction implements Action {
    readonly type = PROVIDER_SEARCH;

    constructor(public payload) { }
}

export class SearchCompleteAction implements Action {
    readonly type = PROVIDER_SEARCH_COMPLETE;

    constructor(public payload: MetadataProvider[]) { }
}

export type Actions =
    | SearchAction
    | SearchCompleteAction;
