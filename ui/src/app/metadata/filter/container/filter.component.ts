import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import { MetadataFilter } from '../../domain/model/metadata-filter';
import { LoadFilterRequest } from '../action/collection.action';
import * as fromFilter from '../reducer';

@Component({
    selector: 'filter-page',
    templateUrl: './filter.component.html',
    styleUrls: [],
    providers: []
})
export class FilterComponent implements OnDestroy {
    actionsSubscription: Subscription;
    filters$: Observable<MetadataFilter[]>;

    constructor(
        private store: Store<fromFilter.State>,
        private route: ActivatedRoute
    ) {
        this.actionsSubscription = this.route.parent.params.pipe(
            distinctUntilChanged(),
            map(params => {
                return new LoadFilterRequest(params.providerId);
            })
        ).subscribe(store);
    }

    ngOnDestroy() {
        this.actionsSubscription.unsubscribe();
    }
} /* istanbul ignore next */
