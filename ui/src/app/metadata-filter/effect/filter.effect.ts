import { Injectable } from '@angular/core';
import { Effect, Actions } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

import 'rxjs/add/operator/switchMap';

import * as filter from '../action/filter.action';
import * as fromFilter from '../reducer';
import * as collection from '../../domain/action/filter-collection.action';
import { FilterCollectionActionTypes } from '../../domain/action/filter-collection.action';

import { SearchDialogComponent } from '../component/search-dialog.component';
import { EntityIdService } from '../../domain/service/entity-id.service';
import { MetadataResolverService } from '../../domain/service/metadata-resolver.service';

@Injectable()
export class FilterEffects {

    @Effect()
    loadEntityMdui$ = this.actions$
        .ofType<filter.SelectId>(filter.SELECT_ID)
        .map(action => action.payload)
        .switchMap(query =>
            this.idService
                .findEntityById(query)
                .map(data => new filter.LoadEntityPreviewSuccess(data))
                .catch(error => Observable.of(new filter.LoadEntityPreviewError(error)))
        );

    @Effect({ dispatch: false })
    saveFilterSuccess$ = this.actions$
        .ofType<collection.AddFilterSuccess>(FilterCollectionActionTypes.ADD_FILTER_SUCCESS)
        .switchMap(() => this.router.navigate(['/dashboard']));

    @Effect({ dispatch: false })
    cancelChanges$ = this.actions$
        .ofType<filter.CancelCreateFilter>(filter.CANCEL_CREATE_FILTER)
        .switchMap(() => this.router.navigate(['/dashboard']));

    constructor(
        private actions$: Actions,
        private router: Router,
        private modalService: NgbModal,
        private idService: EntityIdService,
        private resolverService: MetadataResolverService,
        private store: Store<fromFilter.State>
    ) { }
}
