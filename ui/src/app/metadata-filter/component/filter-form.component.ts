import { Component, OnInit, OnChanges, OnDestroy, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { FormBuilder, FormArray, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/takeWhile';

import * as fromFilter from '../reducer';
import { ProviderFormFragmentComponent } from '../../metadata-provider/component/forms/provider-form-fragment.component';
import { ProviderStatusEmitter, ProviderValueEmitter } from '../../domain/service/provider-change-emitter.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SearchDialogComponent } from '../component/search-dialog.component';
import { ViewMoreIds, CancelCreateFilter, QueryEntityIds } from '../action/filter.action';
import { EntityValidators } from '../../domain/service/entity-validators.service';
import { MetadataProvider } from '../../domain/model/metadata-provider';
import { MetadataFilter } from '../../domain/domain.type';

@Component({
    selector: 'filter-form',
    templateUrl: './filter-form.component.html'
})
export class FilterFormComponent extends ProviderFormFragmentComponent implements OnInit, OnDestroy {

    @Input() entity: MetadataFilter;

    @Output() onSave: EventEmitter<MetadataProvider> = new EventEmitter<MetadataProvider>();
    @Output() onCancel: EventEmitter<MetadataProvider> = new EventEmitter<MetadataProvider>();
    @Output() onPreview: EventEmitter<any> = new EventEmitter<any>();

    ids: string[];
    entityIds$: Observable<string[]>;
    showMore$: Observable<boolean>;
    selected$: Observable<string>;
    loading$: Observable<boolean>;
    processing$: Observable<boolean>;

    nameIdFormatList: FormArray;
    authenticationMethodList: FormArray;

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
            filterName: ['', [Validators.required]],
            filterEnabled: [false]
        });
    }

    ngOnInit(): void {
        super.ngOnInit();
        let id = this.form.get('entityId');
        id.setAsyncValidators([EntityValidators.existsInCollection(this.entityIds$)]);
        id.valueChanges
            .distinctUntilChanged()
            .subscribe(query => this.searchEntityIds(query));
    }

    ngOnDestroy(): void { }

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
}
