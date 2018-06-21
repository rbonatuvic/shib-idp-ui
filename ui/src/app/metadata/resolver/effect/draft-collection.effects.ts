import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Router } from '@angular/router';

import { of } from 'rxjs';
import { switchMap, map, catchError, tap } from 'rxjs/operators';

import { DraftActionTypes } from '../action/draft.action';
import * as actions from '../action/draft.action';
import { EntityDraftService } from '../../domain/service/draft.service';

export const getPayload = (action: any) => action.payload;

/* istanbul ignore next */
@Injectable()
export class DraftCollectionEffects {

    @Effect()
    loadDrafts$ = this.actions$.pipe(
        ofType(DraftActionTypes.LOAD_DRAFT_REQUEST),
        switchMap(() =>
            this.draftService
                .query()
                .pipe(
                    map(descriptors => new actions.LoadDraftSuccess(descriptors)),
                    catchError(error => of(new actions.LoadDraftError(error)))
                )
        )
    );

    @Effect()
    addDraft$ = this.actions$.pipe(
        ofType<actions.AddDraftRequest>(DraftActionTypes.ADD_DRAFT),
        map(getPayload),
        switchMap(provider =>
            this.draftService
                .save(provider)
                .pipe(
                    map(p => new actions.AddDraftSuccess(provider))
                )
        )
    );

    @Effect()
    addDraftSuccessReload$ = this.actions$.pipe(
        ofType<actions.AddDraftSuccess>(DraftActionTypes.ADD_DRAFT_SUCCESS),
        map(getPayload),
        switchMap(provider =>
            this.draftService
                .find(provider.entityId)
                .pipe(
                    map(p => new actions.LoadDraftRequest())
                )
        )
    );

    @Effect({ dispatch: false })
    addDraftSuccessRedirect$ = this.actions$.pipe(
        ofType<actions.AddDraftSuccess>(DraftActionTypes.ADD_DRAFT_SUCCESS),
        map(getPayload),
        tap(provider => this.router.navigate(['metadata', 'resolver', provider.entityId, 'wizard']))
    );

    @Effect()
    updateDraft$ = this.actions$.pipe(
        ofType<actions.UpdateDraftRequest>(DraftActionTypes.UPDATE_DRAFT_REQUEST),
        map(getPayload),
        switchMap(provider => {
            return this.draftService
                .update(provider)
                .pipe(
                    map(p => new actions.UpdateDraftSuccess({
                        id: p.entityId,
                        changes: p
                    }))
                );
        })
    );

    @Effect()
    selectDraft$ = this.actions$.pipe(
        ofType<actions.SelectDraft>(DraftActionTypes.SELECT),
        map(getPayload),
        switchMap(id =>
            this.draftService
                .find(id)
                .pipe(
                    map(p => new actions.FindDraft(p.entityId))
                )
        )
    );

    @Effect()
    removeDraft$ = this.actions$.pipe(
        ofType<actions.RemoveDraftRequest>(DraftActionTypes.REMOVE_DRAFT),
        map(getPayload),
        switchMap(provider =>
            this.draftService
                .remove(provider)
                .pipe(
                    map(p => new actions.RemoveDraftSuccess(p))
                )
        )
    );
    @Effect()
    removeDraftSuccessReload$ = this.actions$.pipe(
        ofType<actions.RemoveDraftRequest>(DraftActionTypes.REMOVE_DRAFT),
        map(getPayload),
        map(provider => new actions.LoadDraftRequest())
    );

    constructor(
        private draftService: EntityDraftService,
        private actions$: Actions,
        private router: Router
    ) { }
} /* istanbul ignore next */
