import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { ActivatedRoute, Router } from '@angular/router';
import { map, switchMap, tap, withLatestFrom } from 'rxjs/operators';
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
import { SetIndex, WizardActionTypes } from '../../../wizard/action/wizard.action';
import { UpdateDraftRequest } from '../action/draft.action';



@Injectable()
export class WizardEffects {

    @Effect()
    updateResolver$ = this.actions$.pipe(
        ofType<UpdateChanges>(ResolverEntityActionTypes.UPDATE_CHANGES),
        map(action => action.payload),
        map(provider => new UpdateDraftRequest(provider))
    );

    @Effect()
    addResolverSuccessDiscard$ = this.actions$.pipe(
        ofType<AddResolverSuccess>(ResolverCollectionActionTypes.ADD_RESOLVER_SUCCESS),
        map(action => action.payload),
        map(provider => new Clear())
    );

    @Effect({ dispatch: false })
    updateEntityIdInUrl$ = this.actions$.pipe(
        ofType<UpdateChanges>(ResolverEntityActionTypes.UPDATE_CHANGES),
        map(action => action.payload),
        withLatestFrom(
            this.store.select(fromResolver.getEntityChanges),
            this.activatedRoute.queryParams
        ),
        tap(([id, changes, params]) => {
            this.router.navigate([], {
                relativeTo: this.activatedRoute,
                queryParams: {
                    ...params,
                    entityId: changes.entityId
                },
                queryParamsHandling: 'merge'
            });
        })
    );

    constructor(
        private store: Store<fromResolver.State>,
        private actions$: Actions,
        private draftService: EntityDraftService,
        private activatedRoute: ActivatedRoute,
        private router: Router
    ) { }
}
