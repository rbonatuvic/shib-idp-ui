import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { switchMap, map } from 'rxjs/operators';
import {
    LoadAdminRequest,
    AdminCollectionActionTypes,
    LoadAdminSuccess,
    UpdateAdminRequest,
    UpdateAdminSuccess,
    RemoveAdminRequest,
    RemoveAdminSuccess
} from '../action/admin-collection.action';
import { AdminService } from '../service/admin.service';
import { AddNotification } from '../../notification/action/notification.action';
import { Notification, NotificationType } from '../../notification/model/notification';


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
    updateAdminRoleReload$ = this.actions$.pipe(
        ofType<UpdateAdminSuccess>(AdminCollectionActionTypes.UPDATE_ADMIN_SUCCESS),
        map(action => new LoadAdminRequest())
    );

    @Effect()
    updateAdminRoleSuccess$ = this.actions$.pipe(
        ofType<UpdateAdminSuccess>(AdminCollectionActionTypes.UPDATE_ADMIN_SUCCESS),
        map(action => action.payload),
        map(user => new AddNotification(
            new Notification(
                NotificationType.Success,
                `User update successful for ${ user.changes.username }`,
                5000
            )
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

    @Effect()
    deleteAdminRoleSuccess$ = this.actions$.pipe(
        ofType<RemoveAdminSuccess>(AdminCollectionActionTypes.REMOVE_ADMIN_SUCCESS),
        map(action => action.payload),
        map(user => new AddNotification(
            new Notification(
                NotificationType.Success,
                `User deleted.`,
                5000
            )
        ))
    );

    constructor(
        private actions$: Actions,
        private adminService: AdminService
    ) { }
}
