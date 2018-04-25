import { Injectable } from '@angular/core';
import { Effect, Actions } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/withLatestFrom';

import * as actions from '../action/filter-collection.action';
import { FilterCollectionActionTypes, FilterCollectionActionsUnion } from '../action/filter-collection.action';
import * as fromFilter from '../reducer';

import { EntityIdService } from '../../domain/service/entity-id.service';
import { MetadataResolverService } from '../service/metadata-resolver.service';
import { MetadataFilter } from '../../domain/model/metadata-filter';
import { removeNulls } from '../../shared/util';

@Injectable()
export class FilterCollectionEffects {

    @Effect()
    loadFilters$ = this.actions$
        .ofType<actions.LoadFilterRequest>(FilterCollectionActionTypes.LOAD_FILTER_REQUEST)
        .switchMap(() =>
            this.resolverService
                .query()
                .map(filters => new actions.LoadFilterSuccess(filters))
                .catch(error => Observable.of(new actions.LoadFilterError(error)))
        );
    @Effect()
    selectFilterRequest$ = this.actions$
        .ofType<actions.SelectFilter>(FilterCollectionActionTypes.SELECT)
        .map(action => action.payload)
        .switchMap(id =>
            this.resolverService
                .find(id)
                .map(p => new actions.SelectFilterSuccess(p))
                .catch(error => Observable.of(new actions.SelectFilterFail(error)))
        );

    @Effect()
    addFilter$ = this.actions$
        .ofType<actions.AddFilterRequest>(FilterCollectionActionTypes.ADD_FILTER)
        .map(action => action.payload)
        .map(filter => {
            return {
                ...filter,
                relyingPartyOverrides: removeNulls(filter.relyingPartyOverrides)
            };
        })
        .switchMap(unsaved =>
            this.resolverService
                .save(unsaved as MetadataFilter)
                .map(saved => new actions.AddFilterSuccess(saved))
                .catch(error => Observable.of(new actions.AddFilterFail(error)))
        );
    @Effect({ dispatch: false })
    addFilterSuccessRedirect$ = this.actions$
        .ofType<actions.AddFilterSuccess>(FilterCollectionActionTypes.ADD_FILTER_SUCCESS)
        .map(action => action.payload)
        .do(filter => {
            this.router.navigate(['/dashboard']);
        });

    @Effect()
    addFilterSuccessReload$ = this.actions$
        .ofType<actions.AddFilterSuccess>(FilterCollectionActionTypes.ADD_FILTER_SUCCESS)
        .map(action => action.payload)
        .map(filter => new actions.LoadFilterRequest());

    @Effect()
    updateFilter$ = this.actions$
        .ofType<actions.UpdateFilterRequest>(FilterCollectionActionTypes.UPDATE_FILTER_REQUEST)
        .map(action => action.payload)
        .switchMap(filter => {
            delete filter.modifiedDate;
            delete filter.createdDate;
            return this.resolverService
                .update(filter)
                .map(p => new actions.UpdateFilterSuccess({
                    id: p.id,
                    changes: p
                }))
                .catch(err => Observable.of(new actions.UpdateFilterFail(err)));
        });
    @Effect({ dispatch: false })
    updateFilterSuccessRedirect$ = this.actions$
        .ofType<actions.UpdateFilterSuccess>(FilterCollectionActionTypes.UPDATE_FILTER_SUCCESS)
        .map(action => action.payload)
        .do(filter => {
            this.router.navigate(['/dashboard']);
        });
    @Effect()
    updateFilterSuccessReload$ = this.actions$
        .ofType<actions.UpdateFilterSuccess>(FilterCollectionActionTypes.UPDATE_FILTER_SUCCESS)
        .map(action => action.payload)
        .map(filter => new actions.LoadFilterRequest());

    constructor(
        private actions$: Actions,
        private router: Router,
        private modalService: NgbModal,
        private idService: EntityIdService,
        private resolverService: MetadataResolverService,
        private store: Store<fromFilter.State>
    ) { }
}
