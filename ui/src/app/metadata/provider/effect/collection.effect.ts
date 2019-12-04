import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';

import { of } from 'rxjs';
import { map, catchError, switchMap, tap, withLatestFrom, debounceTime } from 'rxjs/operators';
import {
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
    UpdateProviderFail,
    UpdateProviderConflict,
    GetOrderProviderRequest,
    GetOrderProviderSuccess,
    GetOrderProviderFail,
    SetOrderProviderRequest,
    SetOrderProviderSuccess,
    SetOrderProviderFail,
    ChangeProviderOrderUp,
    ChangeProviderOrderDown
} from '../action/collection.action';
import { MetadataProviderService } from '../../domain/service/provider.service';
import * as fromProvider from '../reducer';
import * as fromRoot from '../../../app.reducer';
import { array_move } from '../../../shared/util';
import { ClearProvider, ResetChanges } from '../action/entity.action';
import { ShowContentionAction } from '../../../contention/action/contention.action';
import { ContentionService } from '../../../contention/service/contention.service';
import { MetadataProvider } from '../../domain/model';
import { AddNotification } from '../../../notification/action/notification.action';
import { Notification, NotificationType } from '../../../notification/model/notification';
import { WizardActionTypes, SetDisabled } from '../../../wizard/action/wizard.action';
import { I18nService } from '../../../i18n/service/i18n.service';
import * as fromI18n from '../../../i18n/reducer';
import { ClearEditor } from '../action/editor.action';


/* istanbul ignore next */
@Injectable()
export class CollectionEffects {

