import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { map, switchMap, catchError, withLatestFrom, tap } from 'rxjs/operators';

import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

import * as filterActions from '../action/filter.action';
import * as fromFilter from '../reducer';
import * as fromCollection from '../../domain/reducer';
import * as fromRoot from '../../app.reducer';
import * as collection from '../../domain/action/filter-collection.action';
import { FilterCollectionActionTypes } from '../../domain/action/filter-collection.action';

import { SearchDialogComponent } from '../component/search-dialog.component';
import { EntityIdService } from '../../domain/service/entity-id.service';
import { MetadataResolverService } from '../../domain/service/metadata-resolver.service';
import { ShowContentionAction } from '../../contention/action/contention.action';

import { Contention } from '../../contention/model/contention';
import { MetadataFilter } from '../../domain/domain.type';
import { CancelChanges } from '../../edit-provider/action/editor.action';
import { Update } from '@ngrx/entity';
import { ContentionService } from '../../contention/service/contention.service';

@Injectable()
export class FilterEffects {

    @Effect()
    loadEntityMdui$ = this.actions$.pipe(
        ofType<filterActions.SelectId>(filterActions.SELECT_ID),
        map(action => action.payload),
        switchMap(query =>
            this.idService.findEntityById(query).pipe(
                map(data => new filterActions.LoadEntityPreviewSuccess(data)),
                catchError(error => of(new filterActions.LoadEntityPreviewError(error)))
            )
        )
    );

    @Effect()
    openContention$ = this.actions$.pipe(
        ofType<collection.UpdateFilterFail>(collection.FilterCollectionActionTypes.UPDATE_FILTER_FAIL),
        map(action => action.payload),
        withLatestFrom(this.store.select(fromCollection.getSelectedFilter)),
        switchMap(([filter, current]) =>
            this.resolverService.find(filter.id).pipe(
                map(data => new ShowContentionAction(this.contentionService.getContention(current, filter, data, {
                    resolve: (obj) => this.store.dispatch(new collection.UpdateFilterRequest(<MetadataFilter>{ ...obj })),
                    reject: (obj) => this.store.dispatch(new filterActions.CancelCreateFilter())
                })))
            )
        )
    );

    @Effect({ dispatch: false })
    saveFilterSuccess$ = this.actions$.pipe(
        ofType<collection.AddFilterSuccess>(FilterCollectionActionTypes.ADD_FILTER_SUCCESS),
        switchMap(() => this.router.navigate(['/dashboard']))
    );

    @Effect()
    cancelChanges$ = this.actions$.pipe(
        ofType<filterActions.CancelCreateFilter>(filterActions.CANCEL_CREATE_FILTER),
        map(() => new collection.LoadFilterRequest()),
        tap(() => this.router.navigate(['/dashboard']))
    );

    constructor(
        private store: Store<fromRoot.State>,
        private actions$: Actions,
        private router: Router,
        private idService: EntityIdService,
        private resolverService: MetadataResolverService,
        private contentionService: ContentionService
    ) { }
}
