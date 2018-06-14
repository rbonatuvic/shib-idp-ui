import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';

import { of } from 'rxjs';
import { switchMap, map, catchError, tap } from 'rxjs/operators';

import * as actions from '../action/collection.action';
import { FilterCollectionActionTypes } from '../action/collection.action';
import * as fromFilter from '../reducer';

import { MetadataResolverService } from '../../domain/service/metadata-resolver.service';
import { MetadataFilter } from '../../domain/model';
import { removeNulls } from '../../../shared/util';
import { EntityAttributesFilter } from '../../domain/entity/filter/entity-attributes-filter';

/* istanbul ignore next */
@Injectable()
export class FilterCollectionEffects {

    @Effect()
    loadFilters$ = this.actions$.pipe(
        ofType<actions.LoadFilterRequest>(FilterCollectionActionTypes.LOAD_FILTER_REQUEST),
        switchMap(() =>
            this.resolverService
                .query()
                .pipe(
                    map(filters => new actions.LoadFilterSuccess(filters)),
                    catchError(error => of(new actions.LoadFilterError(error)))
                )
        )
    );
    @Effect()
    selectFilterRequest$ = this.actions$.pipe(
        ofType<actions.SelectFilter>(FilterCollectionActionTypes.SELECT_FILTER),
        map(action => action.payload),
        switchMap(id => {
            return this.resolverService
                .find(id)
                .pipe(
                    map(p => new actions.SelectFilterSuccess(p)),
                    catchError(error => of(new actions.SelectFilterFail(error)))
                );
            }
        )
    );

    @Effect()
    addFilter$ = this.actions$.pipe(
        ofType<actions.AddFilterRequest>(FilterCollectionActionTypes.ADD_FILTER),
        map(action => action.payload),
        map(filter => {
            return {
                ...filter,
                relyingPartyOverrides: removeNulls(new EntityAttributesFilter(filter).relyingPartyOverrides)
            };
        }),
        switchMap(unsaved =>
            this.resolverService
                .save(unsaved as MetadataFilter)
                .pipe(
                    map(saved => new actions.AddFilterSuccess(saved)),
                    catchError(error => of(new actions.AddFilterFail(error)))
                )
        )
    );
    @Effect({ dispatch: false })
    addFilterSuccessRedirect$ = this.actions$.pipe(
        ofType<actions.AddFilterSuccess>(FilterCollectionActionTypes.ADD_FILTER_SUCCESS),
        map(action => action.payload),
        tap(filter => this.router.navigate(['/dashboard']))
    );

    @Effect()
    addFilterSuccessReload$ = this.actions$.pipe(
        ofType<actions.AddFilterSuccess>(FilterCollectionActionTypes.ADD_FILTER_SUCCESS),
        map(action => action.payload),
        map(filter => new actions.LoadFilterRequest())
    );

    @Effect()
    updateFilter$ = this.actions$.pipe(
        ofType<actions.UpdateFilterRequest>(FilterCollectionActionTypes.UPDATE_FILTER_REQUEST),
        map(action => action.payload),
        switchMap(filter => {
            delete filter.modifiedDate;
            delete filter.createdDate;
            return this.resolverService
                .update(filter)
                .pipe(
                    map(p => new actions.UpdateFilterSuccess({
                        id: p.id,
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
        tap(filter => this.router.navigate(['/dashboard']))
    );
    @Effect()
    updateFilterSuccessReload$ = this.actions$.pipe(
        ofType<actions.UpdateFilterSuccess>(FilterCollectionActionTypes.UPDATE_FILTER_SUCCESS),
        map(action => action.payload),
        map(filter => new actions.LoadFilterRequest())
    );

    constructor(
        private actions$: Actions,
        private router: Router,
        private resolverService: MetadataResolverService,
        private store: Store<fromFilter.State>
    ) { }
}
