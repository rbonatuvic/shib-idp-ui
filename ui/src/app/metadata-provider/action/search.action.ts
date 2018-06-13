import { Action } from '@ngrx/store';
import { MetadataProvider } from '../../domain/model/metadata-provider';

export enum SearchActionTypes {
    SEARCH_IDS = '[Search Resolver Ids] Request',
    SEARCH_IDS_SUCCESS = '[Search Resolver Ids] Success',
    SEARCH_IDS_ERROR = '[Search Resolver Ids] Error'
}

export class SearchIds implements Action {
    readonly type = SearchActionTypes.SEARCH_IDS;

    constructor(public payload: string) { }
}
export class SearchIdsSuccess implements Action {
    readonly type = SearchActionTypes.SEARCH_IDS_SUCCESS;

    constructor(public payload: string[]) { }
}
export class SearchIdsError implements Action {
    readonly type = SearchActionTypes.SEARCH_IDS_ERROR;

    constructor(public payload: any) { }
}

export type SearchActionUnion =
    | SearchIds
    | SearchIdsSuccess
    | SearchIdsError;
