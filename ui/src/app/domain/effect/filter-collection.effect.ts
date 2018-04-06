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

import * as actions from '../action/filter-collection.action';
import * as fromFilter from '../reducer';

import { EntityIdService } from '../../domain/service/entity-id.service';
import { MetadataFilterService } from '../service/filter.service';
import { MetadataFilter } from '../../domain/model/metadata-filter';

@Injectable()
export class FilterCollectionEffects {

    @Effect()
    saveFilter$ = this.actions$
        .ofType<actions.SaveFilter>(actions.SAVE_FILTER)
        .map(action => action.payload)
        .switchMap(unsaved =>
            this.filterService
                .save(unsaved as MetadataFilter)
                .map(saved => new actions.SaveFilterSuccess(saved))
                .catch(error => Observable.of(new actions.SaveFilterError(error)))
        );

    constructor(
        private actions$: Actions,
        private router: Router,
        private modalService: NgbModal,
        private idService: EntityIdService,
        private filterService: MetadataFilterService,
        private store: Store<fromFilter.State>
    ) { }
}
