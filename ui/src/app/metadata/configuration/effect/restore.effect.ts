import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { map, catchError, switchMap, withLatestFrom } from 'rxjs/operators';

import {
    RestoreActionTypes,
    RestoreVersionRequest,
    RestoreVersionSuccess,
    RestoreVersionError,
    CancelRestore
} from '../action/restore.action';
import { MetadataHistoryService } from '../service/history.service';
import { of } from 'rxjs';
import { Router } from '@angular/router';

import { AddNotification } from '../../../notification/action/notification.action';
import { Notification, NotificationType } from '../../../notification/model/notification';
import { Store } from '@ngrx/store';
import { ConfigurationState, getConfigurationModel, getVersionModel, getConfigurationModelId, getConfigurationModelKind } from '../reducer';
import { SetMetadata } from '../action/configuration.action';


@Injectable()
export class RestoreEffects {

    @Effect()
    restoreVersion$ = this.actions$.pipe(
        ofType<RestoreVersionRequest>(RestoreActionTypes.RESTORE_VERSION_REQUEST),
        withLatestFrom(
            this.store.select(getConfigurationModelId),
            this.store.select(getConfigurationModelKind),
            this.store.select(getConfigurationModel),
            this.store.select(getVersionModel)
        ),
        switchMap(([action, id, kind, current, version]) =>
            this.historyService.updateVersion(id, kind, {
                ...version,
                version: current.version
            }).pipe(
                map(v => new RestoreVersionSuccess({ id, type: kind, model: v })),
                catchError(err => of(new RestoreVersionError(err)))
            )
        )
    );

    @Effect({ dispatch: false })
    restoreVersionCancel$ = this.actions$.pipe(
        ofType<CancelRestore>(RestoreActionTypes.CANCEL_RESTORE),
        withLatestFrom(
            this.store.select(getConfigurationModelId),
            this.store.select(getConfigurationModelKind)
        ),
        switchMap(([action, id, kind]) =>
            this.router.navigate(['/', 'metadata', kind, id, 'configuration', 'history'])
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

    @Effect()
    restoreVersionSuccessReload$ = this.actions$.pipe(
        ofType<RestoreVersionSuccess>(RestoreActionTypes.RESTORE_VERSION_SUCCESS),
        map(action => action.payload),
        map(({id, type}) =>
            new SetMetadata({ id, type })
        )
    );

    constructor(
        private store: Store<ConfigurationState>,
        private historyService: MetadataHistoryService,
        private actions$: Actions,
        private router: Router
    ) { }
}
