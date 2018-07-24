import { Action } from '@ngrx/store';
import { MetadataProvider } from '../../domain/model';

export enum EntityActionTypes {
    UPDATE_PROVIDER = '[Provider Entity] Update Provider',
    CLEAR_PROVIDER = '[Provider Entity] Clear',
    RESET_CHANGES = '[Provider Entity] Reset Changes'
}

export class UpdateProvider implements Action {
    readonly type = EntityActionTypes.UPDATE_PROVIDER;

    constructor(public payload: Partial<MetadataProvider>) { }
}

export class ClearProvider implements Action {
    readonly type = EntityActionTypes.CLEAR_PROVIDER;
}

export class ResetChanges implements Action {
    readonly type = EntityActionTypes.RESET_CHANGES;
}

export type EntityActionUnion =
    | UpdateProvider
    | ClearProvider
    | ResetChanges;
