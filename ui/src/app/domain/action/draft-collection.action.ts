import { Action } from '@ngrx/store';
import { MetadataProvider } from '../model/metadata-provider';

export const FIND = '[Metadata Draft] Find';
export const SELECT = '[Metadata Draft] Select';

export const UPDATE_DRAFT_REQUEST = '[Metadata Draft] Update Request';
export const UPDATE_DRAFT_SUCCESS = '[Metadata Draft] Update Success';
export const UPDATE_DRAFT_FAIL = '[Metadata Draft] Update Fail';

export const LOAD_DRAFT_REQUEST = '[Metadata Draft Collection] Draft REQUEST';
export const LOAD_DRAFT_SUCCESS = '[Metadata Draft Collection] Draft SUCCESS';
export const LOAD_DRAFT_ERROR = '[Metadata Draft Collection] Draft ERROR';
export const ADD_DRAFT = '[Metadata Draft Collection] Add Draft';
export const ADD_DRAFT_SUCCESS = '[Metadata Draft Collection] Add Draft Success';
export const ADD_DRAFT_FAIL = '[Metadata Draft Collection] Add Draft Fail';
export const REMOVE_DRAFT = '[Metadata Draft Collection] Remove Draft';
export const REMOVE_DRAFT_SUCCESS = '[Metadata Draft Collection] Remove Draft Success';
export const REMOVE_DRAFT_FAIL = '[Metadata Draft Collection] Remove Draft Fail';

export class FindDraft implements Action {
    readonly type = FIND;

    constructor(public payload: string) { }
}

export class SelectDraft implements Action {
    readonly type = SELECT;

    constructor(public payload: string) { }
}

export class UpdateDraftRequest implements Action {
    readonly type = UPDATE_DRAFT_REQUEST;

    constructor(public payload: MetadataProvider) { }
}

export class UpdateDraftSuccess implements Action {
    readonly type = UPDATE_DRAFT_SUCCESS;

    constructor(public payload: MetadataProvider) { }
}

export class UpdateDraftFail implements Action {
    readonly type = UPDATE_DRAFT_FAIL;

    constructor(public payload: MetadataProvider) { }
}

export class AddDraftRequest implements Action {
    readonly type = ADD_DRAFT;

    constructor(public payload: MetadataProvider) { }
}

export class AddDraftSuccess implements Action {
    readonly type = ADD_DRAFT_SUCCESS;

    constructor(public payload: MetadataProvider) { }
}

export class AddDraftFail implements Action {
    readonly type = ADD_DRAFT_FAIL;

    constructor(public payload: any) { }
}

export class RemoveDraftRequest implements Action {
    readonly type = REMOVE_DRAFT;

    constructor(public payload: MetadataProvider) { }
}

export class RemoveDraftSuccess implements Action {
    readonly type = REMOVE_DRAFT_SUCCESS;

    constructor(public payload: MetadataProvider) { }
}

export class RemoveDraftFail implements Action {
    readonly type = REMOVE_DRAFT_FAIL;

    constructor(public payload: MetadataProvider) { }
}

export class LoadDraftRequest implements Action {
    readonly type = LOAD_DRAFT_REQUEST;

    constructor() { }
}

export class LoadDraftSuccess implements Action {
    readonly type = LOAD_DRAFT_SUCCESS;

    constructor(public payload: MetadataProvider[]) { }
}

export class LoadDraftError implements Action {
    readonly type = LOAD_DRAFT_ERROR;

    constructor(public payload: any) { }
}

export type Actions =
    | LoadDraftRequest
    | LoadDraftSuccess
    | LoadDraftError
    | AddDraftRequest
    | AddDraftSuccess
    | AddDraftFail
    | RemoveDraftRequest
    | RemoveDraftSuccess
    | RemoveDraftFail
    | FindDraft
    | SelectDraft
    | UpdateDraftRequest
    | UpdateDraftSuccess
    | UpdateDraftFail;
