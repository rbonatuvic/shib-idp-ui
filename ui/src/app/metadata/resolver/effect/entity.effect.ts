import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';

import { switchMap, map, withLatestFrom, tap } from 'rxjs/operators';

import * as fromResolver from '../reducer';
import * as fromRoot from '../../../app.reducer';
import * as fromWizard from '../../../wizard/reducer';

import {
    ResolverEntityActionTypes,
    Clear,
    Cancel,
    UpdateChangesRequest,
    UpdateChangesSuccess,
    UpdateSaving
} from '../action/entity.action';
import * as provider from '../action/collection.action';

import { CancelContentionAction, ContentionActionTypes, ShowContentionAction } from '../../../contention/action/contention.action';

import { ResolverCollectionActionTypes } from '../action/collection.action';
import { ResolverService } from '../../domain/service/resolver.service';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { ContentionService } from '../../../contention/service/contention.service';

@Injectable()
export class EntityEffects {

    @Effect()
    updateChanges$ = this.actions$.pipe(
        ofType<UpdateChangesRequest>(ResolverEntityActionTypes.UPDATE_CHANGES_REQUEST),
        map(action => action.payload),
        withLatestFrom(
            this.store.select(fromResolver.getEntityChanges)
        ),
        map(([changes, storedChanges]) => {
            const update = { ...storedChanges, ...changes };
            return new UpdateChangesSuccess(update);
        })
    );

    @Effect({dispatch: false})
    cancelChanges$ = this.actions$.pipe(
        ofType<Cancel>(ResolverEntityActionTypes.CANCEL),
        map(() => new Clear()),
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
        switchMap(([resolver, current]) => {
            return this.service.find(resolver.id).pipe(
                map(data => new ShowContentionAction(this.contentionService.getContention(current, resolver, data, {
                    resolve: (obj) => this.store.dispatch(new provider.UpdateResolverRequest(obj)),
                    reject: (obj) => this.gotoConfiguration(resolver.id)
                })))
            );
        })
    );

    @Effect()
    $resetChangesOnContentionFail = this.actions$.pipe(
        ofType<CancelContentionAction>(ContentionActionTypes.CANCEL_CONTENTION),
        map(() => new UpdateSaving(false))
    );

    constructor(
        private store: Store<fromRoot.State>,
        private service: ResolverService,
        private actions$: Actions,
        private router: Router,
        private contentionService: ContentionService
    ) { }

    gotoConfiguration(id) {
        this.store.dispatch(new Clear());
        this.router.navigate(['metadata', 'resolver', id, 'configuration'])
    }
}
