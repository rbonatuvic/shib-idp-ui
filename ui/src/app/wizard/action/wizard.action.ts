import { Action } from '@ngrx/store';
import { Wizard } from '../model';

export enum WizardActionTypes {
    SET_INDEX = '[Wizard] Set Index',
    SET_DEFINITION = '[Wizard] Set Definition',
    UPDATE_DEFINITION = '[Wizard] Update Definition',
    SET_DISABLED = '[Wizard] Set Disabled',

    ADD_SCHEMA = '[Wizard] Add Schema',

    NEXT = '[Wizard] Next Page',
    PREVIOUS = '[Wizard] Previous Page',

    CLEAR = '[Wizard] Clear',

    LOAD_SCHEMA_REQUEST = '[Wizard] Load Schema Request',
    LOAD_SCHEMA_SUCCESS = '[Wizard] Load Schema Success',
    LOAD_SCHEMA_FAIL = '[Wizard] Load Schema Fail',

    LOCK = '[Wizard] Lock',
    UNLOCK = '[Wizard] Unlock'
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

export class AddSchema implements Action {
    readonly type = WizardActionTypes.ADD_SCHEMA;

    constructor(public payload: { id: string, schema: any }) { }
}

export class ClearWizard implements Action {
    readonly type = WizardActionTypes.CLEAR;
}

export class LoadSchemaRequest implements Action {
    readonly type = WizardActionTypes.LOAD_SCHEMA_REQUEST;

    constructor(public payload: string) { }
}

export class LoadSchemaSuccess implements Action {
    readonly type = WizardActionTypes.LOAD_SCHEMA_SUCCESS;

    constructor(public payload: any) { }
}

export class LoadSchemaFail implements Action {
    readonly type = WizardActionTypes.LOAD_SCHEMA_FAIL;

    constructor(public payload: Error) { }
}

export class LockEditor implements Action {
    readonly type = WizardActionTypes.LOCK;
}

export class UnlockEditor implements Action {
    readonly type = WizardActionTypes.UNLOCK;
}

export type WizardActionUnion =
    | SetIndex
    | SetDefinition
    | UpdateDefinition
    | SetDisabled
    | Next
    | Previous
    | ClearWizard
    | AddSchema
    | LoadSchemaRequest
    | LoadSchemaSuccess
    | LoadSchemaFail
    | LockEditor
    | UnlockEditor;
