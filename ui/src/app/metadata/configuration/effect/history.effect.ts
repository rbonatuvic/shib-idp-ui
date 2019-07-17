import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { switchMap, catchError, map } from 'rxjs/operators';
import { of } from 'rxjs';
import { LoadHistoryRequest, HistoryActionTypes, LoadHistorySuccess, LoadHistoryError, SetHistory } from '../action/history.action';
import { MetadataHistoryService } from '../service/history.service';

@Injectable()
export class MetadataHistoryEffects {

    @Effect()
    loadHistory$ = this.actions$.pipe(
        ofType<LoadHistoryRequest>(HistoryActionTypes.LOAD_HISTORY_REQUEST),
        switchMap(action =>
            this.historyService
                .query(action.payload.id, action.payload.type)
                .pipe(
                    map(history => new LoadHistorySuccess(history)),
                    catchError(error => of(new LoadHistoryError(error)))
                )
        )
    );

    @Effect()
    loadHistorySuccess$ = this.actions$.pipe(
        ofType<LoadHistorySuccess>(HistoryActionTypes.LOAD_HISTORY_SUCCESS),
        map(action => new SetHistory(action.payload))
    );

    constructor(
        private historyService: MetadataHistoryService,
        private actions$: Actions
    ) { }
}