    @Effect()
    openContention$ = this.actions$.pipe(
        ofType<UpdateProviderConflict>(ProviderCollectionActionTypes.UPDATE_PROVIDER_CONFLICT),
        map(action => action.payload),
        withLatestFrom(this.store.select(fromProvider.getSelectedProvider)),
        switchMap(([changes, current]) =>
            this.providerService.find(current.resourceId).pipe(
                map(data => new ShowContentionAction(this.contentionService.getContention(current, changes, data, {
                    resolve: (obj) => this.store.dispatch(new UpdateProviderRequest(<MetadataProvider>{ ...obj })),
                    reject: (obj) => this.gotoConfiguration(current)
                })))
            )
        )
    );


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
        debounceTime(500),
        switchMap(id => {
            return this.providerService
                .find(id)
                .pipe(
                    map(provider => new SelectProviderSuccess(provider)),
                    catchError(error => of(new SelectProviderError(error)))
                );
        })
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
                    catchError((e) => {
                        return of(new AddProviderFail(e.error));
                    })
                )
        )
    );

    @Effect()
    createProviderFailDispatchNotification$ = this.actions$.pipe(
        ofType<AddProviderFail>(ProviderCollectionActionTypes.ADD_PROVIDER_FAIL),
        map(action => action.payload),
        withLatestFrom(this.store.select(fromI18n.getMessages)),
        map(([error, messages]) => {
            console.log(error);
            let message = `${error.errorCode}: ${this.i18nService.translate(error.errorMessage, null, messages)}`;
            message = error.cause ? `${message} - ${error.cause}` : message;
            return new AddNotification(
                new Notification(
                    NotificationType.Danger,
                    message,
                    8000
                )
            );
        })
    );
    @Effect()
    createProviderFailEnableForm$ = this.actions$.pipe(
        ofType<AddProviderFail>(ProviderCollectionActionTypes.ADD_PROVIDER_FAIL),
        map(action => action.payload),
        map(error => new SetDisabled(false))
    );

    @Effect({ dispatch: false })
    createProviderSuccessRedirect$ = this.actions$.pipe(
        ofType<AddProviderSuccess>(ProviderCollectionActionTypes.ADD_PROVIDER_SUCCESS),
        map(action => action.payload),
        tap(provider => this.navigateToProvider(provider.resourceId))
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
                    map(p => new UpdateProviderSuccess({id: p.resourceId, changes: p})),
                    catchError((e) => e.status === 409 ? of(new UpdateProviderConflict(provider)) : of(new UpdateProviderFail(e.error)))
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
        tap(provider => {
            this.store.dispatch(new ClearProvider());
            this.navigateToProvider(provider.id);
        })
    );

    @Effect()
    updateProviderFailDispatchNotification$ = this.actions$.pipe(
        ofType<UpdateProviderFail>(ProviderCollectionActionTypes.UPDATE_PROVIDER_FAIL),
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
    addProviderSuccessReload$ = this.actions$.pipe(
        ofType<AddProviderSuccess>(ProviderCollectionActionTypes.ADD_PROVIDER_SUCCESS),
        map(action => action.payload),
        map(provider => new LoadProviderRequest())
    );

    @Effect()
    getOrderWithLoad$ = this.actions$.pipe(
        ofType<LoadProviderSuccess>(ProviderCollectionActionTypes.LOAD_PROVIDER_SUCCESS),
        map(() => new GetOrderProviderRequest())
    );

    @Effect()
    getProviderOrder$ = this.actions$.pipe(
        ofType<GetOrderProviderRequest>(ProviderCollectionActionTypes.GET_ORDER_PROVIDER_REQUEST),
        switchMap(() =>
            this.providerService.getOrder().pipe(
                map(order => new GetOrderProviderSuccess(order)),
                catchError(err => of(new GetOrderProviderFail(err)))
            )
        )
    );

    @Effect()
    reloadProviderOrderAfterChange$ = this.actions$.pipe(
        ofType<SetOrderProviderSuccess>(ProviderCollectionActionTypes.SET_ORDER_PROVIDER_SUCCESS),
        map(() => new GetOrderProviderRequest())
    );

    @Effect()
    setProviderOrder$ = this.actions$.pipe(
        ofType<SetOrderProviderRequest>(ProviderCollectionActionTypes.SET_ORDER_PROVIDER_REQUEST),
        map(action => action.payload),
        switchMap(order =>
            this.providerService.setOrder(order).pipe(
                map(() => new SetOrderProviderSuccess()),
                catchError(err => of(new SetOrderProviderFail(err)))
            )
        )
    );

    @Effect()
    changeOrderUp$ = this.actions$.pipe(
        ofType<ChangeProviderOrderUp>(ProviderCollectionActionTypes.CHANGE_PROVIDER_ORDER_UP),
        map(action => action.payload),
        withLatestFrom(this.store.select(fromProvider.getProviderOrder)),
        map(([id, order]) => {
            const index = order.indexOf(id);
            if (index > 0) {
                const newOrder = array_move(order, index, index - 1);
                return new SetOrderProviderRequest(newOrder);
            } else {
                return new SetOrderProviderFail(new Error(`could not change order: ${ id }`));
            }
        })
    );

    @Effect()
    changeOrderDown$ = this.actions$.pipe(
        ofType<ChangeProviderOrderDown>(ProviderCollectionActionTypes.CHANGE_PROVIDER_ORDER_DOWN),
        map(action => action.payload),
        withLatestFrom(this.store.select(fromProvider.getProviderOrder)),
        map(([id, order]) => {
            const index = order.indexOf(id);
            if (index < order.length - 1) {
                const newOrder = array_move(order, index, index + 1);
                return new SetOrderProviderRequest(newOrder);
            } else {
                return new SetOrderProviderFail(new Error(`could not change order: ${id}`));
            }
        })
    );

    constructor(
        private actions$: Actions,
        private router: Router,
        private store: Store<fromRoot.State>,
        private providerService: MetadataProviderService,
        private contentionService: ContentionService,
        private i18nService: I18nService
    ) { }

    navigateToProvider(id) {
        this.router.navigate(['/', 'metadata', 'provider', id, 'configuration', 'options']);
    }

    gotoConfiguration(provider) {
        this.store.dispatch(new ClearProvider());
        this.store.dispatch(new ClearEditor());
        this.navigateToProvider(provider.resourceId);
    }
}
