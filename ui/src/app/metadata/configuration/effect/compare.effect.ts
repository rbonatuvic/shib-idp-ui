import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { catchError, withLatestFrom, map, filter, combineLatest, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { MetadataHistoryService } from '../service/history.service';
import {
    CompareVersionRequest,
    CompareActionTypes,
    CompareVersionSuccess,
    CompareVersionError,
    SetMetadataVersions
} from '../action/compare.action';
import { Store } from '@ngrx/store';
import { State, getConfigurationModel } from '../reducer';

@Injectable()
export class CompareVersionEffects {

    @Effect()
    compareVersionRequest$ = this.actions$.pipe(
        ofType<CompareVersionRequest>(CompareActionTypes.COMPARE_METADATA_REQUEST),
        map(action => action.payload),
        withLatestFrom(
            this.store.select(getConfigurationModel)
        ),
        switchMap(([versions, model]) => {
            const type = '@type' in model ? 'provider' : 'resolver';
            const id = '@type' in model ? model.resourceId : model.id;
            return this.historyService.getVersions(id, versions, type).pipe(
                map(v => new CompareVersionSuccess(v)),
                catchError(err => of(new CompareVersionError(err)))
            );
        })
    );

    @Effect()
    setVersionsOnSuccess$ = this.actions$.pipe(
        ofType<CompareVersionSuccess>(CompareActionTypes.COMPARE_METADATA_SUCCESS),
        map(action => action.payload),
        map(versions => new SetMetadataVersions(versions))
    );

    constructor(
        private historyService: MetadataHistoryService,
        private store: Store<State>,
        private actions$: Actions
    ) { }
}
