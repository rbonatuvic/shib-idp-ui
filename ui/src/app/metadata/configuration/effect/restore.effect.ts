import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { map, catchError, switchMap } from 'rxjs/operators';

import {
    RestoreActionTypes,
    SelectVersionRestoreRequest,
    SelectVersionRestoreError,
    SelectVersionRestoreSuccess,
    RestoreVersionRequest
} from '../action/restore.action';
import { MetadataHistoryService } from '../service/history.service';
import { of } from 'rxjs';


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
        switchMap(({ id, type, version }) => {
            return this.historyService.getVersion(id, version, type).pipe(
                map(v => new SelectVersionRestoreSuccess(v)),
                catchError(err => of(new SelectVersionRestoreError(err)))
            );
        })
    );

    constructor(
        private historyService: MetadataHistoryService,
        private actions$: Actions
    ) { }
}
