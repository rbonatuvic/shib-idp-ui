import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Router } from '@angular/router';

import { of } from 'rxjs';
import { switchMap, map, catchError, tap } from 'rxjs/operators';

import {
    DraftActionTypes,
    SelectDraftRequest,
    SelectDraftError,
    SelectDraftSuccess
} from '../action/draft.action';
import * as actions from '../action/draft.action';
import { EntityDraftService } from '../../domain/service/draft.service';
import * as fromResolver from '../reducer';
import { Store } from '@ngrx/store';
import { MetadataResolver } from '../../domain/model';

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

    @Effect()
    updateDraft$ = this.actions$.pipe(
        ofType<actions.UpdateDraftRequest>(DraftActionTypes.UPDATE_DRAFT_REQUEST),
        map(getPayload),
        switchMap(provider => {
            return this.draftService
                .update(provider)
                .pipe(
                    map(p => new actions.UpdateDraftSuccess({
                        id: p.id,
                        changes: p
                    }))
                );
        })
    );

    @Effect()
    selectDraft$ = this.actions$.pipe(
        ofType<SelectDraftRequest>(DraftActionTypes.SELECT_REQUEST),
        map(getPayload),
        switchMap(id =>
            this.draftService
                .find(id)
                .pipe(
                    map(p => new SelectDraftSuccess(p.id)),
                    catchError(e => of(new SelectDraftError()))
                )
        )
    );

    @Effect()
    selectDraftReload$ = this.actions$.pipe(
        ofType<SelectDraftRequest>(DraftActionTypes.SELECT_REQUEST),
        map(getPayload),
        map(id => new actions.LoadDraftRequest())
    );

    @Effect()
    removeDraft$ = this.actions$.pipe(
        ofType<actions.RemoveDraftRequest>(DraftActionTypes.REMOVE_DRAFT),
        map(getPayload),
        switchMap(provider => {
            let hasEntityId = !!provider.entityId;
            let prop = hasEntityId ? 'entityId' : 'id';
            let val = hasEntityId ? provider.entityId : provider.id;
            return this.draftService.find(val, prop).pipe(
                switchMap(selected => this.draftService.remove(selected)),
                map(p => new actions.RemoveDraftSuccess(p))
            );
        })
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
        private router: Router,
        private store: Store<fromResolver.ResolverState>
    ) { }
} /* istanbul ignore next */
