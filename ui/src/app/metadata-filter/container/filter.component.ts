import { Component, Output, Input, EventEmitter, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { NgbPopoverConfig } from '@ng-bootstrap/ng-bootstrap';

import { MetadataFilter } from '../../domain/model/metadata-filter';
import { SelectFilter } from '../../domain/action/filter-collection.action';
import * as fromFilters from '../reducer';
import * as fromCollection from '../../domain/reducer';


@Component({
    selector: 'filter-page',
    templateUrl: './filter.component.html',
    styleUrls: ['./filter.component.scss'],
    providers: [NgbPopoverConfig]
})
export class FilterComponent implements OnDestroy {
    actionsSubscription: Subscription;
    filter$: Observable<MetadataFilter>;

    constructor(
        private store: Store<fromFilters.State>,
        private route: ActivatedRoute
    ) {
        this.actionsSubscription = route.params.pipe(
            distinctUntilChanged(),
            map(params => new SelectFilter(params.id))
        ).subscribe(store);

        this.filter$ = this.store.select(fromCollection.getSelectedFilter);
    }

    ngOnDestroy() {
        this.actionsSubscription.unsubscribe();
    }
} /* istanbul ignore next */
