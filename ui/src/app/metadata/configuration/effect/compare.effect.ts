import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { switchMap, catchError, tap, withLatestFrom } from 'rxjs/operators';
import { of } from 'rxjs';
import { MetadataHistoryService } from '../service/history.service';
import { CompareVersionRequest, CompareActionTypes } from '../action/compare.action';
import { Store } from '@ngrx/store';
import { State, getConfigurationModel } from '../reducer';
import { ActivatedRoute, RouterState, RouterStateSnapshot } from '@angular/router';

@Injectable()
export class CompareVersionEffects {

    @Effect({dispatch: false})
    compareVersionRequest$ = this.actions$.pipe(
        ofType<CompareVersionRequest>(CompareActionTypes.COMPARE_METADATA_REQUEST),
        withLatestFrom(
            this.store.select(getConfigurationModel)
        ),
        tap((data) => console.log(data, '@type' in data[1]))
    );

    constructor(
        private historyService: MetadataHistoryService,
        private store: Store<State>,
        private actions$: Actions
    ) { }
}
