import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { map, catchError, switchMap } from 'rxjs/operators';

import {
    RestoreActionTypes,
    SelectVersionRestoreRequest,
    SelectVersionRestoreError,
    SelectVersionRestoreSuccess,
    RestoreVersionRequest,
    RestoreVersionSuccess,
    RestoreVersionError
} from '../action/restore.action';
import { MetadataHistoryService } from '../service/history.service';
import { of } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';

import { AddNotification } from '../../../notification/action/notification.action';
import { Notification, NotificationType } from '../../../notification/model/notification';
import { removeNulls } from '../../../shared/util';


@Injectable()
export class RestoreVersionEffects {

    @Effect()
    selectVersionFromId$ = this.actions$.pipe(
        ofType<SelectVersionRestoreRequest>(RestoreActionTypes.SELECT_VERSION_REQUEST),
        map(action => action.payload),
        switchMap(({ type, id, version }) => {
            return this.historyService.getVersion(id, version, type).pipe(
                map(v => new SelectVersionRestoreSuccess(v)),
                catchError(err => of(new SelectVersionRestoreError(err)))
            );
        })
    );

    @Effect()
    restoreVersion$ = this.actions$.pipe(
        ofType<RestoreVersionRequest>(RestoreActionTypes.RESTORE_VERSION_REQUEST),
        map(action => action.payload),
        switchMap(({ id, type, version }) =>
            this.historyService.restoreVersion(id, type, version).pipe(
                map(v => new RestoreVersionSuccess({ id, type, model: v })),
                catchError(err => of(new RestoreVersionError(err)))
            )
        )
    );

    @Effect()
    restoreVersionSuccessNotification$ = this.actions$.pipe(
        ofType<RestoreVersionSuccess>(RestoreActionTypes.RESTORE_VERSION_SUCCESS),
        map(action => action.payload),
        map((data) =>
            new AddNotification(new Notification(
                NotificationType.Success,
                `Version Restored!`,
                5000
            ))
        )
    );

    @Effect({dispatch: false})
    restoreVersionSuccessRedirect$ = this.actions$.pipe(
        ofType<RestoreVersionSuccess>(RestoreActionTypes.RESTORE_VERSION_SUCCESS),
        map(action => action.payload),
        switchMap((data) =>
            this.router.navigate(['/metadata', data.type, data.id, 'configuration', 'options'])
        )
    );

    constructor(
        private historyService: MetadataHistoryService,
        private actions$: Actions,
        private router: Router,
        private route: ActivatedRoute
    ) { }
}
