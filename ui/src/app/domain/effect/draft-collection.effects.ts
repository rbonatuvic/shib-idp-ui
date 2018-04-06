import { Injectable } from '@angular/core';
import { Effect, Actions } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';

import * as draftActions from '../action/draft-collection.action';
import { MetadataProvider } from '../../domain/model/metadata-provider';
import { EntityDraftService } from '../../domain/service/entity-draft.service';

@Injectable()
export class DraftCollectionEffects {

    @Effect()
    loadDrafts$ = this.actions$
        .ofType(draftActions.LOAD_DRAFT_REQUEST)
        .switchMap(() =>
            this.draftService
                .query()
                .map(descriptors => new draftActions.LoadDraftSuccess(descriptors))
                .catch(error => Observable.of(new draftActions.LoadDraftError(error)))
        );

    @Effect()
    addDraft$ = this.actions$
        .ofType<draftActions.AddDraftRequest>(draftActions.ADD_DRAFT)
        .map(action => action.payload)
        .switchMap(provider => {
            return this.draftService
                .save(provider)
                .map(p => new draftActions.AddDraftSuccess(provider));
        });

    @Effect()
    addDraftSuccessReload$ = this.actions$
        .ofType<draftActions.AddDraftSuccess>(draftActions.ADD_DRAFT_SUCCESS)
        .map(action => action.payload)
        .switchMap(provider =>
            this.draftService
                .find(provider.entityId)
                .map(p => new draftActions.LoadDraftRequest())
        );

    @Effect({ dispatch: false })
    addDraftSuccessRedirect$ = this.actions$
        .ofType<draftActions.AddDraftSuccess>(draftActions.ADD_DRAFT_SUCCESS)
        .map(action => action.payload)
        .do(provider => this.router.navigate(['provider', provider.entityId, 'wizard']));

    @Effect()
    updateDraft$ = this.actions$
        .ofType<draftActions.UpdateDraftRequest>(draftActions.UPDATE_DRAFT_REQUEST)
        .map(action => action.payload)
        .switchMap(provider => {
            return this.draftService
                .update(provider)
                .map(p => new draftActions.UpdateDraftSuccess(p));
        });

    @Effect()
    selectDraft$ = this.actions$
        .ofType<draftActions.SelectDraft>(draftActions.SELECT)
        .map(action => action.payload)
        .switchMap(id =>
            this.draftService
                .find(id)
                .map(p => new draftActions.FindDraft(p.entityId))
        );

    @Effect()
    removeDraft$ = this.actions$
        .ofType<draftActions.RemoveDraftRequest>(draftActions.REMOVE_DRAFT)
        .map(action => action.payload)
        .switchMap(provider =>
            this.draftService
                .remove(provider)
                .map(p => new draftActions.RemoveDraftSuccess(p))
        );
    @Effect()
    removeDraftSuccessReload$ = this.actions$
        .ofType<draftActions.RemoveDraftRequest>(draftActions.REMOVE_DRAFT)
        .map(action => action.payload)
        .map(provider =>
            new draftActions.LoadDraftRequest()
        );

    constructor(
        private draftService: EntityDraftService,
        private actions$: Actions,
        private router: Router
    ) { }
} /* istanbul ignore next */
