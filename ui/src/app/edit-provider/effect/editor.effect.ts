import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';

import { switchMap, map, withLatestFrom, tap } from 'rxjs/operators';

import * as fromCollection from '../../domain/reducer';
import * as fromRoot from '../../app.reducer';

import * as editor from '../action/editor.action';
import * as provider from '../../domain/action/provider-collection.action';

import { ShowContentionAction } from '../../contention/action/contention.action';
import { Contention, ContentionEntity } from '../../contention/model/contention';

import { ProviderCollectionActionTypes } from '../../domain/action/provider-collection.action';
import { MetadataProvider } from '../../domain/model/metadata-provider';
import { EntityDescriptorService } from '../../domain/service/entity-descriptor.service';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { MetadataResolverService } from '../../domain/service/metadata-resolver.service';
import { ContentionService } from '../../contention/service/contention.service';

@Injectable()
export class EditorEffects {

    @Effect()
    cancelChanges$ = this.actions$.pipe(
        ofType<editor.CancelChanges>(editor.CANCEL_CHANGES),
        map(() => new provider.LoadProviderRequest()),
        tap(() => this.router.navigate(['/dashboard']))
    );

    @Effect()
    updateProviderSuccessRedirect$ = this.actions$.pipe(
        ofType<provider.UpdateProviderSuccess>(ProviderCollectionActionTypes.UPDATE_PROVIDER_SUCCESS),
        map(action => action.payload),
        map(p => new editor.ResetChanges())
    );

    @Effect()
    openContention$ = this.actions$.pipe(
        ofType<provider.UpdateProviderFail>(ProviderCollectionActionTypes.UPDATE_PROVIDER_FAIL),
        map(action => action.payload),
        withLatestFrom(this.store.select(fromCollection.getSelectedProvider)),
        switchMap(([filter, current]) => {
            return this.service.find(filter.id).pipe(
                map(data => new ShowContentionAction(this.contentionService.getContention(current, filter, data, {
                    resolve: (obj) => this.store.dispatch(new provider.UpdateProviderRequest(obj)),
                    reject: (obj) => this.store.dispatch(new editor.CancelChanges())
                })))
            );
        })
    );

    constructor(
        private store: Store<fromRoot.State>,
        private service: EntityDescriptorService,
        private actions$: Actions,
        private router: Router,
        private contentionService: ContentionService
    ) { }
}
