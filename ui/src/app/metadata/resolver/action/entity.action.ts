import { Action } from '@ngrx/store';
import { MetadataResolver } from '../../domain/model';

export enum ResolverEntityActionTypes {
    UPDATE_STATUS = '[Resolver Entity] Update Status',
    UPDATE_SAVING = '[Resolver Entity] Update Saving',
    UPDATE_CHANGES_REQUEST = '[Resolver Entity] Update Changes Request',
    UPDATE_CHANGES_SUCCESS = '[Resolver Entity] Update Changes Success',
    CLEAR = '[Resolver Entity] Clear',
    CANCEL = '[Resolver Entity] Cancel'
}

export class UpdateStatus implements Action {
    readonly type = ResolverEntityActionTypes.UPDATE_STATUS;

    constructor(public payload: { [key: string]: string }) { }
}

export class UpdateChangesRequest implements Action {
    readonly type = ResolverEntityActionTypes.UPDATE_CHANGES_REQUEST;

    constructor(public payload: MetadataResolver) { }
}

export class UpdateChangesSuccess implements Action {
    readonly type = ResolverEntityActionTypes.UPDATE_CHANGES_SUCCESS;

    constructor(public payload: MetadataResolver) { }
}

export class UpdateSaving implements Action {
    readonly type = ResolverEntityActionTypes.UPDATE_SAVING;

    constructor(public payload: boolean) { }
}

export class Clear implements Action {
    readonly type = ResolverEntityActionTypes.CLEAR;

    constructor() { }
}

export class Cancel implements Action {
    readonly type = ResolverEntityActionTypes.CANCEL;

    constructor() { }
}

export type ResolverEntityActionUnion =
    | UpdateStatus
    | UpdateChangesRequest
    | UpdateChangesSuccess
    | UpdateSaving
    | Clear;
