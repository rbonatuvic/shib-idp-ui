import { Action } from '@ngrx/store';
import { Contention, ContentionResolution } from '../model/contention';
import { MetadataEntity } from '../../domain/domain.type';


export enum ContentionActionTypes {
    SHOW_CONTENTION = '[Contention] Show Contention',
    RESOLVE_CONTENTION = '[Contention] Resolve Contention',
    CANCEL_CONTENTION = '[Contention] Cancel Contention'
}

export class ShowContentionAction implements Action {
    readonly type = ContentionActionTypes.SHOW_CONTENTION;

    constructor(public payload: Contention<any>) {}
}

export class ResolveContentionAction implements Action {
    readonly type = ContentionActionTypes.RESOLVE_CONTENTION;

    constructor(public payload: ContentionResolution<any>) {}
}

export class CancelContentionAction implements Action {
    readonly type = ContentionActionTypes.CANCEL_CONTENTION;

    constructor(public payload: ContentionResolution<any>) { }
}

export type ContentionActionUnion =
    | ShowContentionAction
    | ResolveContentionAction
    | CancelContentionAction;
