import { Action } from '@ngrx/store';
import { MetadataResolver } from '../../domain/model';
import { Update } from '@ngrx/entity';

export enum ResolverCollectionActionTypes {
    FIND = '[Metadata Resolver] Find',
    SELECT = '[Metadata Resolver] Select',
    SELECT_SUCCESS = '[Metadata Resolver] Select Success',

    CLEAR_SELECTION = '[Metadata Resolver] Selection Clear',

    UPDATE_RESOLVER_REQUEST = '[Metadata Resolver] Update Request',
    UPDATE_RESOLVER_SUCCESS = '[Metadata Resolver] Update Success',
    UPDATE_RESOLVER_FAIL = '[Metadata Resolver] Update Fail',
    UPDATE_RESOLVER_CONFLICT = '[Metadata Resolver] Update Conflict',

    LOAD_RESOLVER_REQUEST = '[Metadata Resolver Collection] Load Resolver REQUEST',
    LOAD_RESOLVER_SUCCESS = '[Metadata Resolver Collection] Load Resolver SUCCESS',
    LOAD_RESOLVER_ERROR = '[Metadata Resolver Collection] Load Resolver ERROR',
    LOAD_ADMIN_RESOLVERS_REQUEST = '[Metadata Resolver Collection] Load Admin Resolver REQUEST',

    ADD_RESOLVER = '[Metadata Resolver Collection] Add Resolver',
    ADD_RESOLVER_SUCCESS = '[Metadata Resolver Collection] Add Resolver Success',
    ADD_RESOLVER_FAIL = '[Metadata Resolver Collection] Add Resolver Fail',

    REMOVE_RESOLVER = '[Metadata Resolver Collection] Remove Resolver',
    REMOVE_RESOLVER_SUCCESS = '[Metadata Resolver Collection] Remove Resolver Success',
    REMOVE_RESOLVER_FAIL = '[Metadata Resolver Collection] Remove Resolver Fail',

    UPLOAD_RESOLVER_REQUEST = '[Metadata Resolver Collection] Upload Resolver Request',
    CREATE_RESOLVER_FROM_URL_REQUEST = '[Metadata Resolver Collection] Create Resolver From URL Request',
}

export class FindResolver implements Action {
    readonly type = ResolverCollectionActionTypes.FIND;

    constructor(public payload: string) { }
}

export class SelectResolver implements Action {
    readonly type = ResolverCollectionActionTypes.SELECT;

    constructor(public payload: string) { }
}

export class SelectResolverSuccess implements Action {
    readonly type = ResolverCollectionActionTypes.SELECT_SUCCESS;

    constructor(public payload: MetadataResolver) { }
}

export class LoadResolverRequest implements Action {
    readonly type = ResolverCollectionActionTypes.LOAD_RESOLVER_REQUEST;

    constructor() { }
}

export class LoadAdminResolverRequest implements Action {
    readonly type = ResolverCollectionActionTypes.LOAD_ADMIN_RESOLVERS_REQUEST;

    constructor() { }
}

export class LoadResolverSuccess implements Action {
    readonly type = ResolverCollectionActionTypes.LOAD_RESOLVER_SUCCESS;

    constructor(public payload: MetadataResolver[]) { }
}

export class LoadResolverError implements Action {
    readonly type = ResolverCollectionActionTypes.LOAD_RESOLVER_ERROR;

    constructor(public payload: any) { }
}

export class UpdateResolverRequest implements Action {
    readonly type = ResolverCollectionActionTypes.UPDATE_RESOLVER_REQUEST;

    constructor(public payload: MetadataResolver) { }
}

export class UpdateResolverSuccess implements Action {
    readonly type = ResolverCollectionActionTypes.UPDATE_RESOLVER_SUCCESS;

    constructor(public payload: Update<MetadataResolver>) { }
}

export class UpdateResolverFail implements Action {
    readonly type = ResolverCollectionActionTypes.UPDATE_RESOLVER_FAIL;

    constructor(public payload: any) { }
}

export class UpdateResolverConflict implements Action {
    readonly type = ResolverCollectionActionTypes.UPDATE_RESOLVER_CONFLICT;

    constructor(public payload: MetadataResolver) { }
}

export class AddResolverRequest implements Action {
    readonly type = ResolverCollectionActionTypes.ADD_RESOLVER;

    constructor(public payload: MetadataResolver) { }
}

export class AddResolverSuccess implements Action {
    readonly type = ResolverCollectionActionTypes.ADD_RESOLVER_SUCCESS;

    constructor(public payload: MetadataResolver) { }
}

export class AddResolverFail implements Action {
    readonly type = ResolverCollectionActionTypes.ADD_RESOLVER_FAIL;

    constructor(public payload: any) { }
}

export class RemoveResolverRequest implements Action {
    readonly type = ResolverCollectionActionTypes.REMOVE_RESOLVER;

    constructor(public payload: MetadataResolver) { }
}

export class RemoveResolverSuccess implements Action {
    readonly type = ResolverCollectionActionTypes.REMOVE_RESOLVER_SUCCESS;

    constructor(public payload: MetadataResolver) { }
}

export class RemoveResolverFail implements Action {
    readonly type = ResolverCollectionActionTypes.REMOVE_RESOLVER_FAIL;

    constructor(public payload: MetadataResolver) { }
}

export class UploadResolverRequest implements Action {
    readonly type = ResolverCollectionActionTypes.UPLOAD_RESOLVER_REQUEST;

    constructor(public payload: { name: string, body: string }) { }
}

export class CreateResolverFromUrlRequest implements Action {
    readonly type = ResolverCollectionActionTypes.CREATE_RESOLVER_FROM_URL_REQUEST;

    constructor(public payload: { name: string, url: string }) { }
}

export class ClearResolverSelection implements Action {
    readonly type = ResolverCollectionActionTypes.CLEAR_SELECTION;
}

export type ResolverCollectionActionsUnion =
    | LoadResolverRequest
    | LoadResolverSuccess
    | LoadResolverError
    | LoadAdminResolverRequest
    | AddResolverRequest
    | AddResolverSuccess
    | AddResolverFail
    | RemoveResolverRequest
    | RemoveResolverSuccess
    | RemoveResolverFail
    | FindResolver
    | SelectResolver
    | SelectResolverSuccess
    | UpdateResolverRequest
    | UpdateResolverSuccess
    | UpdateResolverFail
    | UpdateResolverConflict
    | UploadResolverRequest
    | CreateResolverFromUrlRequest
    | ClearResolverSelection;
