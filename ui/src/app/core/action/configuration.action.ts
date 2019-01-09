import { Action } from '@ngrx/store';

export enum ConfigurationActionTypes {
    LOAD_ROLE_REQUEST = '[Config] Load User Role Request',
    LOAD_ROLE_SUCCESS = '[Config] Load User Role Success',
    LOAD_ROLE_FAIL = '[Config] Load User Role Fail'
}

export class LoadRoleRequest implements Action {
    readonly type = ConfigurationActionTypes.LOAD_ROLE_REQUEST;

    constructor() {}
}
export class LoadRoleSuccess implements Action {
    readonly type = ConfigurationActionTypes.LOAD_ROLE_SUCCESS;

    constructor(public payload: string[]) { }
}
export class LoadRoleFail implements Action {
    readonly type = ConfigurationActionTypes.LOAD_ROLE_FAIL;

    constructor() { }
}

export type ConfigurationActionUnion =
    | LoadRoleRequest
    | LoadRoleSuccess
    | LoadRoleFail
;
