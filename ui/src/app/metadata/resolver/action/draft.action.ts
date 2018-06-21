import { Action } from '@ngrx/store';
import { Update } from '@ngrx/entity/entity';
import { MetadataResolver } from '../../domain/model';

export enum DraftActionTypes {
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
    readonly type = DraftActionTypes.FIND;

    constructor(public payload: string) { }
}

export class SelectDraft implements Action {
    readonly type = DraftActionTypes.SELECT;

    constructor(public payload: string) { }
}

export class UpdateDraftRequest implements Action {
    readonly type = DraftActionTypes.UPDATE_DRAFT_REQUEST;

    constructor(public payload: MetadataResolver) { }
}

export class UpdateDraftSuccess implements Action {
    readonly type = DraftActionTypes.UPDATE_DRAFT_SUCCESS;

    constructor(public payload: Update<MetadataResolver>) { }
}

export class UpdateDraftFail implements Action {
    readonly type = DraftActionTypes.UPDATE_DRAFT_FAIL;

    constructor(public payload: MetadataResolver) { }
}

export class AddDraftRequest implements Action {
    readonly type = DraftActionTypes.ADD_DRAFT;

    constructor(public payload: MetadataResolver) { }
}

export class AddDraftSuccess implements Action {
    readonly type = DraftActionTypes.ADD_DRAFT_SUCCESS;

    constructor(public payload: MetadataResolver) { }
}

export class AddDraftFail implements Action {
    readonly type = DraftActionTypes.ADD_DRAFT_FAIL;

    constructor(public payload: any) { }
}

export class RemoveDraftRequest implements Action {
    readonly type = DraftActionTypes.REMOVE_DRAFT;

    constructor(public payload: MetadataResolver) { }
}

export class RemoveDraftSuccess implements Action {
    readonly type = DraftActionTypes.REMOVE_DRAFT_SUCCESS;

    constructor(public payload: MetadataResolver) { }
}

export class RemoveDraftFail implements Action {
    readonly type = DraftActionTypes.REMOVE_DRAFT_FAIL;

    constructor(public payload: MetadataResolver) { }
}

export class LoadDraftRequest implements Action {
    readonly type = DraftActionTypes.LOAD_DRAFT_REQUEST;

    constructor() { }
}

export class LoadDraftSuccess implements Action {
    readonly type = DraftActionTypes.LOAD_DRAFT_SUCCESS;

    constructor(public payload: MetadataResolver[]) { }
}

export class LoadDraftError implements Action {
    readonly type = DraftActionTypes.LOAD_DRAFT_ERROR;

    constructor(public payload: any) { }
}

export type DraftActionsUnion =
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
