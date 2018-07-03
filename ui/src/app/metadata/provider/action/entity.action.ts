import { Action } from '@ngrx/store';
import { MetadataProvider } from '../../domain/model';

export enum EntityActionTypes {
    SELECT_PROVIDER = '[Provider Entity] Select Provider',
    CREATE_PROVIDER = '[Provider Entity] Create Provider',
    UPDATE_PROVIDER = '[Provider Entity] Update Provider',
    SAVE_PROVIDER_REQUEST = '[Provider Entity] Save Provider Request',
    SAVE_PROVIDER_SUCCESS = '[Provider Entity] Save Provider Success',
    SAVE_PROVIDER_FAIL = '[Provider Entity] Save Provider Fail',

    CLEAR_PROVIDER = '[Provider Entity] Clear',
    RESET_CHANGES = '[Provider Entity] Reset Changes'
}

export class SelectProvider implements Action {
    readonly type = EntityActionTypes.SELECT_PROVIDER;

    constructor(public payload: MetadataProvider) { }
}

export class CreateProvider implements Action {
    readonly type = EntityActionTypes.CREATE_PROVIDER;

    constructor(public payload: MetadataProvider) { }
}

export class UpdateProvider implements Action {
    readonly type = EntityActionTypes.UPDATE_PROVIDER;

    constructor(public payload: Partial<MetadataProvider>) { }
}

export class SaveProviderRequest implements Action {
    readonly type = EntityActionTypes.SAVE_PROVIDER_REQUEST;

    constructor(public payload: MetadataProvider) { }
}

export class SaveProviderSuccess implements Action {
    readonly type = EntityActionTypes.SAVE_PROVIDER_SUCCESS;

    constructor(public payload: MetadataProvider) { }
}

export class SaveProviderFail implements Action {
    readonly type = EntityActionTypes.SAVE_PROVIDER_FAIL;

    constructor(public payload: Error) { }
}

export class ClearProvider implements Action {
    readonly type = EntityActionTypes.CLEAR_PROVIDER;
}

export class ResetChanges implements Action {
    readonly type = EntityActionTypes.RESET_CHANGES;
}

export type EntityActionUnion =
    | SelectProvider
    | UpdateProvider
    | SaveProviderRequest
    | SaveProviderSuccess
    | SaveProviderFail
    | CreateProvider
    | ClearProvider
    | ResetChanges;
