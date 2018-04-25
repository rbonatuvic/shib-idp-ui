import { Injectable } from '@angular/core';
import { Effect, Actions } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Update } from '@ngrx/entity';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';

import { DraftCollectionActionTypes, DraftCollectionActionsUnion } from '../action/draft-collection.action';
import * as actions from '../action/draft-collection.action';

import { MetadataProvider } from '../../domain/model/metadata-provider';
import { EntityDraftService } from '../../domain/service/entity-draft.service';

@Injectable()
export class DraftCollectionEffects {

    @Effect()
    loadDrafts$ = this.actions$
        .ofType(DraftCollectionActionTypes.LOAD_DRAFT_REQUEST)
        .switchMap(() =>
            this.draftService
                .query()
                .map(descriptors => new actions.LoadDraftSuccess(descriptors))
                .catch(error => Observable.of(new actions.LoadDraftError(error)))
        );

    @Effect()
    addDraft$ = this.actions$
        .ofType<actions.AddDraftRequest>(DraftCollectionActionTypes.ADD_DRAFT)
        .map(action => action.payload)
        .switchMap(provider => {
            return this.draftService
                .save(provider)
                .map(p => new actions.AddDraftSuccess(provider));
        });

    @Effect()
    addDraftSuccessReload$ = this.actions$
        .ofType<actions.AddDraftSuccess>(DraftCollectionActionTypes.ADD_DRAFT_SUCCESS)
        .map(action => action.payload)
        .switchMap(provider =>
            this.draftService
                .find(provider.entityId)
                .map(p => new actions.LoadDraftRequest())
        );

    @Effect({ dispatch: false })
    addDraftSuccessRedirect$ = this.actions$
        .ofType<actions.AddDraftSuccess>(DraftCollectionActionTypes.ADD_DRAFT_SUCCESS)
        .map(action => action.payload)
        .do(provider => this.router.navigate(['provider', provider.entityId, 'wizard']));

    @Effect()
    updateDraft$ = this.actions$
        .ofType<actions.UpdateDraftRequest>(DraftCollectionActionTypes.UPDATE_DRAFT_REQUEST)
        .map(action => action.payload)
        .switchMap(provider => {
            return this.draftService
                .update(provider)
                .map(p => new actions.UpdateDraftSuccess({
                    id: p.entityId,
                    changes: p
                }));
        });

    @Effect()
    selectDraft$ = this.actions$
        .ofType<actions.SelectDraft>(DraftCollectionActionTypes.SELECT)
        .map(action => action.payload)
        .switchMap(id =>
            this.draftService
                .find(id)
                .map(p => new actions.FindDraft(p.entityId))
        );

    @Effect()
    removeDraft$ = this.actions$
        .ofType<actions.RemoveDraftRequest>(DraftCollectionActionTypes.REMOVE_DRAFT)
        .map(action => action.payload)
        .switchMap(provider =>
            this.draftService
                .remove(provider)
                .map(p => new actions.RemoveDraftSuccess(p))
        );
    @Effect()
    removeDraftSuccessReload$ = this.actions$
        .ofType<actions.RemoveDraftRequest>(DraftCollectionActionTypes.REMOVE_DRAFT)
        .map(action => action.payload)
        .map(provider =>
            new actions.LoadDraftRequest()
        );

    constructor(
        private draftService: EntityDraftService,
        private actions$: Actions,
        private router: Router
    ) { }
} /* istanbul ignore next */
