import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { map, switchMap, catchError, withLatestFrom, tap, combineLatest, skipWhile } from 'rxjs/operators';

import { Router } from '@angular/router';

import * as fromFilter from '../reducer';
import * as fromProvider from '../../provider/reducer';
import * as fromRoot from '../../../app.reducer';
import {
    FilterCollectionActionTypes,
    UpdateFilterConflict,
    UpdateFilterRequest
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
import { MetadataFilterService } from '../../domain/service/filter.service';

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
        ofType<UpdateFilterConflict>(FilterCollectionActionTypes.UPDATE_FILTER_CONFLICT),
        map(action => action.payload),
        withLatestFrom(
            this.store.select(fromFilter.getSelectedFilter),
            this.store.select(fromProvider.getSelectedProviderId)
        ),
        switchMap(([filter, current, providerId]) =>
            this.filterService.find(providerId, filter.resourceId).pipe(
                map(data => new ShowContentionAction(this.contentionService.getContention(current, filter, data, {
                    resolve: (obj) => this.store.dispatch(new UpdateFilterRequest(<MetadataFilter>{ ...obj })),
                    reject: (obj) => this.store.dispatch(new CancelCreateFilter())
                })))
            )
        )
    );

    @Effect({ dispatch: false })
    cancelChanges$ = this.actions$.pipe(
        ofType<CancelCreateFilter>(FilterActionTypes.CANCEL_CREATE_FILTER),
        withLatestFrom(this.store.select(fromProvider.getSelectedProviderId).pipe(skipWhile(id => !id))),
        tap(([filter, provider]) => {
            this.router.navigate(['/', 'metadata', 'provider', provider, 'filters']);
        })
    );

    constructor(
        private store: Store<fromRoot.State>,
        private actions$: Actions,
        private router: Router,
        private idService: EntityIdService,
        private filterService: MetadataFilterService,
        private contentionService: ContentionService
    ) { }
}
