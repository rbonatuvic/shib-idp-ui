import { Action } from '@ngrx/store';
import { MetadataResolver } from '../../domain/model';

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

export class UpdateChanges implements Action {
    readonly type = UPDATE_CHANGES;

    constructor(public payload: MetadataResolver) { }
}

export class CancelChanges implements Action {
    readonly type = CANCEL_CHANGES;
}

export class SaveChanges implements Action {
    readonly type = SAVE_CHANGES;

    constructor(public payload: MetadataResolver) { }
}

export class ResetChanges implements Action {
    readonly type = RESET_CHANGES;

    constructor() { }
}

export type Actions =
    | UpdateStatus
    | UpdateChanges
    | CancelChanges
    | SaveChanges
    | ResetChanges;
