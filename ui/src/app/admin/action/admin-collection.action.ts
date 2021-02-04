import { Action } from '@ngrx/store';
import { Update } from '@ngrx/entity';
import { Admin } from '../model/admin';

export enum AdminCollectionActionTypes {

    UPDATE_ADMIN_REQUEST = '[Admin Collection] Update Admin Request',
    UPDATE_ADMIN_SUCCESS = '[Admin Collection] Update Admin Success',
    UPDATE_ADMIN_FAIL = '[Admin Collection] Update Admin Fail',

    LOAD_ADMIN_REQUEST = '[Admin Collection] Load Admin Request',
    LOAD_ADMIN_SUCCESS = '[Admin Collection] Load Admin Success',
    LOAD_ADMIN_ERROR = '[Admin Collection] Load Admin Error',

    ADD_ADMIN_REQUEST = '[Admin Collection] Add Admin Request',
    ADD_ADMIN_SUCCESS = '[Admin Collection] Add Admin Success',
    ADD_ADMIN_FAIL = '[Admin Collection] Add Admin Fail',

    REMOVE_ADMIN_REQUEST = '[Admin Collection] Remove Admin Request',
    REMOVE_ADMIN_SUCCESS = '[Admin Collection] Remove Admin Success',
    REMOVE_ADMIN_FAIL = '[Admin Collection] Remove Admin Fail',

    CLEAR_ADMINS = '[Admin Collection] Clear Admins'

}

export class LoadAdminRequest implements Action {
    readonly type = AdminCollectionActionTypes.LOAD_ADMIN_REQUEST;

    constructor() { }
}

export class LoadAdminSuccess implements Action {
    readonly type = AdminCollectionActionTypes.LOAD_ADMIN_SUCCESS;

    constructor(public payload: Admin[]) { }
}

export class LoadAdminError implements Action {
    readonly type = AdminCollectionActionTypes.LOAD_ADMIN_ERROR;

    constructor(public payload: any) { }
}

export class UpdateAdminRequest implements Action {
    readonly type = AdminCollectionActionTypes.UPDATE_ADMIN_REQUEST;

    constructor(public payload: Admin) { }
}

export class UpdateAdminSuccess implements Action {
    readonly type = AdminCollectionActionTypes.UPDATE_ADMIN_SUCCESS;

    constructor(public payload: Update<Admin>) { }
}

export class UpdateAdminFail implements Action {
    readonly type = AdminCollectionActionTypes.UPDATE_ADMIN_FAIL;

    constructor(public payload: Admin) { }
}

export class AddAdminRequest implements Action {
    readonly type = AdminCollectionActionTypes.ADD_ADMIN_REQUEST;

    constructor(public payload: Admin) { }
}

export class AddAdminSuccess implements Action {
    readonly type = AdminCollectionActionTypes.ADD_ADMIN_SUCCESS;

    constructor(public payload: Admin) { }
}

export class AddAdminFail implements Action {
    readonly type = AdminCollectionActionTypes.ADD_ADMIN_FAIL;

    constructor(public payload: any) { }
}

export class RemoveAdminRequest implements Action {
    readonly type = AdminCollectionActionTypes.REMOVE_ADMIN_REQUEST;

    constructor(public payload: string) { }
}

export class RemoveAdminSuccess implements Action {
    readonly type = AdminCollectionActionTypes.REMOVE_ADMIN_SUCCESS;

    constructor(public payload: string) { }
}

export class RemoveAdminFail implements Action {
    readonly type = AdminCollectionActionTypes.REMOVE_ADMIN_FAIL;

    constructor(public error: Error) { }
}

export class ClearAdmins implements Action {
    readonly type = AdminCollectionActionTypes.CLEAR_ADMINS;
}


export type AdminCollectionActionsUnion =
    | LoadAdminRequest
    | LoadAdminSuccess
    | LoadAdminError
    | AddAdminRequest
    | AddAdminSuccess
    | AddAdminFail
    | RemoveAdminRequest
    | RemoveAdminSuccess
    | RemoveAdminFail
    | UpdateAdminRequest
    | UpdateAdminSuccess
    | UpdateAdminFail
    | ClearAdmins;
