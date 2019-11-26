import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';

import { of } from 'rxjs';
import { switchMap, map, catchError, tap, combineLatest, skipWhile, debounceTime, withLatestFrom } from 'rxjs/operators';

import {
    LoadFilterRequest,
    LoadFilterSuccess,
    LoadFilterError,
    UpdateFilterRequest,
    UpdateFilterSuccess,
    UpdateFilterFail,
    SelectFilter,
    SelectFilterSuccess,
    SelectFilterFail,
    AddFilterRequest,
    AddFilterSuccess,
    AddFilterFail,
    GetOrderFilterRequest,
    GetOrderFilterSuccess,
    GetOrderFilterFail,
    SetOrderFilterRequest,
    SetOrderFilterSuccess,
    SetOrderFilterFail,
    ChangeFilterOrderUp,
    ChangeFilterOrderDown,
    RemoveFilterRequest,
    RemoveFilterSuccess,
    RemoveFilterFail
} from '../action/collection.action';
import { FilterCollectionActionTypes } from '../action/collection.action';
import * as fromFilter from '../reducer';
import * as fromProvider from '../../provider/reducer';
import { MetadataFilter } from '../../domain/model';
import { array_move } from '../../../shared/util';
import { MetadataFilterService } from '../../domain/service/filter.service';
import { SelectProviderRequest } from '../../provider/action/collection.action';
import { UpdateFilterChanges, ClearFilter } from '../action/filter.action';
import { AddNotification } from '../../../notification/action/notification.action';
import { NotificationType, Notification } from '../../../notification/model/notification';
import { I18nService } from '../../../i18n/service/i18n.service';
import * as fromI18n from '../../../i18n/reducer';

/* istanbul ignore next */
@Injectable()
export class FilterCollectionEffects {

    @Effect()
    loadFilters$ = this.actions$.pipe(
        ofType<LoadFilterRequest>(FilterCollectionActionTypes.LOAD_FILTER_REQUEST),
        map(action => action.payload),
        skipWhile(providerId => !providerId),
        switchMap(providerId =>
            this.filterService
                .query(providerId)
                .pipe(
                    map(filters => new LoadFilterSuccess(filters)),
                    catchError(error => of(new LoadFilterError(error)))
                )
        )
    );
    @Effect()
    selectFilterRequest$ = this.actions$.pipe(
        ofType<SelectFilter>(FilterCollectionActionTypes.SELECT_FILTER_REQUEST),
        map(action => action.payload),
        withLatestFrom(this.store.select(fromProvider.getSelectedProviderId).pipe(skipWhile(id => !id))),
        switchMap(([filterId, providerId]) => {
            return this.filterService
                .find(providerId, filterId)
                .pipe(
                    map(p => new SelectFilterSuccess(p)),
                    catchError(error => of(new SelectFilterFail(error)))
                );
            }
        )
    );

    @Effect()
    selectFilterRequestSetChanges$ = this.actions$.pipe(
        ofType<SelectFilterSuccess>(FilterCollectionActionTypes.SELECT_FILTER_SUCCESS),
        map(action => action.payload),
            map(filter => new UpdateFilterChanges({...filter, type: filter['@type']}))
    );

    @Effect()
    addFilter$ = this.actions$.pipe(
        ofType<AddFilterRequest>(FilterCollectionActionTypes.ADD_FILTER_REQUEST),
        map(action => action.payload),
        withLatestFrom(this.store.select(fromProvider.getSelectedProviderId).pipe(skipWhile(id => !id))),
        switchMap(([unsaved, providerId]) => {
            return this.filterService
                .save(providerId, unsaved as MetadataFilter)
                .pipe(
                    map(saved => new AddFilterSuccess(saved)),
                    catchError(error => of(new AddFilterFail(error)))
                );
        })
    );
    @Effect({ dispatch: false })
    addFilterSuccessRedirect$ = this.actions$.pipe(
        ofType<AddFilterSuccess>(FilterCollectionActionTypes.ADD_FILTER_SUCCESS),
        map(action => action.payload),
        withLatestFrom(this.store.select(fromProvider.getSelectedProviderId).pipe(skipWhile(id => !id))),
        tap(([filter, provider]) => this.navigateToParent(provider))
    );

