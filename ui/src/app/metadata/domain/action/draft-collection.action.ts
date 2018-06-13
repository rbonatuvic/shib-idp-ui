import { Action } from '@ngrx/store';
import { Update } from '@ngrx/entity/entity';
import { MetadataProvider } from '../model/provider';

export enum DraftCollectionActionTypes {
    FIND = '[Metadata Draft] Find',
    SELECT = '[Metadata Draft] Select',
    UPDATE_DRAFT_REQUEST = '[Metadata Draft] Update Request',
    UPDATE_DRAFT_SUCCESS = '[Metadata Draft] Update Success',
    UPDATE_DRAFT_FAIL = '[Metadata Draft] Update Fail',
    LOAD_DRAFT_REQUEST = '[Metadata Draft Collection] Draft REQUEST',
    LOAD_DRAFT_SUCCESS = '[Metadata Draft Collection] Draft SUCCESS',
    LOAD_DRAFT_ERROR = '[Metadata Draft Collection] Draft ERROR',
    ADD_DRAFT = '[Metadata Draft Collection] Add Draft',
    ADD_DRAFT_SUCCESS = '[Metadata Draft Collection] Add Draft Success',
    ADD_DRAFT_FAIL = '[Metadata Draft Collection] Add Draft Fail',
    REMOVE_DRAFT = '[Metadata Draft Collection] Remove Draft',
    REMOVE_DRAFT_SUCCESS = '[Metadata Draft Collection] Remove Draft Success',
    REMOVE_DRAFT_FAIL = '[Metadata Draft Collection] Remove Draft Fail'
}


export class FindDraft implements Action {
    readonly type = DraftCollectionActionTypes.FIND;

    constructor(public payload: string) { }
}

export class SelectDraft implements Action {
    readonly type = DraftCollectionActionTypes.SELECT;

    constructor(public payload: string) { }
}

export class UpdateDraftRequest implements Action {
    readonly type = DraftCollectionActionTypes.UPDATE_DRAFT_REQUEST;

    constructor(public payload: MetadataProvider) { }
}

export class UpdateDraftSuccess implements Action {
    readonly type = DraftCollectionActionTypes.UPDATE_DRAFT_SUCCESS;

    constructor(public payload: Update<MetadataProvider>) { }
}

export class UpdateDraftFail implements Action {
    readonly type = DraftCollectionActionTypes.UPDATE_DRAFT_FAIL;

    constructor(public payload: MetadataProvider) { }
}

export class AddDraftRequest implements Action {
    readonly type = DraftCollectionActionTypes.ADD_DRAFT;

    constructor(public payload: MetadataProvider) { }
}

export class AddDraftSuccess implements Action {
    readonly type = DraftCollectionActionTypes.ADD_DRAFT_SUCCESS;

    constructor(public payload: MetadataProvider) { }
}

export class AddDraftFail implements Action {
    readonly type = DraftCollectionActionTypes.ADD_DRAFT_FAIL;

    constructor(public payload: any) { }
}

export class RemoveDraftRequest implements Action {
    readonly type = DraftCollectionActionTypes.REMOVE_DRAFT;

    constructor(public payload: MetadataProvider) { }
}

export class RemoveDraftSuccess implements Action {
    readonly type = DraftCollectionActionTypes.REMOVE_DRAFT_SUCCESS;

    constructor(public payload: MetadataProvider) { }
}

export class RemoveDraftFail implements Action {
    readonly type = DraftCollectionActionTypes.REMOVE_DRAFT_FAIL;

    constructor(public payload: MetadataProvider) { }
}

export class LoadDraftRequest implements Action {
    readonly type = DraftCollectionActionTypes.LOAD_DRAFT_REQUEST;

    constructor() { }
}

export class LoadDraftSuccess implements Action {
    readonly type = DraftCollectionActionTypes.LOAD_DRAFT_SUCCESS;

    constructor(public payload: MetadataProvider[]) { }
}

export class LoadDraftError implements Action {
    readonly type = DraftCollectionActionTypes.LOAD_DRAFT_ERROR;

    constructor(public payload: any) { }
}

export type DraftCollectionActionsUnion =
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
