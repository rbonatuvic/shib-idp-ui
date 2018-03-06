import { Action } from '@ngrx/store';
import { MetadataProvider } from '../../metadata-provider/model/metadata-provider';

export const UPDATE_STATUS = '[Editor] Update Status';
export const UPDATE_SAVED = '[Editor] Update Saved';
export const UPDATE_CHANGES = '[Editor] Update Changes';
export const CANCEL_CHANGES = '[Editor] Cancel Changes';
export const SAVE_CHANGES = '[Editor] Save Changes';
export const RESET_CHANGES = '[Editor] Reset Changes';

export class UpdateStatus implements Action {
    readonly type = UPDATE_STATUS;

    constructor(public payload: { [key: string]: string }) { }
}

export class UpdateSaved implements Action {
    readonly type = UPDATE_SAVED;

    constructor(public payload: boolean) { }
}

export class UpdateChanges implements Action {
    readonly type = UPDATE_CHANGES;

    constructor(public payload: MetadataProvider) { }
}

export class CancelChanges implements Action {
    readonly type = CANCEL_CHANGES;

    constructor(public payload: boolean = true) { }
}

export class SaveChanges implements Action {
    readonly type = SAVE_CHANGES;

    constructor(public payload: MetadataProvider) { }
}

export class ResetChanges implements Action {
    readonly type = RESET_CHANGES;

    constructor() { }
}

export type Actions =
    | UpdateStatus
    | UpdateSaved
    | UpdateChanges
    | CancelChanges
    | SaveChanges
    | ResetChanges;
