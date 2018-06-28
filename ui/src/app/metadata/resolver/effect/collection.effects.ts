import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Router } from '@angular/router';

import { of } from 'rxjs';
import { map, catchError, switchMap, tap } from 'rxjs/operators';

import * as providerActions from '../action/collection.action';
import * as draftActions from '../action/draft.action';
import { ResolverCollectionActionTypes } from '../action/collection.action';
import { ResolverService } from '../../domain/service/resolver.service';
import { removeNulls } from '../../../shared/util';

/* istanbul ignore next */
@Injectable()
export class ResolverCollectionEffects {

    @Effect()
    loadResolvers$ = this.actions$.pipe(
        ofType<providerActions.LoadResolverRequest>(ResolverCollectionActionTypes.LOAD_RESOLVER_REQUEST),
        switchMap(() =>
            this.descriptorService
                .query()
                .pipe(
                    map(descriptors => new providerActions.LoadResolverSuccess(descriptors)),
                    catchError(error => of(new providerActions.LoadResolverError(error)))
                )
        )
    );

    @Effect()
    updateResolver$ = this.actions$.pipe(
        ofType<providerActions.UpdateResolverRequest>(ResolverCollectionActionTypes.UPDATE_RESOLVER_REQUEST),
        map(action => action.payload),
        switchMap(provider => {
            delete provider.modifiedDate;
            delete provider.createdDate;
            return this.descriptorService
                .update(provider)
                .pipe(
                    map(p => new providerActions.UpdateResolverSuccess({
                        id: p.id,
                        changes: p
                    })),
                    catchError(err => of(new providerActions.UpdateResolverFail(provider)))
                );
        })
    );

    @Effect({ dispatch: false })
    updateResolverSuccessRedirect$ = this.actions$.pipe(
        ofType<providerActions.UpdateResolverSuccess>(ResolverCollectionActionTypes.UPDATE_RESOLVER_SUCCESS),
        map(action => action.payload),
        tap(provider => this.router.navigate(['metadata']))
    );

    @Effect()
    updateResolverSuccessReload$ = this.actions$.pipe(
        ofType<providerActions.UpdateResolverSuccess>(ResolverCollectionActionTypes.UPDATE_RESOLVER_SUCCESS),
        map(action => action.payload),
        map(provider => new providerActions.LoadResolverRequest())
    );

    @Effect()
    selectResolver$ = this.actions$.pipe(
        ofType<providerActions.SelectResolver>(ResolverCollectionActionTypes.SELECT),
        map(action => action.payload),
        switchMap(id =>
            this.descriptorService
                .find(id)
                .pipe(
                    map(p => new providerActions.SelectResolverSuccess(p))
                )
        )
    );

    @Effect()
    addResolverRequest$ = this.actions$.pipe(
        ofType<providerActions.AddResolverRequest>(ResolverCollectionActionTypes.ADD_RESOLVER),
        map(action => action.payload),
        map(provider => ({
            ...provider,
            relyingPartyOverrides: removeNulls(provider.relyingPartyOverrides)
        })),
        switchMap(provider =>
            this.descriptorService
                .save(provider)
                .pipe(
                    map(p => new providerActions.AddResolverSuccess(p)),
                    catchError(() => of(new providerActions.AddResolverFail(provider)))
                )
        )
    );

    @Effect({ dispatch: false })
    addResolverSuccessRedirect$ = this.actions$.pipe(
        ofType<providerActions.AddResolverSuccess>(ResolverCollectionActionTypes.ADD_RESOLVER_SUCCESS),
        map(action => action.payload),
        tap(provider => this.router.navigate(['metadata']))
    );
    @Effect()
    addResolverSuccessReload$ = this.actions$.pipe(
        ofType<providerActions.AddResolverSuccess>(ResolverCollectionActionTypes.ADD_RESOLVER_SUCCESS),
        map(action => action.payload),
        map(provider => new providerActions.LoadResolverRequest())
    );

    @Effect()
    addResolverSuccessRemoveDraft$ = this.actions$.pipe(
        ofType<providerActions.AddResolverSuccess>(ResolverCollectionActionTypes.ADD_RESOLVER_SUCCESS),
        map(action => action.payload),
        map(provider => new draftActions.RemoveDraftRequest(provider))
    );

    @Effect()
    uploadResolverRequest$ = this.actions$.pipe(
        ofType<providerActions.UploadResolverRequest>(ResolverCollectionActionTypes.UPLOAD_RESOLVER_REQUEST),
        map(action => action.payload),
        switchMap(file =>
            this.descriptorService
                .upload(file.name, file.body)
                .pipe(
                    map(p => new providerActions.AddResolverSuccess(p)),
                    catchError(() => of(new providerActions.AddResolverFail(file)))
                )
        )
    );

    @Effect()
    createResolverFromUrlRequest$ = this.actions$.pipe(
        ofType<providerActions.CreateResolverFromUrlRequest>(ResolverCollectionActionTypes.CREATE_RESOLVER_FROM_URL_REQUEST),
        map(action => action.payload),
        switchMap(file =>
            this.descriptorService
                .createFromUrl(file.name, file.url)
                .pipe(
                    map(p => new providerActions.AddResolverSuccess(p)),
                    catchError(() => of(new providerActions.AddResolverFail(file)))
                )
        )
    );

    constructor(
        private descriptorService: ResolverService,
        private actions$: Actions,
        private router: Router
    ) { }
} /* istanbul ignore next */