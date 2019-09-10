import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { map, catchError, switchMap, tap, withLatestFrom } from 'rxjs/operators';

import {
    ResolverCollectionActionTypes,
    LoadResolverRequest,
    LoadResolverSuccess,
    LoadResolverError,
    AddResolverRequest,
    AddResolverSuccess,
    AddResolverFail,
    RemoveResolverRequest,
    RemoveResolverSuccess,
    RemoveResolverFail,
    SelectResolver,
    SelectResolverSuccess,
    UpdateResolverRequest,
    UpdateResolverSuccess,
    UpdateResolverFail,
    UpdateResolverConflict,
    UploadResolverRequest,
    CreateResolverFromUrlRequest
} from '../action/collection.action';
import * as draftActions from '../action/draft.action';
import {  } from '../action/collection.action';
import { ResolverService } from '../../domain/service/resolver.service';
import { removeNulls } from '../../../shared/util';
import { AddNotification } from '../../../notification/action/notification.action';
import { Notification, NotificationType } from '../../../notification/model/notification';
import { I18nService } from '../../../i18n/service/i18n.service';
import * as fromRoot from '../../../app.reducer';
import * as fromI18n from '../../../i18n/reducer';
import { FileBackedHttpMetadataResolver } from '../../domain/entity';
import { UpdateSaving } from '../action/entity.action';


/* istanbul ignore next */
@Injectable()
export class ResolverCollectionEffects {

    @Effect()
    loadResolvers$ = this.actions$.pipe(
        ofType<LoadResolverRequest>(ResolverCollectionActionTypes.LOAD_RESOLVER_REQUEST),
        switchMap(() =>
            this.descriptorService
                .query()
                .pipe(
                    map(descriptors => new LoadResolverSuccess(descriptors)),
                    catchError(error => of(new LoadResolverError(error)))
                )
        )
    );

    @Effect()
    updateResolver$ = this.actions$.pipe(
        ofType<UpdateResolverRequest>(ResolverCollectionActionTypes.UPDATE_RESOLVER_REQUEST),
        map(action => action.payload),
        switchMap(provider => {
            return this.descriptorService
                .update(removeNulls(provider))
                .pipe(
                    map(p => new UpdateResolverSuccess({
                        id: p.id,
                        changes: p
                    })),
                    catchError(err => {
                        if (err.status === 409) {
                            return of(new UpdateResolverConflict(provider));
                        }
                        return of(new UpdateResolverFail({
                            errorCode: err.status,
                            errorMessage: `${err.statusText} - ${err.message}`
                        }));
                    })
                );
        })
    );

    @Effect()
    updateResolverSavingOnRequest$ = this.actions$.pipe(
        ofType<UpdateResolverRequest>(ResolverCollectionActionTypes.UPDATE_RESOLVER_REQUEST),
        map(action => new UpdateSaving(true)),
    );

    @Effect()
    updateResolverSavingOnResult$ = this.actions$.pipe(
        ofType<UpdateResolverSuccess | UpdateResolverFail>(
            ResolverCollectionActionTypes.UPDATE_RESOLVER_SUCCESS,
            ResolverCollectionActionTypes.UPDATE_RESOLVER_FAIL
        ),
        map(action => new UpdateSaving(false)),
    );

    @Effect({ dispatch: false })
    updateResolverSuccessRedirect$ = this.actions$.pipe(
        ofType<UpdateResolverSuccess>(ResolverCollectionActionTypes.UPDATE_RESOLVER_SUCCESS),
        map(action => action.payload),
        tap(provider => this.router.navigate(['metadata', 'resolver', provider.id, 'configuration']))
    );

    @Effect()
    updateResolverFailNotification$ = this.actions$.pipe(
        ofType<UpdateResolverFail>(ResolverCollectionActionTypes.UPDATE_RESOLVER_FAIL),
        map(action => action.payload),
        withLatestFrom(this.store.select(fromI18n.getMessages)),
        map(([error, messages]) => new AddNotification(
            new Notification(
                NotificationType.Danger,
                `${error.errorCode}: ${this.i18nService.translate(error.errorMessage, null, messages)}`,
                8000
            )
        ))
    );

