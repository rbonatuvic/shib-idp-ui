import { Action } from '@ngrx/store';
import { MetadataProvider } from '../../domain/model/metadata-provider';

export enum CopySourceActionTypes {
    CREATE_PROVIDER_COPY_REQUEST = '[Copy Provider] Create Provider Copy Request',
    CREATE_PROVIDER_COPY_SUCCESS = '[Copy Provider] Create Provider Copy Success',
    CREATE_PROVIDER_COPY_ERROR = '[Copy Provider] Create Provider Copy Error',

    UPDATE_PROVIDER_COPY = '[Copy Provider] Update Provider Copy Request',

    UPDATE_PROVIDER_COPY_SECTIONS = '[Copy Provider] Update Provider Sections',

    SAVE_PROVIDER_COPY_REQUEST = '[Copy Provider] Save Provider Copy Request',
    SAVE_PROVIDER_COPY_SUCCESS = '[Copy Provider] Save Provider Copy Request',
    SAVE_PROVIDER_COPY_ERROR = '[Copy Provider] Save Provider Copy Request',
}

export class CreateProviderCopyRequest implements Action {
    readonly type = CopySourceActionTypes.CREATE_PROVIDER_COPY_REQUEST;

    constructor(public payload: { entityId: string, serviceProviderName: string, target: string }) { }
}

export class CreateProviderCopySuccess implements Action {
    readonly type = CopySourceActionTypes.CREATE_PROVIDER_COPY_SUCCESS;

    constructor(public payload: MetadataProvider) { }
}

export class CreateProviderCopyError implements Action {
    readonly type = CopySourceActionTypes.CREATE_PROVIDER_COPY_ERROR;

    constructor(public payload: Error) { }
}

export class UpdateProviderCopy implements Action {
    readonly type = CopySourceActionTypes.UPDATE_PROVIDER_COPY;

    constructor(public payload: Partial<MetadataProvider>) { }
}

export class UpdateProviderCopySections implements Action {
    readonly type = CopySourceActionTypes.UPDATE_PROVIDER_COPY_SECTIONS;

    constructor(public payload: string[]) { }
}

export type CopySourceActionUnion =
    | CreateProviderCopyRequest
    | CreateProviderCopySuccess
    | CreateProviderCopyError
    | UpdateProviderCopy
    | UpdateProviderCopySections;
