import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { map, catchError, switchMap, tap, withLatestFrom } from 'rxjs/operators';

import {
    MetadataCollectionActionTypes,
    LoadMetadataRequest,
    LoadMetadataSuccess,
    LoadMetadataError,
    RemoveMetadataRequest,
    RemoveMetadataSuccess,
    RemoveMetadataFail,
    UpdateMetadataRequest,
    UpdateMetadataSuccess,
    UpdateMetadataFail,
    UpdateMetadataConflict
} from '../action/metadata-collection.action';
import { ResolverService } from '../../metadata/domain/service/resolver.service';
import { removeNulls } from '../../shared/util';
import { AddNotification } from '../../notification/action/notification.action';
import { Notification, NotificationType } from '../../notification/model/notification';
import { I18nService } from '../../i18n/service/i18n.service';
import * as fromRoot from '../../app.reducer';
import * as fromI18n from '../../i18n/reducer';


/* istanbul ignore next */
@Injectable()
export class MetadataCollectionEffects {

    @Effect()
    loadMetadatas$ = this.actions$.pipe(
        ofType<LoadMetadataRequest>(MetadataCollectionActionTypes.LOAD_METADATA_REQUEST),
        switchMap(() =>
            this.descriptorService
                .queryForAdmin()
                .pipe(
                    map(descriptors => new LoadMetadataSuccess(descriptors)),
                    catchError(error => of(new LoadMetadataError(error)))
                )
        )
    );

    @Effect()
    updateMetadata$ = this.actions$.pipe(
        ofType<UpdateMetadataRequest>(MetadataCollectionActionTypes.UPDATE_METADATA_REQUEST),
        map(action => action.payload),
        switchMap(provider => {
            return this.descriptorService
                .update(removeNulls(provider))
                .pipe(
                    map(p => new UpdateMetadataSuccess({
                        id: p.id,
                        changes: p
                    })),
                    catchError(err => {
                        if (err.status === 409) {
                            return of(new UpdateMetadataConflict(provider));
                        }
                        return of(new UpdateMetadataFail({
                            errorCode: err.status,
                            errorMessage: `${err.statusText} - ${err.message}`
                        }));
                    })
                );
        })
    );

    @Effect()
    removeMetadataSuccessReload$ = this.actions$.pipe(
        ofType<RemoveMetadataSuccess>(MetadataCollectionActionTypes.REMOVE_METADATA_SUCCESS),
        map(action => action.payload),
        map(provider => new LoadMetadataRequest())
    );

    @Effect()
    updateMetadataSuccessNotification$ = this.actions$.pipe(
        ofType<UpdateMetadataSuccess>(MetadataCollectionActionTypes.UPDATE_METADATA_SUCCESS),
        map(action => action.payload),
        withLatestFrom(this.store.select(fromI18n.getMessages)),
        map(([error, messages]) => new AddNotification(
            new Notification(
                NotificationType.Success,
                `Metadata Source has been enabled`,
                8000
            )
        ))
    );

    @Effect()
    updateMetadataFailNotification$ = this.actions$.pipe(
        ofType<UpdateMetadataFail>(MetadataCollectionActionTypes.UPDATE_METADATA_FAIL),
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
    removeMetadata$ = this.actions$.pipe(
        ofType<RemoveMetadataRequest>(MetadataCollectionActionTypes.REMOVE_METADATA),
        map(action => action.payload),
        switchMap(entity =>
            this.descriptorService
                .remove(entity)
                .pipe(
                    map(p => new RemoveMetadataSuccess(entity)),
                    catchError(err => of(new RemoveMetadataFail(err)))
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
