import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Update } from '@ngrx/entity';
import { Router } from '@angular/router';

import { Observable, of } from 'rxjs';
import { switchMap, map, catchError, tap } from 'rxjs/operators';

import { DraftCollectionActionTypes, DraftCollectionActionsUnion } from '../action/draft-collection.action';
import * as actions from '../action/draft-collection.action';

import { MetadataProvider } from '../../domain/model/metadata-provider';
import { EntityDraftService } from '../../domain/service/entity-draft.service';

export const getPayload = (action: any) => action.payload;

/* istanbul ignore next */
@Injectable()
export class DraftCollectionEffects {

    @Effect()
    loadDrafts$ = this.actions$.pipe(
        ofType(DraftCollectionActionTypes.LOAD_DRAFT_REQUEST),
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
        ofType<actions.AddDraftRequest>(DraftCollectionActionTypes.ADD_DRAFT),
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
        ofType<actions.AddDraftSuccess>(DraftCollectionActionTypes.ADD_DRAFT_SUCCESS),
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
        ofType<actions.AddDraftSuccess>(DraftCollectionActionTypes.ADD_DRAFT_SUCCESS),
        map(getPayload),
        tap(provider => this.router.navigate(['provider', provider.entityId, 'wizard']))
    );

    @Effect()
    updateDraft$ = this.actions$.pipe(
        ofType<actions.UpdateDraftRequest>(DraftCollectionActionTypes.UPDATE_DRAFT_REQUEST),
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
        ofType<actions.SelectDraft>(DraftCollectionActionTypes.SELECT),
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
        ofType<actions.RemoveDraftRequest>(DraftCollectionActionTypes.REMOVE_DRAFT),
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
        ofType<actions.RemoveDraftRequest>(DraftCollectionActionTypes.REMOVE_DRAFT),
        map(getPayload),
        map(provider => new actions.LoadDraftRequest())
    );

    constructor(
        private draftService: EntityDraftService,
        private actions$: Actions,
        private router: Router
    ) { }
} /* istanbul ignore next */
