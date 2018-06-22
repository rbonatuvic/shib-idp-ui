import { Action } from '@ngrx/store';
import { MetadataResolver } from '../../domain/model';

export enum CopySourceActionTypes {
    CREATE_RESOLVER_COPY_REQUEST = '[Copy Resolver] Create Resolver Copy Request',
    CREATE_RESOLVER_COPY_SUCCESS = '[Copy Resolver] Create Resolver Copy Success',
    CREATE_RESOLVER_COPY_ERROR = '[Copy Resolver] Create Resolver Copy Error',

    UPDATE_RESOLVER_COPY = '[Copy Resolver] Update Resolver Copy Request',

    UPDATE_RESOLVER_COPY_SECTIONS = '[Copy Resolver] Update Resolver Sections',

    SAVE_RESOLVER_COPY_REQUEST = '[Copy Resolver] Save Resolver Copy Request',
    SAVE_RESOLVER_COPY_SUCCESS = '[Copy Resolver] Save Resolver Copy Request',
    SAVE_RESOLVER_COPY_ERROR = '[Copy Resolver] Save Resolver Copy Request',
}

export class CreateResolverCopyRequest implements Action {
    readonly type = CopySourceActionTypes.CREATE_RESOLVER_COPY_REQUEST;

    constructor(public payload: { entityId: string, serviceProviderName: string, target: string }) { }
}

export class CreateResolverCopySuccess implements Action {
    readonly type = CopySourceActionTypes.CREATE_RESOLVER_COPY_SUCCESS;

    constructor(public payload: MetadataResolver) { }
}

export class CreateResolverCopyError implements Action {
    readonly type = CopySourceActionTypes.CREATE_RESOLVER_COPY_ERROR;

    constructor(public payload: Error) { }
}

export class UpdateResolverCopy implements Action {
    readonly type = CopySourceActionTypes.UPDATE_RESOLVER_COPY;

    constructor(public payload: Partial<MetadataResolver>) { }
}

export class UpdateResolverCopySections implements Action {
    readonly type = CopySourceActionTypes.UPDATE_RESOLVER_COPY_SECTIONS;

    constructor(public payload: string[]) { }
}

export type CopySourceActionUnion =
    | CreateResolverCopyRequest
    | CreateResolverCopySuccess
    | CreateResolverCopyError
    | UpdateResolverCopy
    | UpdateResolverCopySections;
