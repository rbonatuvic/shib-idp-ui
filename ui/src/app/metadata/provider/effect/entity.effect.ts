import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

import { SelectProviderSuccess, ProviderCollectionActionTypes } from '../action/collection.action';

import * as fromProvider from '../reducer';
import { MetadataProvider } from '../../domain/model';
import { UpdateProvider } from '../action/entity.action';

@Injectable()
export class EntityEffects {

    /*
    @Effect()
    loadModelSuccess$ = this.actions$.pipe(
        ofType<SelectProviderSuccess>(ProviderCollectionActionTypes.SELECT_PROVIDER_SUCCESS),
        map(action => action.payload.changes),
        switchMap((provider: MetadataProvider) => of(new UpdateProvider(provider)))
    );
    */

    constructor(
        private store: Store<fromProvider.ProviderState>,
        private actions$: Actions
    ) { }
}
