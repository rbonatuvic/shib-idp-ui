import { Component, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { skipWhile, takeUntil } from 'rxjs/operators';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import * as fromProvider from '../reducer';
import * as fromFilter from '../../filter/reducer';
import { MetadataFilter, MetadataProvider } from '../../domain/model';
import { SetIndex } from '../../../wizard/action/wizard.action';

import {
    UpdateFilterRequest,
    LoadFilterRequest,
    ChangeFilterOrderUp,
    ChangeFilterOrderDown,
    RemoveFilterRequest,
    ClearFilters
} from '../../filter/action/collection.action';
import { DeleteFilterComponent } from '../component/delete-filter.component';
import { NAV_FORMATS } from '../../domain/component/editor-nav.component';

@Component({
    selector: 'provider-filter-list',
    templateUrl: './provider-filter-list.component.html',
    styleUrls: ['./provider-filter-list.component.scss']
})
export class ProviderFilterListComponent implements OnDestroy {

    private ngUnsubscribe: Subject<void> = new Subject<void>();

    filters$: Observable<MetadataFilter[]>;
    provider$: Observable<MetadataProvider>;
    isSaving$: Observable<boolean>;

    provider: MetadataProvider;

    formats = NAV_FORMATS;

    constructor(
        private store: Store<fromProvider.ProviderState>,
        private modalService: NgbModal
    ) {

        console.log('filter list')
        this.filters$ = this.store.select(fromFilter.getAdditionalFilters) as Observable<MetadataFilter[]>;
        this.provider$ = this.store.select(fromProvider.getSelectedProvider).pipe(skipWhile(p => !p));
        this.provider$
            .pipe(
                takeUntil(this.ngUnsubscribe)
            )
            .subscribe(p => {
                this.store.dispatch(new LoadFilterRequest(p.resourceId));
                this.provider = p;
            });

        this.store.dispatch(new SetIndex('filters'));

        this.isSaving$ = this.store.select(fromFilter.getCollectionSaving);
    }

    toggleEnabled(filter: MetadataFilter): void {
        this.store.dispatch(new UpdateFilterRequest({
            filter: { ...filter, filterEnabled: !filter.filterEnabled },
            providerId: this.provider.resourceId
        }));
    }

    updateOrderUp(filter: MetadataFilter): void {
        this.store.dispatch(new ChangeFilterOrderUp({ id: filter.resourceId, providerId: this.provider.resourceId }));
    }

    updateOrderDown(filter: MetadataFilter): void {
        this.store.dispatch(new ChangeFilterOrderDown({ id: filter.resourceId, providerId: this.provider.resourceId }));
    }

    remove(id: string): void {
        this.modalService
            .open(DeleteFilterComponent)
            .result
            .then(
                success => {
                    this.store.dispatch(new RemoveFilterRequest(id));
                },
                err => {
                    console.log('Cancelled');
                }
            );
    }

    ngOnDestroy(): void {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();

        this.store.dispatch(new ClearFilters());
    }
}
