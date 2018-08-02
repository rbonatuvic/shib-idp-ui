import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { skipWhile } from 'rxjs/operators';
import * as fromProvider from '../reducer';
import * as fromFilter from '../../filter/reducer';
import { MetadataFilter, MetadataProvider } from '../../domain/model';
import { NAV_FORMATS } from '../component/provider-editor-nav.component';
import { SetIndex } from '../../../wizard/action/wizard.action';
import { UpdateFilterRequest, LoadFilterRequest } from '../../filter/action/collection.action';

@Component({
    selector: 'provider-filter-list',
    templateUrl: './provider-filter-list.component.html',
    styleUrls: ['./provider-filter-list.component.scss']
})
export class ProviderFilterListComponent {

    filters$: Observable<MetadataFilter[]>;
    provider$: Observable<MetadataProvider>;
    isSaving$: Observable<boolean>;

    formats = NAV_FORMATS;

    constructor(
        private store: Store<fromProvider.ProviderState>
    ) {
        this.filters$ = this.store.select(fromFilter.getAdditionalFilters);
        this.provider$ = this.store.select(fromProvider.getSelectedProvider).pipe(skipWhile(p => !p));

        this.store.dispatch(new SetIndex('filters'));

        this.provider$.subscribe(p => {
            this.store.dispatch(new LoadFilterRequest(p.resourceId));
        });

        this.isSaving$ = this.store.select(fromFilter.getFiltersSaving);
    }

    toggleEnabled(filter: MetadataFilter): void {
        this.store.dispatch(new UpdateFilterRequest({ ...filter, filterEnabled: !filter.filterEnabled }));
    }
}