    @Effect()
    selectResolver$ = this.actions$.pipe(
        ofType<SelectResolver>(ResolverCollectionActionTypes.SELECT),
        map(action => action.payload),
        switchMap(id =>
            this.descriptorService
                .find(id)
                .pipe(
                    map(p => new SelectResolverSuccess(p))
                )
        )
    );

    @Effect()
    addResolverRequest$ = this.actions$.pipe(
        ofType<AddResolverRequest>(ResolverCollectionActionTypes.ADD_RESOLVER),
        map(action => action.payload),
        map(provider => {
            return ({
                ...provider,
                relyingPartyOverrides: removeNulls(provider.relyingPartyOverrides)
            });
        }),
        switchMap(provider =>
            this.descriptorService
                .save(provider)
                .pipe(
                    map(p => new AddResolverSuccess(p)),
                    catchError(() => of(new AddResolverFail(provider)))
                )
        )
    );

    @Effect({ dispatch: false })
    addResolverSuccessRedirect$ = this.actions$.pipe(
        ofType<AddResolverSuccess>(ResolverCollectionActionTypes.ADD_RESOLVER_SUCCESS),
        map(action => action.payload),
        tap(provider => this.router.navigate(['dashboard']))
    );

    @Effect()
    addResolverSuccessRemoveDraft$ = this.actions$.pipe(
        ofType<AddResolverSuccess>(ResolverCollectionActionTypes.ADD_RESOLVER_SUCCESS),
        map(action => action.payload),
        map(provider => {
            return new draftActions.RemoveDraftRequest(provider);
        })
    );

    @Effect()
    addResolverFailNotification$ = this.actions$.pipe(
        ofType<AddResolverFail>(ResolverCollectionActionTypes.ADD_RESOLVER_FAIL),
        map(action => action.payload),
        withLatestFrom(this.store.select(fromI18n.getMessages)),
        map(([error, messages]) => new AddNotification(
            new Notification(
                NotificationType.Danger,
                `${error.errorCode}: ${this.i18nService.translate(error.errorMessage, null, messages)}`,
                8000
            )
        ))
    );

    @Effect()
    uploadResolverRequest$ = this.actions$.pipe(
        ofType<UploadResolverRequest>(ResolverCollectionActionTypes.UPLOAD_RESOLVER_REQUEST),
        map(action => action.payload),
        switchMap(file =>
            this.descriptorService
                .upload(file.name, file.body)
                .pipe(
                    map(p => new AddResolverSuccess(p)),
                    catchError((error) => of(new AddResolverFail(error)))
                )
        )
    );

    @Effect()
    createResolverFromUrlRequest$ = this.actions$.pipe(
        ofType<CreateResolverFromUrlRequest>(ResolverCollectionActionTypes.CREATE_RESOLVER_FROM_URL_REQUEST),
        map(action => action.payload),
        switchMap(file =>
            this.descriptorService
                .createFromUrl(file.name, file.url)
                .pipe(
                    map(p => new AddResolverSuccess(p)),
                    catchError((error) => of(new AddResolverFail(error)))
                )
        )
    );

    @Effect()
    removeResolver$ = this.actions$.pipe(
        ofType<RemoveResolverRequest>(ResolverCollectionActionTypes.REMOVE_RESOLVER),
        map(action => action.payload),
        switchMap(entity =>
            this.descriptorService
                .remove(entity)
                .pipe(
                    map(p => new RemoveResolverSuccess(p)),
                    catchError(err => of(new RemoveResolverFail(err)))
                )
        )
    );

    constructor(
        private descriptorService: ResolverService,
        private actions$: Actions,
        private router: Router,
        private store: Store<fromRoot.State>,
        private i18nService: I18nService
    ) { }
} /* istanbul ignore next */
