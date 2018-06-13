import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Router } from '@angular/router';

import { of } from 'rxjs';
import { map, catchError, switchMap, tap } from 'rxjs/operators';

import * as providerActions from '../action/provider-collection.action';
import * as draftActions from '../action/draft-collection.action';
import { ProviderCollectionActionTypes } from '../action/provider-collection.action';
import { EntityDescriptorService } from '../../domain/service/entity-descriptor.service';
import { removeNulls } from '../../../shared/util';

/* istanbul ignore next */
@Injectable()
export class ProviderCollectionEffects {

    @Effect()
    loadProviders$ = this.actions$.pipe(
        ofType<providerActions.LoadProviderRequest>(ProviderCollectionActionTypes.LOAD_PROVIDER_REQUEST),
        switchMap(() =>
            this.descriptorService
                .query()
                .pipe(
                    map(descriptors => new providerActions.LoadProviderSuccess(descriptors)),
                    catchError(error => of(new providerActions.LoadProviderError(error)))
                )
        )
    );

    @Effect()
    updateProvider$ = this.actions$.pipe(
        ofType<providerActions.UpdateProviderRequest>(ProviderCollectionActionTypes.UPDATE_PROVIDER_REQUEST),
        map(action => action.payload),
        switchMap(provider => {
            delete provider.modifiedDate;
            delete provider.createdDate;
            return this.descriptorService
                .update(provider)
                .pipe(
                    map(p => new providerActions.UpdateProviderSuccess({
                        id: p.id,
                        changes: p
                    })),
                    catchError(err => of(new providerActions.UpdateProviderFail(provider)))
                );
        })
    );

    @Effect({ dispatch: false })
    updateProviderSuccessRedirect$ = this.actions$.pipe(
        ofType<providerActions.UpdateProviderSuccess>(ProviderCollectionActionTypes.UPDATE_PROVIDER_SUCCESS),
        map(action => action.payload),
        tap(provider => this.router.navigate(['/dashboard']))
    );

    @Effect()
    updateProviderSuccessReload$ = this.actions$.pipe(
        ofType<providerActions.UpdateProviderSuccess>(ProviderCollectionActionTypes.UPDATE_PROVIDER_SUCCESS),
        map(action => action.payload),
        map(provider => new providerActions.LoadProviderRequest())
    );

    @Effect()
    selectProvider$ = this.actions$.pipe(
        ofType<providerActions.SelectProvider>(ProviderCollectionActionTypes.SELECT),
        map(action => action.payload),
        switchMap(id =>
            this.descriptorService
                .find(id)
                .pipe(
                    map(p => new providerActions.SelectProviderSuccess(p))
                )
        )
    );

    @Effect()
    addProviderRequest$ = this.actions$.pipe(
        ofType<providerActions.AddProviderRequest>(ProviderCollectionActionTypes.ADD_PROVIDER),
        map(action => action.payload),
        map(provider => ({
            ...provider,
            relyingPartyOverrides: removeNulls(provider.relyingPartyOverrides)
        })),
        switchMap(provider =>
            this.descriptorService
                .save(provider)
                .pipe(
                    map(p => new providerActions.AddProviderSuccess(p)),
                    catchError(() => of(new providerActions.AddProviderFail(provider)))
                )
        )
    );

    @Effect({ dispatch: false })
    addProviderSuccessRedirect$ = this.actions$.pipe(
        ofType<providerActions.AddProviderSuccess>(ProviderCollectionActionTypes.ADD_PROVIDER_SUCCESS),
        map(action => action.payload),
        tap(provider => this.router.navigate(['/dashboard']))
    );
    @Effect()
    addProviderSuccessReload$ = this.actions$.pipe(
        ofType<providerActions.AddProviderSuccess>(ProviderCollectionActionTypes.ADD_PROVIDER_SUCCESS),
        map(action => action.payload),
        map(provider => new providerActions.LoadProviderRequest())
    );

    @Effect()
    addProviderSuccessRemoveDraft$ = this.actions$.pipe(
        ofType<providerActions.AddProviderSuccess>(ProviderCollectionActionTypes.ADD_PROVIDER_SUCCESS),
        map(action => action.payload),
        map(provider => new draftActions.RemoveDraftRequest(provider))
    );

    @Effect()
    uploadProviderRequest$ = this.actions$.pipe(
        ofType<providerActions.UploadProviderRequest>(ProviderCollectionActionTypes.UPLOAD_PROVIDER_REQUEST),
        map(action => action.payload),
        switchMap(file =>
            this.descriptorService
                .upload(file.name, file.body)
                .pipe(
                    map(p => new providerActions.AddProviderSuccess(p)),
                    catchError(() => of(new providerActions.AddProviderFail(file)))
                )
        )
    );

    @Effect()
    createProviderFromUrlRequest$ = this.actions$.pipe(
        ofType<providerActions.CreateProviderFromUrlRequest>(ProviderCollectionActionTypes.CREATE_PROVIDER_FROM_URL_REQUEST),
        map(action => action.payload),
        switchMap(file =>
            this.descriptorService
                .createFromUrl(file.name, file.url)
                .pipe(
                    map(p => new providerActions.AddProviderSuccess(p)),
                    catchError(() => of(new providerActions.AddProviderFail(file)))
                )
        )
    );

    constructor(
        private descriptorService: EntityDescriptorService,
        private actions$: Actions,
        private router: Router
    ) { }
} /* istanbul ignore next */
