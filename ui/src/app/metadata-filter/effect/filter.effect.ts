import { Injectable } from '@angular/core';
import { Effect, Actions } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';

import * as filter from '../action/filter.action';

import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SearchDialogComponent } from '../component/search-dialog.component';
import { EntityIdService } from '../../metadata-provider/service/entity-id.service';

@Injectable()
export class FilterEffects {

    private dbounce = 500;

    @Effect()
    loadEntityIds$ = this.actions$
        .ofType<filter.LoadEntityIds>(filter.LOAD_ENTITY_IDS)
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
        .switchMap(() =>
            Observable
                .fromPromise(this.modalService.open(SearchDialogComponent).result)
                .map(id => new filter.SelectId(id))
                .catch(() => Observable.of(new filter.CancelViewMore()))
        );

    constructor(
        private actions$: Actions,
        private router: Router,
        private modalService: NgbModal,
        private idService: EntityIdService
    ) { }
}
