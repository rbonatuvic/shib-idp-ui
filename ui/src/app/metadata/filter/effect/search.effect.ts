import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { of } from 'rxjs';

import { catchError, map, debounceTime, switchMap } from 'rxjs/operators';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

import {
    SearchActionTypes,
    QueryEntityIds,
    LoadEntityIdsError,
    LoadEntityIdsSuccess,
    ViewMoreIds,
    CancelViewMore
} from '../action/search.action';

import { SearchDialogComponent } from '../component/search-dialog.component';
import { EntityIdService } from '../../domain/service/entity-id.service';
import { fromPromise } from 'rxjs/internal-compatibility';
import { SelectId } from '../action/filter.action';


@Injectable()
export class SearchIdEffects {

    private dbounce = 500;
    @Effect()
    loadEntityIds$ = this.actions$.pipe(
        ofType<QueryEntityIds>(SearchActionTypes.QUERY_ENTITY_IDS),
        map(action => action.payload),
        debounceTime(this.dbounce),
        switchMap(query =>
            this.idService.query(query).pipe(
                map(ids => new LoadEntityIdsSuccess(ids)),
                catchError(error => of(new LoadEntityIdsError(error)))
            )
        )
    );

    @Effect()
    viewMore$ = this.actions$.pipe(
        ofType<ViewMoreIds>(SearchActionTypes.VIEW_MORE_IDS),
        map(action => action.payload),
        switchMap(q => {
            const modal = this.modalService.open(SearchDialogComponent) as NgbModalRef;
            const res = modal.result;
            modal.componentInstance.term = q;
            return fromPromise(res).pipe(
                map(id => new SelectId(id)),
                catchError(() => of(new CancelViewMore()))
            );
        })
    );

    constructor(
        private actions$: Actions,
        private modalService: NgbModal,
        private idService: EntityIdService
    ) { }
}
