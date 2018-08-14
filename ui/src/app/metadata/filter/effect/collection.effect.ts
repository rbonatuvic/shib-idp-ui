import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';

import { of } from 'rxjs';
import { switchMap, map, catchError, tap, combineLatest, skipWhile, debounceTime, withLatestFrom } from 'rxjs/operators';

import * as actions from '../action/collection.action';
import { FilterCollectionActionTypes } from '../action/collection.action';
import * as fromFilter from '../reducer';
import * as fromProvider from '../../provider/reducer';
import { MetadataFilter } from '../../domain/model';
import { removeNulls } from '../../../shared/util';
import { EntityAttributesFilterEntity } from '../../domain/entity/filter/entity-attributes-filter';
import { MetadataFilterService } from '../../domain/service/filter.service';

/* istanbul ignore next */
@Injectable()
export class FilterCollectionEffects {

    @Effect()
    loadFilters$ = this.actions$.pipe(
        ofType<actions.LoadFilterRequest>(FilterCollectionActionTypes.LOAD_FILTER_REQUEST),
        map(action => action.payload),
        skipWhile(providerId => !providerId),
        switchMap(providerId =>
            this.filterService
                .query(providerId)
                .pipe(
                    map(filters => new actions.LoadFilterSuccess(filters)),
                    catchError(error => of(new actions.LoadFilterError(error)))
                )
        )
    );
    @Effect()
    selectFilterRequest$ = this.actions$.pipe(
        ofType<actions.SelectFilter>(FilterCollectionActionTypes.SELECT_FILTER_REQUEST),
        map(action => action.payload),
        withLatestFrom(this.store.select(fromProvider.getSelectedProviderId).pipe(skipWhile(id => !id))),
        switchMap(([filterId, providerId]) => {
            return this.filterService
                .find(providerId, filterId)
                .pipe(
                    map(p => new actions.SelectFilterSuccess(p)),
                    catchError(error => of(new actions.SelectFilterFail(error)))
                );
            }
        )
    );

    @Effect()
    addFilter$ = this.actions$.pipe(
        ofType<actions.AddFilterRequest>(FilterCollectionActionTypes.ADD_FILTER_REQUEST),
        map(action => action.payload),
        map(filter => {
            return {
                ...filter,
                relyingPartyOverrides: removeNulls(new EntityAttributesFilterEntity(filter).relyingPartyOverrides)
            };
        }),
        withLatestFrom(this.store.select(fromProvider.getSelectedProviderId).pipe(skipWhile(id => !id))),
        switchMap(([unsaved, providerId]) => {
            return this.filterService
                .save(providerId, unsaved as MetadataFilter)
                .pipe(
                    map(saved => new actions.AddFilterSuccess(saved)),
                    catchError(error => of(new actions.AddFilterFail(error)))
                );
        })
    );
    @Effect({ dispatch: false })
    addFilterSuccessRedirect$ = this.actions$.pipe(
        ofType<actions.AddFilterSuccess>(FilterCollectionActionTypes.ADD_FILTER_SUCCESS),
        map(action => action.payload),
        withLatestFrom(this.store.select(fromProvider.getSelectedProviderId).pipe(skipWhile(id => !id))),
        tap(([filter, provider]) => this.router.navigate(['/', 'metadata', 'provider', provider, 'filters']))
    );

    @Effect()
    updateFilter$ = this.actions$.pipe(
        ofType<actions.UpdateFilterRequest>(FilterCollectionActionTypes.UPDATE_FILTER_REQUEST),
        map(action => action.payload),
        withLatestFrom(this.store.select(fromProvider.getSelectedProviderId).pipe(skipWhile(id => !id))),
        switchMap(([filter, providerId]) => {
            delete filter.modifiedDate;
            delete filter.createdDate;
            return this.filterService
                .update(providerId, filter)
                .pipe(
                    map(p => new actions.UpdateFilterSuccess({
                        id: p.resourceId,
                        changes: p
                    })),
                    catchError(err => of(new actions.UpdateFilterFail(filter)))
                );
        })
    );
    @Effect({ dispatch: false })
    updateFilterSuccessRedirect$ = this.actions$.pipe(
        ofType<actions.UpdateFilterSuccess>(FilterCollectionActionTypes.UPDATE_FILTER_SUCCESS),
        map(action => action.payload),
        withLatestFrom(this.store.select(fromProvider.getSelectedProviderId).pipe(skipWhile(id => !id))),
        tap(([filter, provider]) => this.router.navigate(['/', 'metadata', 'provider', provider, 'filters']))
    );

    constructor(
        private actions$: Actions,
        private router: Router,
        private filterService: MetadataFilterService,
        private store: Store<fromFilter.State>
    ) { }
}
