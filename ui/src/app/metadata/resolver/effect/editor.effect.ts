import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';

import { switchMap, map, withLatestFrom, tap } from 'rxjs/operators';

import * as fromResolver from '../reducer';
import * as fromRoot from '../../../app.reducer';

import * as editor from '../action/editor.action';
import * as provider from '../action/collection.action';

import { ShowContentionAction } from '../../../contention/action/contention.action';

import { ResolverCollectionActionTypes } from '../action/collection.action';
import { ResolverService } from '../../domain/service/resolver.service';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { ContentionService } from '../../../contention/service/contention.service';

@Injectable()
export class EditorEffects {

    @Effect()
    cancelChanges$ = this.actions$.pipe(
        ofType<editor.CancelChanges>(editor.CANCEL_CHANGES),
        map(() => new provider.LoadResolverRequest()),
        tap(() => this.router.navigate(['/dashboard']))
    );

    @Effect()
    updateResolverSuccessRedirect$ = this.actions$.pipe(
        ofType<provider.UpdateResolverSuccess>(ResolverCollectionActionTypes.UPDATE_RESOLVER_SUCCESS),
        map(action => action.payload),
        map(p => new editor.ResetChanges())
    );

    @Effect()
    openContention$ = this.actions$.pipe(
        ofType<provider.UpdateResolverFail>(ResolverCollectionActionTypes.UPDATE_RESOLVER_FAIL),
        map(action => action.payload),
        withLatestFrom(this.store.select(fromResolver.getSelectedResolver)),
        switchMap(([filter, current]) => {
            return this.service.find(filter.id).pipe(
                map(data => new ShowContentionAction(this.contentionService.getContention(current, filter, data, {
                    resolve: (obj) => this.store.dispatch(new provider.UpdateResolverRequest(obj)),
                    reject: (obj) => this.store.dispatch(new editor.CancelChanges())
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
