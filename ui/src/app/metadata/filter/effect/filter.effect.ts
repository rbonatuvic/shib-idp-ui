import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { map, switchMap, catchError, withLatestFrom, tap } from 'rxjs/operators';

import { Router } from '@angular/router';

import * as fromFilter from '../reducer';
import * as fromRoot from '../../../app.reducer';
import {
    FilterCollectionActionTypes,
    UpdateFilterFail,
    UpdateFilterRequest,
    AddFilterSuccess,
    LoadFilterRequest
} from '../action/collection.action';
import {
    SelectId,
    FilterActionTypes,
    LoadEntityPreviewSuccess,
    LoadEntityPreviewError,
    CancelCreateFilter
} from '../action/filter.action';
import { EntityIdService } from '../../domain/service/entity-id.service';
import { MetadataProviderService } from '../../domain/service/provider.service';
import { ShowContentionAction } from '../../../contention/action/contention.action';
import { MetadataFilter } from '../../domain/model';
import { ContentionService } from '../../../contention/service/contention.service';

@Injectable()
export class FilterEffects {

    @Effect()
    loadEntityMdui$ = this.actions$.pipe(
        ofType<SelectId>(FilterActionTypes.SELECT_ID),
        map(action => action.payload),
        switchMap(query =>
            this.idService.findEntityById(query).pipe(
                map(data => new LoadEntityPreviewSuccess(data)),
                catchError(error => of(new LoadEntityPreviewError(error)))
            )
        )
    );

    @Effect()
    openContention$ = this.actions$.pipe(
        ofType<UpdateFilterFail>(FilterCollectionActionTypes.UPDATE_FILTER_FAIL),
        map(action => action.payload),
        withLatestFrom(this.store.select(fromFilter.getSelectedFilter)),
        switchMap(([filter, current]) =>
            this.resolverService.find(filter.id).pipe(
                map(data => new ShowContentionAction(this.contentionService.getContention(current, filter, data, {
                    resolve: (obj) => this.store.dispatch(new UpdateFilterRequest(<MetadataFilter>{ ...obj })),
                    reject: (obj) => this.store.dispatch(new CancelCreateFilter())
                })))
            )
        )
    );

    @Effect({ dispatch: false })
    saveFilterSuccess$ = this.actions$.pipe(
        ofType<AddFilterSuccess>(FilterCollectionActionTypes.ADD_FILTER_SUCCESS),
        switchMap(() => this.router.navigate(['/dashboard']))
    );

    @Effect()
    cancelChanges$ = this.actions$.pipe(
        ofType<CancelCreateFilter>(FilterActionTypes.CANCEL_CREATE_FILTER),
        map(() => new LoadFilterRequest()),
        tap(() => this.router.navigate(['/dashboard']))
    );

    constructor(
        private store: Store<fromRoot.State>,
        private actions$: Actions,
        private router: Router,
        private idService: EntityIdService,
        private resolverService: MetadataProviderService,
        private contentionService: ContentionService
    ) { }
}
