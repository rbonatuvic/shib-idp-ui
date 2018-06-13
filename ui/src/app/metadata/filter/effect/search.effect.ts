import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { of } from 'rxjs';

import { catchError, map, debounceTime, switchMap } from 'rxjs/operators';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

import * as search from '../action/search.action';

import { SearchDialogComponent } from '../component/search-dialog.component';
import { EntityIdService } from '../../domain/service/entity-id.service';
import { MetadataProvider } from '../../domain/model/provider';
import { MetadataResolverService } from '../../domain/service/metadata-resolver.service';
import { fromPromise } from 'rxjs/internal-compatibility';
import { SelectId } from '../action/filter.action';


@Injectable()
export class SearchIdEffects {

    private dbounce = 500;
    @Effect()
    loadEntityIds$ = this.actions$.pipe(
        ofType<search.QueryEntityIds>(search.QUERY_ENTITY_IDS),
        map(action => action.payload),
        debounceTime(this.dbounce),
        switchMap(query =>
            this.idService.query(query).pipe(
                map(ids => new search.LoadEntityIdsSuccess(ids)),
                catchError(error => of(new search.LoadEntityIdsError(error)))
            )
        )
    );

    @Effect()
    viewMore$ = this.actions$.pipe(
        ofType<search.ViewMoreIds>(search.VIEW_MORE_IDS),
        map(action => action.payload),
        switchMap(q => {
            const modal = this.modalService.open(SearchDialogComponent) as NgbModalRef;
            const res = modal.result;
            modal.componentInstance.term = q;
            return fromPromise(res).pipe(
                map(id => new SelectId(id)),
                catchError(() => of(new search.CancelViewMore()))
            );
        })
    );

    constructor(
        private actions$: Actions,
        private modalService: NgbModal,
        private idService: EntityIdService
    ) { }
}
