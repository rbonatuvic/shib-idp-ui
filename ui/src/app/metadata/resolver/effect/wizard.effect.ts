import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { ActivatedRoute, Router } from '@angular/router';
import { map, filter, tap, withLatestFrom } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import {
    Clear,
    ResolverEntityActionTypes,
    UpdateChangesSuccess
} from '../action/entity.action';
import {
    ResolverCollectionActionTypes,
    AddResolverSuccess
} from '../action/collection.action';

import * as fromResolver from '../reducer';

import { EntityDraftService } from '../../domain/service/draft.service';
import { UpdateDraftRequest } from '../action/draft.action';

@Injectable()
export class WizardEffects {

    @Effect()
    updateResolver$ = this.actions$.pipe(
        ofType<UpdateChangesSuccess>(ResolverEntityActionTypes.UPDATE_CHANGES_SUCCESS),
        map(action => action.payload),
        filter(provider => !provider.createdDate),
        map((provider) => new UpdateDraftRequest({ ...provider }))
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
