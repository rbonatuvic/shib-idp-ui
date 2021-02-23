import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, tap, catchError, switchMap } from 'rxjs/operators';

import {
    ShowContentionAction,
    ResolveContentionAction,
    ContentionActionTypes,
    CancelContentionAction
} from '../action/contention.action';
import { ModalService, DEFAULT_MODAL_OPTIONS } from '../../core/service/modal.service';
import { ContentionDialogComponent } from '../component/contention-dialog.component';


@Injectable()
export class ContentionEffects {

    @Effect()
    showContention$ = this.actions$.pipe(
        ofType<ShowContentionAction>(ContentionActionTypes.SHOW_CONTENTION),
        map(action => action.payload),
        switchMap(contention => {
            const resolutionAction = of(new ResolveContentionAction({ value: contention.resolutionObject, handlers: contention.handlers }));
            const rejectionAction = of(new CancelContentionAction({ value: contention.rejectionObject, handlers: contention.handlers }));
            /*if (contention.ourChanges.length < 1) {
                return rejectionAction;
            }
            if (contention.theirChanges.length < 1) {
                return resolutionAction;
            }*/
            return this.modal
                .open(ContentionDialogComponent, DEFAULT_MODAL_OPTIONS, { contention })
                .pipe(
                    switchMap(result => resolutionAction),
                    catchError(result => rejectionAction)
                );
        })
    );

    @Effect({ dispatch: false })
    resolveContention$ = this.actions$.pipe(
        ofType<ResolveContentionAction>(ContentionActionTypes.RESOLVE_CONTENTION),
        map(action => action.payload),
        tap(r => r.handlers.resolve(r.value))
    );

    @Effect({ dispatch: false })
    cancelContention$ = this.actions$.pipe(
        ofType<CancelContentionAction>(ContentionActionTypes.CANCEL_CONTENTION),
        map(action => action.payload),
        tap(r => r.handlers.reject(r.value))
    );

    constructor(
        private actions$: Actions,
        private modal: ModalService
    ) { }
}
