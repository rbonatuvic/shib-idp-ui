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

import * as filter from '../action/filter.action';
import * as fromFilter from '../reducer';

import { SearchDialogComponent } from '../component/search-dialog.component';
import { EntityIdService } from '../../metadata-provider/service/entity-id.service';
import { MetadataFilterService } from '../service/filter.service';
import { MetadataProvider } from '../../metadata-provider/model/metadata-provider';

@Injectable()
export class FilterEffects {

    private dbounce = 500;

    @Effect()
    loadEntityIds$ = this.actions$
        .ofType<filter.QueryEntityIds>(filter.QUERY_ENTITY_IDS)
        .map(action => action.payload)
        .debounceTime(this.dbounce)
        .switchMap(query =>
            this.idService
                .query(query)
                .map(ids => new filter.LoadEntityIdsSuccess(ids))
                .catch(error => Observable.of(new filter.LoadEntityIdsError(error)))
        );

    @Effect({ dispatch: false })
    cancelChanges$ = this.actions$
        .ofType<filter.CancelCreateFilter>(filter.CANCEL_CREATE_FILTER)
        .switchMap(() => this.router.navigate(['/dashboard']));

    @Effect()
    viewMore$ = this.actions$
        .ofType<filter.ViewMoreIds>(filter.VIEW_MORE_IDS)
        .map(action => action.payload)
        .switchMap(q => {
            const modal = this.modalService.open(SearchDialogComponent) as NgbModalRef;
            const res = modal.result;
            modal.componentInstance.term = q;
            return Observable
                .fromPromise(res)
                .map(id => new filter.SelectId(id))
                .catch(() => Observable.of(new filter.CancelViewMore()));
        });

    @Effect()
    saveFilter$ = this.actions$
        .ofType<filter.SaveFilter>(filter.SAVE_FILTER)
        .map(action => action.payload)
        .switchMap(unsaved =>
            this.filterService
                .save(unsaved as MetadataProvider)
                .map(saved => new filter.SaveFilterSuccess(saved))
                .catch(error => Observable.of(new filter.SaveFilterError(error)))
        );

    @Effect({ dispatch: false })
    saveFilterSuccess$ = this.actions$
        .ofType<filter.SaveFilterSuccess>(filter.SAVE_FILTER_SUCCESS)
        .switchMap(() => this.router.navigate(['/dashboard']));

    constructor(
        private actions$: Actions,
        private router: Router,
        private modalService: NgbModal,
        private idService: EntityIdService,
        private filterService: MetadataFilterService,
        private store: Store<fromFilter.State>
    ) { }
}
