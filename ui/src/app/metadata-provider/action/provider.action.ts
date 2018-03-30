import { Action } from '@ngrx/store';
import { MetadataProvider } from '../../domain/model/metadata-provider';

export const FIND = '[Metadata Provider] Find';
export const SELECT = '[Metadata Provider] Select';
export const SELECT_SUCCESS = '[Metadata Provider] Select Success';

export const UPDATE_PROVIDER_REQUEST = '[Metadata Provider] Update Request';
export const UPDATE_PROVIDER_SUCCESS = '[Metadata Provider] Update Success';
export const UPDATE_PROVIDER_FAIL = '[Metadata Provider] Update Fail';

export const LOAD_PROVIDER_REQUEST = '[Metadata Provider Collection] Provider REQUEST';
export const LOAD_PROVIDER_SUCCESS = '[Metadata Provider Collection] Provider SUCCESS';
export const LOAD_PROVIDER_ERROR = '[Metadata Provider Collection] Provider ERROR';
export const ADD_PROVIDER = '[Metadata Provider Collection] Add Provider';
export const ADD_PROVIDER_SUCCESS = '[Metadata Provider Collection] Add Provider Success';
export const ADD_PROVIDER_FAIL = '[Metadata Provider Collection] Add Provider Fail';
export const REMOVE_PROVIDER = '[Metadata Provider Collection] Remove Provider';
export const REMOVE_PROVIDER_SUCCESS = '[Metadata Provider Collection] Remove Provider Success';
export const REMOVE_PROVIDER_FAIL = '[Metadata Provider Collection] Remove Provider Fail';

export const UPLOAD_PROVIDER_REQUEST = '[Metadata Provider Collection] Upload Provider Request';
export const CREATE_PROVIDER_FROM_URL_REQUEST = '[Metadata Provider Collection] Create Provider From URL Request';

export class FindProvider implements Action {
    readonly type = FIND;

    constructor(public payload: string) { }
}

export class SelectProvider implements Action {
    readonly type = SELECT;

    constructor(public payload: string) { }
}

export class SelectProviderSuccess implements Action {
    readonly type = SELECT_SUCCESS;

    constructor(public payload: MetadataProvider) { }
}

export class LoadProviderRequest implements Action {
    readonly type = LOAD_PROVIDER_REQUEST;

    constructor() { }
}

export class LoadProviderSuccess implements Action {
    readonly type = LOAD_PROVIDER_SUCCESS;

    constructor(public payload: MetadataProvider[]) { }
}

export class LoadProviderError implements Action {
    readonly type = LOAD_PROVIDER_ERROR;

    constructor(public payload: any) { }
}

export class UpdateProviderRequest implements Action {
    readonly type = UPDATE_PROVIDER_REQUEST;

    constructor(public payload: MetadataProvider) { }
}

export class UpdateProviderSuccess implements Action {
    readonly type = UPDATE_PROVIDER_SUCCESS;

    constructor(public payload: MetadataProvider) { }
}

export class UpdateProviderFail implements Action {
    readonly type = UPDATE_PROVIDER_FAIL;

    constructor(public err: any) { }
}

export class AddProviderRequest implements Action {
    readonly type = ADD_PROVIDER;

    constructor(public payload: MetadataProvider) { }
}

export class AddProviderSuccess implements Action {
    readonly type = ADD_PROVIDER_SUCCESS;

    constructor(public payload: MetadataProvider) { }
}

export class AddProviderFail implements Action {
    readonly type = ADD_PROVIDER_FAIL;

    constructor(public payload: any) { }
}

export class RemoveProviderRequest implements Action {
    readonly type = REMOVE_PROVIDER;

    constructor(public payload: MetadataProvider) { }
}

export class RemoveProviderSuccess implements Action {
    readonly type = REMOVE_PROVIDER_SUCCESS;

    constructor(public payload: MetadataProvider) { }
}

export class RemoveProviderFail implements Action {
    readonly type = REMOVE_PROVIDER_FAIL;

    constructor(public payload: MetadataProvider) { }
}

export class UploadProviderRequest implements Action {
    readonly type = UPLOAD_PROVIDER_REQUEST;

    constructor(public payload: { name: string, body: string }) { }
}

export class CreateProviderFromUrlRequest implements Action {
    readonly type = CREATE_PROVIDER_FROM_URL_REQUEST;

    constructor(public payload: { name: string, url: string }) { }
}

export type Actions =
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
