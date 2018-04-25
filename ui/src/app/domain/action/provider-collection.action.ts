import { Action } from '@ngrx/store';
import { MetadataProvider } from '../model/metadata-provider';
import { Update } from '@ngrx/entity';

export enum ProviderCollectionActionTypes {
    FIND = '[Metadata Provider] Find',
    SELECT = '[Metadata Provider] Select',
    SELECT_SUCCESS = '[Metadata Provider] Select Success',

    UPDATE_PROVIDER_REQUEST = '[Metadata Provider] Update Request',
    UPDATE_PROVIDER_SUCCESS = '[Metadata Provider] Update Success',
    UPDATE_PROVIDER_FAIL = '[Metadata Provider] Update Fail',

    LOAD_PROVIDER_REQUEST = '[Metadata Provider Collection] Provider REQUEST',
    LOAD_PROVIDER_SUCCESS = '[Metadata Provider Collection] Provider SUCCESS',
    LOAD_PROVIDER_ERROR = '[Metadata Provider Collection] Provider ERROR',
    ADD_PROVIDER = '[Metadata Provider Collection] Add Provider',
    ADD_PROVIDER_SUCCESS = '[Metadata Provider Collection] Add Provider Success',
    ADD_PROVIDER_FAIL = '[Metadata Provider Collection] Add Provider Fail',
    REMOVE_PROVIDER = '[Metadata Provider Collection] Remove Provider',
    REMOVE_PROVIDER_SUCCESS = '[Metadata Provider Collection] Remove Provider Success',
    REMOVE_PROVIDER_FAIL = '[Metadata Provider Collection] Remove Provider Fail',

    UPLOAD_PROVIDER_REQUEST = '[Metadata Provider Collection] Upload Provider Request',
    CREATE_PROVIDER_FROM_URL_REQUEST = '[Metadata Provider Collection] Create Provider From URL Request',
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

    constructor(public payload: MetadataProvider) { }
}

export class LoadProviderRequest implements Action {
    readonly type = ProviderCollectionActionTypes.LOAD_PROVIDER_REQUEST;

    constructor() { }
}

export class LoadProviderSuccess implements Action {
    readonly type = ProviderCollectionActionTypes.LOAD_PROVIDER_SUCCESS;

    constructor(public payload: MetadataProvider[]) { }
}

export class LoadProviderError implements Action {
    readonly type = ProviderCollectionActionTypes.LOAD_PROVIDER_ERROR;

    constructor(public payload: any) { }
}

export class UpdateProviderRequest implements Action {
    readonly type = ProviderCollectionActionTypes.UPDATE_PROVIDER_REQUEST;

    constructor(public payload: MetadataProvider) { }
}

export class UpdateProviderSuccess implements Action {
    readonly type = ProviderCollectionActionTypes.UPDATE_PROVIDER_SUCCESS;

    constructor(public payload: Update<MetadataProvider>) { }
}

export class UpdateProviderFail implements Action {
    readonly type = ProviderCollectionActionTypes.UPDATE_PROVIDER_FAIL;

    constructor(public err: any) { }
}

export class AddProviderRequest implements Action {
    readonly type = ProviderCollectionActionTypes.ADD_PROVIDER;

    constructor(public payload: MetadataProvider) { }
}

export class AddProviderSuccess implements Action {
    readonly type = ProviderCollectionActionTypes.ADD_PROVIDER_SUCCESS;

    constructor(public payload: MetadataProvider) { }
}

export class AddProviderFail implements Action {
    readonly type = ProviderCollectionActionTypes.ADD_PROVIDER_FAIL;

    constructor(public payload: any) { }
}

export class RemoveProviderRequest implements Action {
    readonly type = ProviderCollectionActionTypes.REMOVE_PROVIDER;

    constructor(public payload: MetadataProvider) { }
}

export class RemoveProviderSuccess implements Action {
    readonly type = ProviderCollectionActionTypes.REMOVE_PROVIDER_SUCCESS;

    constructor(public payload: MetadataProvider) { }
}

export class RemoveProviderFail implements Action {
    readonly type = ProviderCollectionActionTypes.REMOVE_PROVIDER_FAIL;

    constructor(public payload: MetadataProvider) { }
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
