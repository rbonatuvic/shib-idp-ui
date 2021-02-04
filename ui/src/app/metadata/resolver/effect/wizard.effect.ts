import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { map, filter, withLatestFrom } from 'rxjs/operators';

import {
    Clear,
    ResolverEntityActionTypes,
    UpdateChangesSuccess
} from '../action/entity.action';
import {
    ResolverCollectionActionTypes,
    AddResolverSuccess
} from '../action/collection.action';
import { UpdateDraftRequest } from '../action/draft.action';
import * as fromRoot from '../../../app.reducer';
import { Store } from '@ngrx/store';
import { getSelectedDraftId } from '../reducer';

@Injectable()
export class WizardEffects {

    @Effect()
    updateResolver$ = this.actions$.pipe(
        ofType<UpdateChangesSuccess>(ResolverEntityActionTypes.UPDATE_CHANGES_SUCCESS),
        map(action => action.payload),
        filter(provider => !provider.createdDate),
        withLatestFrom(this.store.select(getSelectedDraftId)),
        map(([provider, id]) => {
            return new UpdateDraftRequest({ id, ...provider });
        })
    );

    @Effect()
    addResolverSuccessDiscard$ = this.actions$.pipe(
        ofType<AddResolverSuccess>(ResolverCollectionActionTypes.ADD_RESOLVER_SUCCESS),
        map(action => action.payload),
        map(provider => new Clear())
    );

    constructor(
        private store: Store<fromRoot.State>,
        private actions$: Actions
    ) { }
}
