import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';

import { map, switchMap } from 'rxjs/operators';

import {
    UpdateChanges,
    Clear,
    ResolverEntityActionTypes
} from '../action/entity.action';
import * as provider from '../action/collection.action';
import { ResolverCollectionActionTypes } from '../action/collection.action';
import { EntityDraftService } from '../../domain/service/draft.service';

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
        ofType<provider.AddResolverSuccess>(ResolverCollectionActionTypes.ADD_RESOLVER_SUCCESS),
        map(action => action.payload),
        map(provider => new Clear())
    );

    constructor(
        private actions$: Actions,
        private draftService: EntityDraftService
    ) { }
}
