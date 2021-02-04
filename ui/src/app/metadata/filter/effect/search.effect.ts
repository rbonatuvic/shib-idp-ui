import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';

import { catchError, map, debounceTime, switchMap, withLatestFrom } from 'rxjs/operators';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { State } from '../../../app.reducer';

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
import { from } from 'rxjs';
import { SelectId } from '../action/filter.action';
import * as fromProvider from '../../provider/reducer';


@Injectable()
export class SearchIdEffects {

    private dbounce = 500;
    @Effect()
    loadEntityIds$ = this.actions$.pipe(
        ofType<QueryEntityIds>(SearchActionTypes.QUERY_ENTITY_IDS),
        map(action => action.payload),
        debounceTime(this.dbounce),
        withLatestFrom(this.store.select(fromProvider.getSelectedProviderId)),
        map(([query, resourceId]) => ({ ...query, resourceId })),
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
            return from(res).pipe(
                map(id => new SelectId(id)),
                catchError(() => of(new CancelViewMore()))
            );
        })
    );

    constructor(
        private actions$: Actions,
        private modalService: NgbModal,
        private idService: EntityIdService,
        private store: Store<State>
    ) { }
}
