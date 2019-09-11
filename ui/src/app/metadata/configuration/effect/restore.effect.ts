import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { map, catchError, switchMap, withLatestFrom } from 'rxjs/operators';

import {
    RestoreActionTypes,
    RestoreVersionRequest,
    RestoreVersionSuccess,
    RestoreVersionError,
    CancelRestore,
    UpdateRestorationChangesRequest,
    UpdateRestorationChangesSuccess,
    SetSavingStatus
} from '../action/restore.action';
import { MetadataHistoryService } from '../service/history.service';
import { of } from 'rxjs';
import { Router } from '@angular/router';

import { AddNotification } from '../../../notification/action/notification.action';
import { Notification, NotificationType } from '../../../notification/model/notification';
import { Store } from '@ngrx/store';
import {
    ConfigurationState,
    getConfigurationModel,
    getConfigurationModelId,
    getConfigurationModelKind,
    getConfigurationDefinition,
    getRestorationModel
} from '../reducer';
import { SetMetadata } from '../action/configuration.action';
import { removeNulls } from '../../../shared/util';
import { getModel } from '../../../wizard/reducer';
import { ClearProviderSelection } from '../../provider/action/collection.action';
import { ClearResolverSelection } from '../../resolver/action/collection.action';


@Injectable()
export class RestoreEffects {

    @Effect()
    restoreVersion$ = this.actions$.pipe(
        ofType<RestoreVersionRequest>(RestoreActionTypes.RESTORE_VERSION_REQUEST),
        withLatestFrom(
            this.store.select(getConfigurationModelId),
            this.store.select(getConfigurationModelKind),
            this.store.select(getConfigurationModel),
            this.store.select(getRestorationModel)
        ),
        switchMap(([action, id, kind, current, version]) =>
            this.historyService.updateVersion(id, kind, removeNulls({
                ...version,
                version: current.version
            })).pipe(
                map(v => new RestoreVersionSuccess({ id, type: kind, model: v })),
                catchError(err => of(new RestoreVersionError(err)))
            )
        )
    );

    @Effect()
    restoreVersionSaving$ = this.actions$.pipe(
        ofType<RestoreVersionRequest>(RestoreActionTypes.RESTORE_VERSION_REQUEST),
        map(() => new SetSavingStatus(true))
    );

    @Effect()
    restoreVersionSaved$ = this.actions$.pipe(
        ofType<RestoreVersionSuccess>(RestoreActionTypes.RESTORE_VERSION_SUCCESS),
        map(() => new SetSavingStatus(false))
    );

    @Effect()
    restoreVersionError$ = this.actions$.pipe(
        ofType<RestoreVersionError>(RestoreActionTypes.RESTORE_VERSION_ERROR),
        map(() => new SetSavingStatus(false))
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
    restoreVersionSuccessClear$ = this.actions$.pipe(
        ofType<RestoreVersionSuccess>(RestoreActionTypes.RESTORE_VERSION_SUCCESS),
        map(action => action.payload),
        map(({ id, type }) =>
            type === 'provider' ? new ClearProviderSelection() : new ClearResolverSelection()
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

    @Effect()
    updateRestorationChanges$ = this.actions$.pipe(
        ofType<UpdateRestorationChangesRequest>(RestoreActionTypes.UPDATE_RESTORATION_REQUEST),
        map(action => action.payload),
        withLatestFrom(
            this.store.select(getConfigurationDefinition),
            this.store.select(getConfigurationModelKind),
            this.store.select(getConfigurationModel)
        ),
        map(([changes, definition, kind, original]) => {
            let parsed = definition.parser(changes);
            if (kind === 'provider') {
                parsed = {
                    ...parsed,
                    metadataFilters: [
                        ...original.metadataFilters,
                        ...(parsed.metadataFilters || [])
                    ]
                };
            }
            return (parsed);
        }),
        map(changes => new UpdateRestorationChangesSuccess(changes))
    );

    constructor(
        private store: Store<ConfigurationState>,
        private historyService: MetadataHistoryService,
        private actions$: Actions,
        private router: Router
    ) { }
}
