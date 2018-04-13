import { Injectable } from '@angular/core';
import { Effect, Actions } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';

import * as providerActions from '../action/provider-collection.action';
import * as draftActions from '../action/draft-collection.action';
import { MetadataProvider } from '../../domain/model/metadata-provider';
import { EntityDescriptorService } from '../../domain/service/entity-descriptor.service';
import { removeNulls } from '../../shared/util';

@Injectable()
export class ProviderCollectionEffects {

    @Effect()
    loadProviders$ = this.actions$
        .ofType<providerActions.LoadProviderRequest>(providerActions.LOAD_PROVIDER_REQUEST)
        .switchMap(() =>
            this.descriptorService
                .query()
                .map(descriptors => new providerActions.LoadProviderSuccess(descriptors))
                .catch(error => Observable.of(new providerActions.LoadProviderError(error)))
        );

    @Effect()
    updateProvider$ = this.actions$
        .ofType<providerActions.UpdateProviderRequest>(providerActions.UPDATE_PROVIDER_REQUEST)
        .map(action => action.payload)
        .switchMap(provider => {
            delete provider.modifiedDate;
            delete provider.createdDate;
            return this.descriptorService
                .update(provider)
                .map(p => new providerActions.UpdateProviderSuccess(p))
                .catch(err => Observable.of(new providerActions.UpdateProviderFail(err)));
        });
    @Effect({ dispatch: false })
    updateProviderSuccessRedirect$ = this.actions$
        .ofType<providerActions.UpdateProviderSuccess>(providerActions.UPDATE_PROVIDER_SUCCESS)
        .map(action => action.payload)
        .do(provider => {
            this.router.navigate(['/dashboard']);
        });
    @Effect()
    updateProviderSuccessReload$ = this.actions$
        .ofType<providerActions.UpdateProviderSuccess>(providerActions.UPDATE_PROVIDER_SUCCESS)
        .map(action => action.payload)
        .map(provider => new providerActions.LoadProviderRequest());

    @Effect()
    selectProvider$ = this.actions$
        .ofType<providerActions.SelectProvider>(providerActions.SELECT)
        .map(action => action.payload)
        .switchMap(id =>
            this.descriptorService
                .find(id)
                .map(p => new providerActions.SelectProviderSuccess(p))
        );

    @Effect()
    addProviderRequest$ = this.actions$
        .ofType<providerActions.AddProviderRequest>(providerActions.ADD_PROVIDER)
        .map(action => action.payload)
        .map(provider => {
            return {
                ...provider,
                relyingPartyOverrides: removeNulls(provider.relyingPartyOverrides)
            };
        })
        .switchMap(provider =>
            this.descriptorService
                .save(provider)
                .map(p => new providerActions.AddProviderSuccess(p))
                .catch(() => Observable.of(new providerActions.AddProviderFail(provider)))
        );

    @Effect({ dispatch: false })
    addProviderSuccessRedirect$ = this.actions$
        .ofType<providerActions.AddProviderSuccess>(providerActions.ADD_PROVIDER_SUCCESS)
        .map(action => action.payload)
        .do(provider => {
            this.router.navigate(['/dashboard']);
        });
    @Effect()
    addProviderSuccessReload$ = this.actions$
        .ofType<providerActions.AddProviderSuccess>(providerActions.ADD_PROVIDER_SUCCESS)
        .map(action => action.payload)
        .map(provider => new providerActions.LoadProviderRequest());

    @Effect()
    addProviderSuccessRemoveDraft$ = this.actions$
        .ofType<providerActions.AddProviderSuccess>(providerActions.ADD_PROVIDER_SUCCESS)
        .map(action => action.payload)
        .map(provider => new draftActions.RemoveDraftRequest(provider));

    @Effect()
    uploadProviderRequest$ = this.actions$
        .ofType<providerActions.UploadProviderRequest>(providerActions.UPLOAD_PROVIDER_REQUEST)
        .map(action => action.payload)
        .switchMap(file =>
            this.descriptorService
                .upload(file.name, file.body)
                .map(p => new providerActions.AddProviderSuccess(p))
                .catch(() => Observable.of(new providerActions.AddProviderFail(file)))
        );

    @Effect()
    createProviderFromUrlRequest$ = this.actions$
        .ofType<providerActions.CreateProviderFromUrlRequest>(providerActions.CREATE_PROVIDER_FROM_URL_REQUEST)
        .map(action => action.payload)
        .switchMap(file =>
            this.descriptorService
                .createFromUrl(file.name, file.url)
                .map(p => new providerActions.AddProviderSuccess(p))
                .catch(() => Observable.of(new providerActions.AddProviderFail(file)))
        );
    constructor(
        private descriptorService: EntityDescriptorService,
        private actions$: Actions,
        private router: Router
    ) { }
} /* istanbul ignore next */
