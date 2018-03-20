import { Component, OnInit, OnChanges, OnDestroy } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

import * as fromFilter from '../reducer';
import { ProviderFormFragmentComponent } from '../../metadata-provider/component/forms/provider-form-fragment.component';
import { ProviderStatusEmitter, ProviderValueEmitter } from '../../metadata-provider/service/provider-change-emitter.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SearchDialogComponent } from '../component/search-dialog.component';
import { ViewMoreIds, CancelCreateFilter, LoadEntityIds } from '../action/filter.action';
import { EntityValidators } from '../../metadata-provider/service/entity-validators.service';


@Component({
    selector: 'new-filter-page',
    templateUrl: './new-filter.component.html'
})
export class NewFilterComponent extends ProviderFormFragmentComponent implements OnInit, OnChanges, OnDestroy {

    entityIds$: Observable<string[]>;
    ids: string[];

    showMore$: Observable<boolean>;
    selected$: Observable<string>;
    loading$: Observable<boolean>;

    constructor(
        private store: Store<fromFilter.State>,
        protected statusEmitter: ProviderStatusEmitter,
        protected valueEmitter: ProviderValueEmitter,
        protected fb: FormBuilder
    ) {
        super(fb, statusEmitter, valueEmitter);

        // this.form.statusChanges.subscribe(status => console.log(status));

        this.showMore$ = this.store.select(fromFilter.getViewingMore);
        this.selected$ = this.store.select(fromFilter.getSelected);
        this.entityIds$ = this.store.select(fromFilter.getEntityCollection);
        this.loading$ = this.store.select(fromFilter.getIsLoading);

        this.entityIds$.subscribe(ids => this.ids = ids);

        this.selected$.subscribe(s => {
            this.form.patchValue({
                entityId: s
            });
        });
    }

    createForm(): void {
        this.form = this.fb.group({
            entityId: ['', [Validators.required]],
            filterName: ['', [Validators.required]]
        });
    }

    ngOnInit(): void {
        super.ngOnInit();

        this.form.get('entityId').setAsyncValidators([EntityValidators.existsInCollection(this.entityIds$)]);
    }

    ngOnChanges(): void {}

    ngOnDestroy(): void {}

    searchEntityIds(query: string): void {
        if (query.length >= 4) {
            this.store.dispatch(new LoadEntityIds(query));
        }
    }

    onViewMore(): void {
        this.store.dispatch(new ViewMoreIds(this.ids));
    }

    save(): void {
        console.log('Save!');
    }

    cancel(): void {
        this.store.dispatch(new CancelCreateFilter());
    }
}
