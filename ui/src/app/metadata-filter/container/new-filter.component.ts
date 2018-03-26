import { Component, OnInit, OnChanges, OnDestroy } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/takeWhile';

import * as fromFilter from '../reducer';
import { ProviderFormFragmentComponent } from '../../metadata-provider/component/forms/provider-form-fragment.component';
import { ProviderStatusEmitter, ProviderValueEmitter } from '../../metadata-provider/service/provider-change-emitter.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SearchDialogComponent } from '../component/search-dialog.component';
import { ViewMoreIds, CancelCreateFilter, QueryEntityIds } from '../action/filter.action';
import { EntityValidators } from '../../metadata-provider/service/entity-validators.service';


@Component({
    selector: 'new-filter-page',
    templateUrl: './new-filter.component.html'
})
export class NewFilterComponent extends ProviderFormFragmentComponent implements OnInit, OnChanges, OnDestroy {

    ids: string[];
    entityIds$: Observable<string[]>;
    showMore$: Observable<boolean>;
    selected$: Observable<string>;
    loading$: Observable<boolean>;
    processing$: Observable<boolean>;

    constructor(
        private store: Store<fromFilter.State>,
        protected statusEmitter: ProviderStatusEmitter,
        protected valueEmitter: ProviderValueEmitter,
        protected fb: FormBuilder
    ) {
        super(fb, statusEmitter, valueEmitter);

        this.showMore$ = this.store.select(fromFilter.getViewingMore);
        this.selected$ = this.store.select(fromFilter.getSelected);
        this.entityIds$ = this.store.select(fromFilter.getEntityCollection);
        this.loading$ = this.store.select(fromFilter.getIsLoading);
        this.processing$ = this.loading$.withLatestFrom(this.showMore$, (l, s) => !s && l);

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

    searchEntityIds(term: string): void {
        if (term.length >= 4 && this.ids.indexOf(term) < 0) {
            this.store.dispatch(new QueryEntityIds({
                term,
                limit: 10
            }));
        }
    }

    onViewMore(query: string): void {
        this.store.dispatch(new ViewMoreIds(query));
    }

    save(): void {
        console.log('Save!');
    }

    cancel(): void {
        this.store.dispatch(new CancelCreateFilter());
    }
}