    @Effect()
    addFilterSuccessReloadParent$ = this.actions$.pipe(
        ofType<AddFilterSuccess>(FilterCollectionActionTypes.ADD_FILTER_SUCCESS),
        map(action => action.payload),
        withLatestFrom(this.store.select(fromProvider.getSelectedProviderId).pipe(skipWhile(id => !id))),
        map(([filter, provider]) => new SelectProviderRequest(provider))
    );

    @Effect()
    addFilterSuccessResetState$ = this.actions$.pipe(
        ofType<AddFilterSuccess>(FilterCollectionActionTypes.ADD_FILTER_SUCCESS),
        map(() => new ClearFilter())
    );

    @Effect()
    addFilterFailNotification$ = this.actions$.pipe(
        ofType<AddFilterFail>(FilterCollectionActionTypes.ADD_FILTER_FAIL),
        map(action => action.payload.error),
        withLatestFrom(this.store.select(fromI18n.getMessages)),
        map(([error, messages]) => {
            const message = error.errorMessage || error.cause || 'message.filter-fail';
            const translated = this.i18nService.translate(message, null, messages);
            return new AddNotification(
                new Notification(
                    NotificationType.Danger,
                    `${error.errorCode}: ${translated}`,
                    8000
                )
            );
        })
    );

    @Effect()
    updateFilter$ = this.actions$.pipe(
        ofType<UpdateFilterRequest>(FilterCollectionActionTypes.UPDATE_FILTER_REQUEST),
        map(action => action.payload),
        withLatestFrom(this.store.select(fromProvider.getSelectedProviderId).pipe(skipWhile(id => !id))),
        switchMap(([filter, providerId]) => {
            delete filter.modifiedDate;
            delete filter.createdDate;
            return this.filterService
                .update(providerId, filter)
                .pipe(
                    map(p => new UpdateFilterSuccess({
                        id: p.resourceId,
                        changes: p
                    })),
                    catchError(err => of(new UpdateFilterFail(filter)))
                );
        })
    );
    @Effect()
    updateFilterSuccessReloadProvider$ = this.actions$.pipe(
        ofType(
            FilterCollectionActionTypes.UPDATE_FILTER_SUCCESS,
            FilterCollectionActionTypes.SET_ORDER_FILTER_SUCCESS,
            FilterCollectionActionTypes.REMOVE_FILTER_SUCCESS
        ),
        withLatestFrom(this.store.select(fromProvider.getSelectedProviderId).pipe(skipWhile(id => !id))),
        map(([action, providerId]) => new SelectProviderRequest(providerId))
    );

    @Effect({ dispatch: false })
    updateFilterSuccessRedirect$ = this.actions$.pipe(
        ofType<UpdateFilterSuccess>(FilterCollectionActionTypes.UPDATE_FILTER_SUCCESS),
        map(action => action.payload),
        withLatestFrom(this.store.select(fromProvider.getSelectedProviderId).pipe(skipWhile(id => !id))),
        tap(([filter, provider]) => this.navigateToParent(provider))
    );

    @Effect()
    updateFilterSuccessResetState$ = this.actions$.pipe(
        ofType<UpdateFilterSuccess>(FilterCollectionActionTypes.UPDATE_FILTER_SUCCESS),
        map(() => new ClearFilter())
    );

    @Effect()
    getOrderWithLoad$ = this.actions$.pipe(
        ofType<LoadFilterSuccess>(FilterCollectionActionTypes.LOAD_FILTER_SUCCESS),
        map(() => new GetOrderFilterRequest())
    );

