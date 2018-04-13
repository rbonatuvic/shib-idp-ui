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

import * as search from '../action/search.action';
import * as filter from '../action/filter.action';
import * as fromFilter from '../reducer';
import * as collection from '../../domain/action/filter-collection.action';

import { SearchDialogComponent } from '../component/search-dialog.component';
import { EntityIdService } from '../../domain/service/entity-id.service';
import { MetadataProvider } from '../../domain/model/metadata-provider';
import { MetadataResolverService } from '../../domain/service/metadata-resolver.service';

@Injectable()
export class SearchIdEffects {

    private dbounce = 500;
    @Effect()
    loadEntityIds$ = this.actions$
        .ofType<search.QueryEntityIds>(search.QUERY_ENTITY_IDS)
        .map(action => action.payload)
        .debounceTime(this.dbounce)
        .switchMap(query =>
            this.idService
                .query(query)
                .map(ids => new search.LoadEntityIdsSuccess(ids))
                .catch(error => Observable.of(new search.LoadEntityIdsError(error)))
        );

    @Effect()
    viewMore$ = this.actions$
        .ofType<search.ViewMoreIds>(search.VIEW_MORE_IDS)
        .map(action => action.payload)
        .switchMap(q => {
            const modal = this.modalService.open(SearchDialogComponent) as NgbModalRef;
            const res = modal.result;
            modal.componentInstance.term = q;
            return Observable
                .fromPromise(res)
                .map(id => new filter.SelectId(id))
                .catch(() => Observable.of(new search.CancelViewMore()));
        });

    constructor(
        private actions$: Actions,
        private router: Router,
        private modalService: NgbModal,
        private idService: EntityIdService,
        private resolverService: MetadataResolverService,
        private store: Store<fromFilter.State>
    ) { }
}
