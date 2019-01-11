import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { switchMap, map } from 'rxjs/operators';

import * as fromAdmin from '../reducer';
import {
    LoadAdminRequest,
    AdminCollectionActionTypes,
    LoadAdminSuccess,
    UpdateAdminRequest,
    UpdateAdminSuccess,
    RemoveAdminRequest,
    RemoveAdminSuccess
} from '../action/collection.action';
import { AdminService } from '../service/admin.service';


/* istanbul ignore next */
@Injectable()
export class AdminCollectionEffects {

    @Effect()
    loadAdminRequest$ = this.actions$.pipe(
        ofType<LoadAdminRequest>(AdminCollectionActionTypes.LOAD_ADMIN_REQUEST),
        switchMap(() => this.adminService.query().pipe(
            map(users => new LoadAdminSuccess(users))
        ))
    );

    @Effect()
    updateAdminRequest$ = this.actions$.pipe(
        ofType<UpdateAdminRequest>(AdminCollectionActionTypes.UPDATE_ADMIN_REQUEST),
        map(action => action.payload),
        switchMap(changes => this.adminService.update(changes).pipe(
            map(user => new UpdateAdminSuccess({
                id: changes.username,
                changes
            }))
        ))
    );

    @Effect()
    removeAdminRequest$ = this.actions$.pipe(
        ofType<RemoveAdminRequest>(AdminCollectionActionTypes.REMOVE_ADMIN_REQUEST),
        map(action => action.payload),
        switchMap(id => this.adminService.remove(id).pipe(
            map(user => new RemoveAdminSuccess(id))
        ))
    );

    @Effect()
    removeAdminSuccessReload$ = this.actions$.pipe(
        ofType<RemoveAdminSuccess>(AdminCollectionActionTypes.REMOVE_ADMIN_SUCCESS),
        map(action => new LoadAdminRequest())
    );

    constructor(
        private actions$: Actions,
        private adminService: AdminService,
        private store: Store<fromAdmin.State>
    ) { }
}
