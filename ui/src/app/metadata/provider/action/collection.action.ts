import { Action } from '@ngrx/store';
import { MetadataProvider } from '../../domain/model/metadata-provider';
import { Update } from '@ngrx/entity';
import { ProviderOrder } from '../../domain/model/metadata-order';

export enum ProviderCollectionActionTypes {
    UPDATE_PROVIDER_REQUEST = '[Metadata Provider] Update Request',
    UPDATE_PROVIDER_SUCCESS = '[Metadata Provider] Update Success',
    UPDATE_PROVIDER_FAIL = '[Metadata Provider] Update Fail',

    LOAD_PROVIDER_REQUEST = '[Metadata Provider Collection] Provider Load REQUEST',
    LOAD_PROVIDER_SUCCESS = '[Metadata Provider Collection] Provider Load SUCCESS',
    LOAD_PROVIDER_ERROR = '[Metadata Provider Collection] Provider Load ERROR',

    SELECT_PROVIDER_REQUEST = '[Metadata Provider Collection] Provider SELECT REQUEST',
    SELECT_PROVIDER_SUCCESS = '[Metadata Provider Collection] Provider SELECT SUCCESS',
    SELECT_PROVIDER_ERROR = '[Metadata Provider Collection] Provider SELECT ERROR',

    ADD_PROVIDER_REQUEST = '[Metadata Provider Collection] Add Provider',
    ADD_PROVIDER_SUCCESS = '[Metadata Provider Collection] Add Provider Success',
    ADD_PROVIDER_FAIL = '[Metadata Provider Collection] Add Provider Fail',

    REMOVE_PROVIDER_REQUEST = '[Metadata Provider Collection] Remove Provider Request',
    REMOVE_PROVIDER_SUCCESS = '[Metadata Provider Collection] Remove Provider Success',
    REMOVE_PROVIDER_FAIL = '[Metadata Provider Collection] Remove Provider Fail',

    SET_ORDER_PROVIDER_REQUEST = '[Metadata Provider Collection] Set Order Provider Request',
    SET_ORDER_PROVIDER_SUCCESS = '[Metadata Provider Collection] Set Order Remove Provider Success',
    SET_ORDER_PROVIDER_FAIL = '[Metadata Provider Collection] Set Order Remove Provider Fail',

    GET_ORDER_PROVIDER_REQUEST = '[Metadata Provider Collection] Get Order Remove Provider Request',
    GET_ORDER_PROVIDER_SUCCESS = '[Metadata Provider Collection] Get Order Remove Provider Success',
    GET_ORDER_PROVIDER_FAIL = '[Metadata Provider Collection] Get Order Remove Provider Fail',

    CHANGE_PROVIDER_ORDER_UP = '[Metadata Provider Collection] Change Order Up',
    CHANGE_PROVIDER_ORDER_DOWN = '[Metadata Provider Collection] Change Order Down',
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

export class SelectProviderRequest implements Action {
    readonly type = ProviderCollectionActionTypes.SELECT_PROVIDER_REQUEST;

    constructor(public payload: string) { }
}

export class SelectProviderSuccess implements Action {
    readonly type = ProviderCollectionActionTypes.SELECT_PROVIDER_SUCCESS;

    constructor(public payload: Update<MetadataProvider>) { }
}

export class SelectProviderError implements Action {
    readonly type = ProviderCollectionActionTypes.SELECT_PROVIDER_ERROR;

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

    constructor(public payload: MetadataProvider) { }
}

export class AddProviderRequest implements Action {
    readonly type = ProviderCollectionActionTypes.ADD_PROVIDER_REQUEST;

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
    readonly type = ProviderCollectionActionTypes.REMOVE_PROVIDER_REQUEST;

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

export class SetOrderProviderRequest implements Action {
    readonly type = ProviderCollectionActionTypes.SET_ORDER_PROVIDER_REQUEST;

    constructor(public payload: ProviderOrder) { }
}

export class SetOrderProviderSuccess implements Action {
    readonly type = ProviderCollectionActionTypes.SET_ORDER_PROVIDER_SUCCESS;

    constructor() { }
}

export class SetOrderProviderFail implements Action {
    readonly type = ProviderCollectionActionTypes.SET_ORDER_PROVIDER_FAIL;

    constructor(public payload: Error) { }
}

export class GetOrderProviderRequest implements Action {
    readonly type = ProviderCollectionActionTypes.GET_ORDER_PROVIDER_REQUEST;

    constructor() { }
}

export class GetOrderProviderSuccess implements Action {
    readonly type = ProviderCollectionActionTypes.GET_ORDER_PROVIDER_SUCCESS;

    constructor(public payload: ProviderOrder) { }
}

export class GetOrderProviderFail implements Action {
    readonly type = ProviderCollectionActionTypes.GET_ORDER_PROVIDER_FAIL;

    constructor(public payload: Error) { }
}

export class ChangeOrderUp implements Action {
    readonly type = ProviderCollectionActionTypes.CHANGE_PROVIDER_ORDER_UP;

    constructor(public payload: string) { }
}

export class ChangeOrderDown implements Action {
    readonly type = ProviderCollectionActionTypes.CHANGE_PROVIDER_ORDER_DOWN;

    constructor(public payload: string) { }
}

export type ProviderCollectionActionsUnion =
    | LoadProviderRequest
    | LoadProviderSuccess
    | LoadProviderError
    | SelectProviderRequest
    | SelectProviderSuccess
    | SelectProviderError
    | AddProviderRequest
    | AddProviderSuccess
    | AddProviderFail
    | RemoveProviderRequest
    | RemoveProviderSuccess
    | RemoveProviderFail
    | UpdateProviderRequest
    | UpdateProviderSuccess
    | UpdateProviderFail
    | SetOrderProviderRequest
    | SetOrderProviderSuccess
    | SetOrderProviderFail
    | GetOrderProviderRequest
    | GetOrderProviderSuccess
    | GetOrderProviderFail
    | ChangeOrderUp
    | ChangeOrderDown;
