import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { distinctUntilChanged, filter, map } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import { MetadataFilter } from '../../domain/model/metadata-filter';
import { LoadFilterRequest } from '../action/collection.action';
import * as fromFilter from '../reducer';
import * as fromProviders from '../../provider/reducer';
import { SelectProviderRequest } from '../../provider/action/collection.action';
import { MetadataProvider } from '../../domain/model';

@Component({
    selector: 'filter-page',
    templateUrl: './filter.component.html',
    styleUrls: [],
    providers: []
})
export class FilterComponent implements OnDestroy {
    filterSelectSubscription: Subscription;
    filters$: Observable<MetadataFilter[]>;
    provider$: Observable<MetadataProvider>;

    constructor(
        private store: Store<fromFilter.State>,
        private route: ActivatedRoute
    ) {
        const params$ = this.route.params.pipe(distinctUntilChanged());
        
        this.filterSelectSubscription = params$.pipe(
            map(params => new LoadFilterRequest(params.providerId))
        ).subscribe(this.store);
    }

    ngOnDestroy() {
        this.filterSelectSubscription.unsubscribe();
    }
} /* istanbul ignore next */
