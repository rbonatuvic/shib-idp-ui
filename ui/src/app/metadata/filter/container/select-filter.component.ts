import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { NgbPopoverConfig } from '@ng-bootstrap/ng-bootstrap';

import { MetadataFilter } from '../../domain/model/metadata-filter';
import { SelectFilter } from '../action/collection.action';
import * as fromFilter from '../reducer';

@Component({
    selector: 'select-filter-page',
    templateUrl: './select-filter.component.html',
    styleUrls: ['./select-filter.component.scss'],
    providers: [NgbPopoverConfig]
})
export class SelectFilterComponent implements OnDestroy {
    actionsSubscription: Subscription;
    filter$: Observable<MetadataFilter>;

    constructor(
        private store: Store<fromFilter.State>,
        private route: ActivatedRoute
    ) {
        this.actionsSubscription = this.route.params.pipe(
            distinctUntilChanged(),
            map(params => {
                return new SelectFilter(params.id);
            })
        ).subscribe(store);

        this.filter$ = this.store.select(fromFilter.getSelectedFilter);
    }

    ngOnDestroy() {
        this.actionsSubscription.unsubscribe();
    }
} /* istanbul ignore next */
