import { Action } from '@ngrx/store';
import { MetadataResolver } from '../../domain/model';
import { Update } from '@ngrx/entity';

export enum ProviderCollectionActionTypes {
    FIND = '[Metadata Resolver] Find',
    SELECT = '[Metadata Resolver] Select',
    SELECT_SUCCESS = '[Metadata Resolver] Select Success',

    UPDATE_PROVIDER_REQUEST = '[Metadata Resolver] Update Request',
    UPDATE_PROVIDER_SUCCESS = '[Metadata Resolver] Update Success',
    UPDATE_PROVIDER_FAIL = '[Metadata Resolver] Update Fail',

    LOAD_PROVIDER_REQUEST = '[Metadata Resolver Collection] Resolver REQUEST',
    LOAD_PROVIDER_SUCCESS = '[Metadata Resolver Collection] Resolver SUCCESS',
    LOAD_PROVIDER_ERROR = '[Metadata Resolver Collection] Resolver ERROR',
    ADD_PROVIDER = '[Metadata Resolver Collection] Add Resolver',
    ADD_PROVIDER_SUCCESS = '[Metadata Resolver Collection] Add Resolver Success',
    ADD_PROVIDER_FAIL = '[Metadata Resolver Collection] Add Resolver Fail',
    REMOVE_PROVIDER = '[Metadata Resolver Collection] Remove Resolver',
    REMOVE_PROVIDER_SUCCESS = '[Metadata Resolver Collection] Remove Resolver Success',
    REMOVE_PROVIDER_FAIL = '[Metadata Resolver Collection] Remove Resolver Fail',

    UPLOAD_PROVIDER_REQUEST = '[Metadata Resolver Collection] Upload Resolver Request',
    CREATE_PROVIDER_FROM_URL_REQUEST = '[Metadata Resolver Collection] Create Resolver From URL Request',
}

export class FindProvider implements Action {
    readonly type = ProviderCollectionActionTypes.FIND;

    constructor(public payload: string) { }
}

export class SelectProvider implements Action {
    readonly type = ProviderCollectionActionTypes.SELECT;

    constructor(public payload: string) { }
}

export class SelectProviderSuccess implements Action {
    readonly type = ProviderCollectionActionTypes.SELECT_SUCCESS;

    constructor(public payload: MetadataResolver) { }
}

export class LoadProviderRequest implements Action {
    readonly type = ProviderCollectionActionTypes.LOAD_PROVIDER_REQUEST;

    constructor() { }
}

export class LoadProviderSuccess implements Action {
    readonly type = ProviderCollectionActionTypes.LOAD_PROVIDER_SUCCESS;

    constructor(public payload: MetadataResolver[]) { }
}

export class LoadProviderError implements Action {
    readonly type = ProviderCollectionActionTypes.LOAD_PROVIDER_ERROR;

    constructor(public payload: any) { }
}

export class UpdateProviderRequest implements Action {
    readonly type = ProviderCollectionActionTypes.UPDATE_PROVIDER_REQUEST;

    constructor(public payload: MetadataResolver) { }
}

export class UpdateProviderSuccess implements Action {
    readonly type = ProviderCollectionActionTypes.UPDATE_PROVIDER_SUCCESS;

    constructor(public payload: Update<MetadataResolver>) { }
}

export class UpdateProviderFail implements Action {
    readonly type = ProviderCollectionActionTypes.UPDATE_PROVIDER_FAIL;

    constructor(public payload: MetadataResolver) { }
}

export class AddProviderRequest implements Action {
    readonly type = ProviderCollectionActionTypes.ADD_PROVIDER;

    constructor(public payload: MetadataResolver) { }
}

export class AddProviderSuccess implements Action {
    readonly type = ProviderCollectionActionTypes.ADD_PROVIDER_SUCCESS;

    constructor(public payload: MetadataResolver) { }
}

export class AddProviderFail implements Action {
    readonly type = ProviderCollectionActionTypes.ADD_PROVIDER_FAIL;

    constructor(public payload: any) { }
}

export class RemoveProviderRequest implements Action {
    readonly type = ProviderCollectionActionTypes.REMOVE_PROVIDER;

    constructor(public payload: MetadataResolver) { }
}

export class RemoveProviderSuccess implements Action {
    readonly type = ProviderCollectionActionTypes.REMOVE_PROVIDER_SUCCESS;

    constructor(public payload: MetadataResolver) { }
}

export class RemoveProviderFail implements Action {
    readonly type = ProviderCollectionActionTypes.REMOVE_PROVIDER_FAIL;

    constructor(public payload: MetadataResolver) { }
}

export class UploadProviderRequest implements Action {
    readonly type = ProviderCollectionActionTypes.UPLOAD_PROVIDER_REQUEST;

    constructor(public payload: { name: string, body: string }) { }
}

export class CreateProviderFromUrlRequest implements Action {
    readonly type = ProviderCollectionActionTypes.CREATE_PROVIDER_FROM_URL_REQUEST;

    constructor(public payload: { name: string, url: string }) { }
}

export type ProviderCollectionActionsUnion =
    | LoadProviderRequest
    | LoadProviderSuccess
    | LoadProviderError
    | AddProviderRequest
    | AddProviderSuccess
    | AddProviderFail
    | RemoveProviderRequest
    | RemoveProviderSuccess
    | RemoveProviderFail
    | FindProvider
    | SelectProvider
    | SelectProviderSuccess
    | UpdateProviderRequest
    | UpdateProviderSuccess
    | UpdateProviderFail
    | UploadProviderRequest
    | CreateProviderFromUrlRequest;
