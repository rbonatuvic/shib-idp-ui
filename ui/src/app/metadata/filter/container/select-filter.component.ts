import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { NgbPopoverConfig } from '@ng-bootstrap/ng-bootstrap';

import { MetadataFilter } from '../../domain/model/metadata-filter';
import { SelectFilter } from '../action/collection.action';
import * as fromFilter from '../reducer';
import { MetadataFilterEditorTypes } from '../model';
import { SetDefinition } from '../../../wizard/action/wizard.action';

@Component({
    selector: 'select-filter-page',
    templateUrl: './select-filter.component.html',
    styleUrls: ['./select-filter.component.scss'],
    providers: [NgbPopoverConfig]
})
export class SelectFilterComponent implements OnDestroy {
    actionsSubscription: Subscription;
    filterSubscription: Subscription;
    filter$: Observable<MetadataFilter>;

    constructor(
        private store: Store<fromFilter.State>,
        private route: ActivatedRoute
    ) {
        this.actionsSubscription = this.route.params.pipe(
            distinctUntilChanged(),
            map(params => new SelectFilter(params.filterId))
        ).subscribe(store);

        this.filter$ = this.store.select(fromFilter.getSelectedFilter);

        this.filterSubscription = this.filter$.subscribe(f => {
            this.setDefinition(f);
        });
    }

    setDefinition(filter: MetadataFilter): void {
        if (filter) {
            this.store.dispatch(new SetDefinition({
                ...MetadataFilterEditorTypes.find(def => def.type === filter['@type'])
            }));
        }
    }

    ngOnDestroy() {
        this.actionsSubscription.unsubscribe();
        this.filterSubscription.unsubscribe();
    }
} /* istanbul ignore next */
