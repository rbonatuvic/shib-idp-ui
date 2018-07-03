import { Action } from '@ngrx/store';
import { Wizard } from '../model';

export enum WizardActionTypes {
    SET_INDEX = '[Wizard] Set Index',
    SET_DEFINITION = '[Wizard] Set Definition',
    UPDATE_DEFINITION = '[Wizard] Update Definition',
    SET_DISABLED = '[Wizard] Set Disabled',

    NEXT = '[Wizard] Next Page',
    PREVIOUS = '[Wizard] Previous Page',

    CLEAR = '[Wizard] Clear'
}

export class SetIndex implements Action {
    readonly type = WizardActionTypes.SET_INDEX;

    constructor(public payload: string) { }
}

export class SetDefinition implements Action {
    readonly type = WizardActionTypes.SET_DEFINITION;

    constructor(public payload: Wizard<any>) { }
}

export class UpdateDefinition implements Action {
    readonly type = WizardActionTypes.UPDATE_DEFINITION;

    constructor(public payload: Wizard<any>) { }
}

export class SetDisabled implements Action {
    readonly type = WizardActionTypes.SET_DISABLED;

    constructor(public payload: boolean) { }
}

export class Next implements Action {
    readonly type = WizardActionTypes.NEXT;

    constructor(public payload: string) { }
}

export class Previous implements Action {
    readonly type = WizardActionTypes.PREVIOUS;

    constructor(public payload: string) { }
}

export class ClearWizard implements Action {
    readonly type = WizardActionTypes.CLEAR;
}

export type WizardActionUnion =
    | SetIndex
    | SetDefinition
    | UpdateDefinition
    | SetDisabled
    | Next
    | Previous
    | ClearWizard;