    @Effect()
    getOrder$ = this.actions$.pipe(
        ofType<GetOrderFilterRequest>(FilterCollectionActionTypes.GET_ORDER_FILTER_REQUEST),
        withLatestFrom(this.store.select(fromProvider.getSelectedProviderId).pipe(skipWhile(id => !id))),
        switchMap(([action, providerId]) =>
            this.filterService.getOrder(providerId).pipe(
                map(order => new GetOrderFilterSuccess(order)),
                catchError(err => of(new GetOrderFilterFail(err)))
            )
        )
    );

    @Effect()
    setOrder$ = this.actions$.pipe(
        ofType<SetOrderFilterRequest>(FilterCollectionActionTypes.SET_ORDER_FILTER_REQUEST),
        map(action => action.payload),
        withLatestFrom(
            this.store.select(fromProvider.getSelectedProviderId),
            this.store.select(fromFilter.getPluginFilterOrder)
        ),
        switchMap(([order, providerId, pluginOrder]) =>
            this.filterService.setOrder(providerId, [...pluginOrder, ...order]).pipe(
                map(() => new SetOrderFilterSuccess()),
                catchError(err => of(new SetOrderFilterFail(err)))
            )
        )
    );

    @Effect()
    getOrderOnUpdate$ = this.actions$.pipe(
        ofType<SetOrderFilterSuccess>(FilterCollectionActionTypes.SET_ORDER_FILTER_SUCCESS),
        map(() => new GetOrderFilterRequest())
    );

    @Effect()
    changeOrderUp$ = this.actions$.pipe(
        ofType<ChangeFilterOrderUp>(FilterCollectionActionTypes.CHANGE_FILTER_ORDER_UP),
        map(action => action.payload),
        withLatestFrom(this.store.select(fromFilter.getAdditionalFilterOrder)),
        map(([id, order]) => {
            const index = order.indexOf(id);
            if (index > 0) {
                const newOrder = array_move(order, index, index - 1);
                return new SetOrderFilterRequest(newOrder);
            } else {
                return new SetOrderFilterFail(new Error(`could not change order: ${id}`));
            }
        })
    );

    @Effect()
    changeOrderDown$ = this.actions$.pipe(
        ofType<ChangeFilterOrderDown>(FilterCollectionActionTypes.CHANGE_FILTER_ORDER_DOWN),
        map(action => action.payload),
        withLatestFrom(this.store.select(fromFilter.getAdditionalFilterOrder)),
        map(([id, order]) => {
            const index = order.indexOf(id);
            if (index < order.length - 1) {
                const newOrder = array_move(order, index, index + 1);
                return new SetOrderFilterRequest(newOrder);
            } else {
                return new SetOrderFilterFail(new Error(`could not change order: ${id}`));
            }
        })
    );

    @Effect()
    removeFilterRequest$ = this.actions$.pipe(
        ofType<RemoveFilterRequest>(FilterCollectionActionTypes.REMOVE_FILTER_REQUEST),
        map(action => action.payload),
        withLatestFrom(this.store.select(fromProvider.getSelectedProviderId).pipe(skipWhile(id => !id))),
        switchMap(([filterId, providerId]) =>
            this.filterService.remove(providerId, filterId).pipe(
                map(removed => new RemoveFilterSuccess(removed)),
                catchError(err => of(new RemoveFilterFail(err)))
            )
        )
    );

    @Effect()
    removeFilterSuccess$ = this.actions$.pipe(
        ofType<RemoveFilterSuccess>(FilterCollectionActionTypes.REMOVE_FILTER_SUCCESS),
        map(action => action.payload),
        withLatestFrom(this.store.select(fromProvider.getSelectedProviderId).pipe(skipWhile(id => !id))),
        map(([filter, providerId]) => new LoadFilterRequest(providerId))
    );

    constructor(
        private actions$: Actions,
        private router: Router,
        private filterService: MetadataFilterService,
        private store: Store<fromFilter.State>,
        private i18nService: I18nService
    ) { }

    navigateToParent(id) {
        this.router.navigate(
            [
                '/',
                'metadata',
                'provider',
                id,
                'configuration',
                'options'
            ],
            {
                fragment: 'filters'
            }
        );
    }
}
