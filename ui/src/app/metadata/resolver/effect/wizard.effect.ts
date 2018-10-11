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



@Injectable()
export class WizardEffects {

    @Effect({ dispatch: false })
    updateResolver$ = this.actions$.pipe(
        ofType<UpdateChanges>(ResolverEntityActionTypes.UPDATE_CHANGES),
        map(action => action.payload),
        switchMap(provider => this.draftService.update(provider))
    );

    @Effect()
    addResolverSuccessDiscard$ = this.actions$.pipe(
        ofType<AddResolverSuccess>(ResolverCollectionActionTypes.ADD_RESOLVER_SUCCESS),
        map(action => action.payload),
        map(provider => new Clear())
    );

    @Effect({ dispatch: false })
    updateIndexInUrl$ = this.actions$.pipe(
        ofType<SetIndex>(WizardActionTypes.SET_INDEX),
        map(action => action.payload),
        tap(index => {
            const params = { ...this.activatedRoute.snapshot.queryParams, index };
            this.router.navigate([], {
                relativeTo: this.activatedRoute,
                queryParams: params,
                queryParamsHandling: 'preserve'
            });
        })
    );

    @Effect({ dispatch: false })
    updateEntityIdInUrl$ = this.actions$.pipe(
        ofType<UpdateChanges>(ResolverEntityActionTypes.UPDATE_CHANGES),
        map(action => action.payload),
        withLatestFrom(this.store.select(fromResolver.getEntityChanges)),
        map(([id, changes]) => changes.entityId ),
        tap(entityId => {
            const params = { ...this.activatedRoute.snapshot.queryParams, entityId };
            this.router.navigate([], {
                relativeTo: this.activatedRoute,
                queryParams: params,
                queryParamsHandling: 'preserve'
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
