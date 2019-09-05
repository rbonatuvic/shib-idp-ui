import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { map, catchError, switchMap } from 'rxjs/operators';

import {
    VersionActionTypes,
    SelectVersionRequest,
    SelectVersionError,
    SelectVersionSuccess
} from '../action/version.action';
import { MetadataHistoryService } from '../service/history.service';
import { of } from 'rxjs';


@Injectable()
export class VersionEffects {

    @Effect()
    selectVersionFromId$ = this.actions$.pipe(
        ofType<SelectVersionRequest>(VersionActionTypes.SELECT_VERSION_REQUEST),
        map(action => action.payload),
        switchMap(({ type, id, version }) => this.historyService.getVersion(id, type, version).pipe(
            map(v => new SelectVersionSuccess(v)),
            catchError(err => of(new SelectVersionError(err)))
        ))
    );

    constructor(
        private historyService: MetadataHistoryService,
        private actions$: Actions
    ) { }
}
