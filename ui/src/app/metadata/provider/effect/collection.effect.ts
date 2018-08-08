import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';

import { of } from 'rxjs';
import { map, catchError, switchMap, tap, withLatestFrom } from 'rxjs/operators';
import {
    ProviderCollectionActionsUnion,
    ProviderCollectionActionTypes,
    AddProviderRequest,
    AddProviderSuccess,
    AddProviderFail,
    LoadProviderRequest,
    LoadProviderSuccess,
    LoadProviderError,
    SelectProviderRequest,
    SelectProviderSuccess,
    SelectProviderError,
    UpdateProviderRequest,
    UpdateProviderSuccess,
    UpdateProviderFail
} from '../action/collection.action';
import { MetadataProviderService } from '../../domain/service/provider.service';
import * as fromProvider from '../reducer';
import * as fromRoot from '../../../app.reducer';
import { AddFilterSuccess, FilterCollectionActionTypes } from '../../filter/action/collection.action';


/* istanbul ignore next */
@Injectable()
export class CollectionEffects {

    @Effect()
    loadProviders$ = this.actions$.pipe(
        ofType<LoadProviderRequest>(ProviderCollectionActionTypes.LOAD_PROVIDER_REQUEST),
        switchMap(() =>
            this.providerService
                .query()
                .pipe(
                    map(providers => new LoadProviderSuccess(providers)),
                    catchError(error => of(new LoadProviderError(error)))
                )
        )
    );

    @Effect()
    selectProviders$ = this.actions$.pipe(
        ofType<SelectProviderRequest>(ProviderCollectionActionTypes.SELECT_PROVIDER_REQUEST),
        map(action => action.payload),
        switchMap(id =>
            this.providerService
                .find(id)
                .pipe(
                    map(provider => new SelectProviderSuccess({ id, changes: provider })),
                    catchError(error => of(new SelectProviderError(error)))
                )
        )
    );

    @Effect()
    createProvider$ = this.actions$.pipe(
        ofType<AddProviderRequest>(ProviderCollectionActionTypes.ADD_PROVIDER_REQUEST),
        map(action => action.payload),
        switchMap(provider =>
            this.providerService
                .save(provider)
                .pipe(
                    map(p => new AddProviderSuccess(p)),
                    catchError((e) => of(new AddProviderFail(e)))
                )
        )
    );

    @Effect({ dispatch: false })
    createProviderSuccessRedirect$ = this.actions$.pipe(
        ofType<AddProviderSuccess>(ProviderCollectionActionTypes.ADD_PROVIDER_SUCCESS),
        map(action => action.payload),
        tap(provider => this.router.navigate(['metadata', 'manager', 'providers']))
    );

    @Effect()
    updateProvider$ = this.actions$.pipe(
        ofType<UpdateProviderRequest>(ProviderCollectionActionTypes.UPDATE_PROVIDER_REQUEST),
        map(action => action.payload),
        withLatestFrom(this.store.select(fromProvider.getSelectedProvider)),
        map(([updates, original]) => ({ ...original, ...updates })),
        switchMap(provider =>
            this.providerService
                .update(provider)
                .pipe(
                    map(p => new UpdateProviderSuccess({id: p.id, changes: p})),
                    catchError((e) => of(new UpdateProviderFail(e)))
                )
        )
    );

    @Effect({ dispatch: false })
    updateProviderSuccessReload$ = this.actions$.pipe(
        ofType<UpdateProviderSuccess>(ProviderCollectionActionTypes.UPDATE_PROVIDER_SUCCESS),
        map(action => action.payload),
        tap(provider => this.store.dispatch(new LoadProviderRequest()))
    );

    @Effect({ dispatch: false })
    updateProviderSuccessRedirect$ = this.actions$.pipe(
        ofType<UpdateProviderSuccess>(ProviderCollectionActionTypes.UPDATE_PROVIDER_SUCCESS),
        map(action => action.payload),
        tap(provider => this.router.navigate(['metadata', 'manager', 'providers']))
    );

    @Effect()
    addProviderSuccessReload$ = this.actions$.pipe(
        ofType<AddProviderSuccess>(ProviderCollectionActionTypes.ADD_PROVIDER_SUCCESS),
        map(action => action.payload),
        map(provider => new LoadProviderRequest())
    );

    @Effect({ dispatch: false })
    newFilterSuccessUpdate = this.actions$.pipe(
        ofType<AddFilterSuccess>(FilterCollectionActionTypes.ADD_FILTER_SUCCESS),
        map(action => action.payload),
        withLatestFrom(this.store.select(fromProvider.getSelectedProviderId)),
        map(([filter, id]) => id),
        tap(id => {
            this.store.dispatch(new SelectProviderRequest(id));
        })
    );

    constructor(
        private actions$: Actions,
        private router: Router,
        private store: Store<fromRoot.State>,
        private providerService: MetadataProviderService
    ) { }
} /* istanbul ignore next */
