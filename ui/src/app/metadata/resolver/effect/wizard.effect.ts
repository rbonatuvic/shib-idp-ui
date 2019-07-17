import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { ActivatedRoute, Router } from '@angular/router';
import { map, filter, tap, withLatestFrom } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import {
    UpdateChanges,
    Clear,
    ResolverEntityActionTypes
} from '../action/entity.action';
import {
    ResolverCollectionActionTypes,
    AddResolverSuccess
} from '../action/collection.action';

import * as fromResolver from '../reducer';

import { EntityDraftService } from '../../domain/service/draft.service';
import { UpdateDraftRequest, SelectDraftSuccess, DraftActionTypes } from '../action/draft.action';

@Injectable()
export class WizardEffects {

    @Effect()
    updateResolver$ = this.actions$.pipe(
        ofType<UpdateChanges>(ResolverEntityActionTypes.UPDATE_CHANGES),
        map(action => action.payload),
        filter(provider => !provider.createdDate),
        withLatestFrom(this.store.select(fromResolver.getSelectedDraft)),
        map(([provider, draft]) => new UpdateDraftRequest({ ...draft, ...provider }))
    );

    @Effect()
    addResolverSuccessDiscard$ = this.actions$.pipe(
        ofType<AddResolverSuccess>(ResolverCollectionActionTypes.ADD_RESOLVER_SUCCESS),
        map(action => action.payload),
        map(provider => new Clear())
    );

    constructor(
        private store: Store<fromResolver.State>,
        private actions$: Actions,
        private draftService: EntityDraftService,
        private activatedRoute: ActivatedRoute,
        private router: Router
    ) { }
}
