import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';

import { switchMap, map, withLatestFrom, tap } from 'rxjs/operators';

import * as fromResolver from '../reducer';
import * as fromRoot from '../../../app.reducer';

import {
    ResolverEntityActionTypes,
    Clear,
    Cancel
} from '../action/entity.action';
import * as provider from '../action/collection.action';

import { ShowContentionAction } from '../../../contention/action/contention.action';

import { ResolverCollectionActionTypes } from '../action/collection.action';
import { ResolverService } from '../../domain/service/resolver.service';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { ContentionService } from '../../../contention/service/contention.service';

@Injectable()
export class EntityEffects {

    @Effect()
    cancelChanges$ = this.actions$.pipe(
        ofType<Cancel>(ResolverEntityActionTypes.CANCEL),
        map(() => new provider.LoadResolverRequest()),
        tap(() => this.router.navigate(['dashboard']))
    );

    @Effect()
    updateResolverSuccessClear$ = this.actions$.pipe(
        ofType<provider.UpdateResolverSuccess>(ResolverCollectionActionTypes.UPDATE_RESOLVER_SUCCESS),
        map(action => action.payload),
        map(p => new Clear())
    );

    @Effect()
    openContention$ = this.actions$.pipe(
        ofType<provider.UpdateResolverConflict>(ResolverCollectionActionTypes.UPDATE_RESOLVER_CONFLICT),
        map(action => action.payload),
        withLatestFrom(this.store.select(fromResolver.getSelectedResolver)),
        switchMap(([filter, current]) => {
            return this.service.find(filter.id).pipe(
                map(data => new ShowContentionAction(this.contentionService.getContention(current, filter, data, {
                    resolve: (obj) => this.store.dispatch(new provider.UpdateResolverRequest(obj)),
                    reject: (obj) => this.store.dispatch(new Cancel())
                })))
            );
        })
    );

    constructor(
        private store: Store<fromRoot.State>,
        private service: ResolverService,
        private actions$: Actions,
        private router: Router,
        private contentionService: ContentionService
    ) { }
}
