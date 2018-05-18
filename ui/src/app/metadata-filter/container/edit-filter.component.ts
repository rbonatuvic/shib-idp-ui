import { Component, OnInit, OnDestroy, SimpleChanges, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/takeWhile';
import 'rxjs/add/observable/fromPromise';

import * as fromRoot from '../../app.reducer';
import * as fromFilter from '../reducer';
import * as fromCollection from '../../domain/reducer';
import { ProviderStatusEmitter, ProviderValueEmitter } from '../../domain/service/provider-change-emitter.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { CancelCreateFilter, SelectId, UpdateFilterChanges } from '../action/filter.action';
import { AddFilterRequest, UpdateFilterRequest } from '../../domain/action/filter-collection.action';
import { MetadataFilter } from '../../domain/model/metadata-filter';
import { Filter } from '../../domain/entity/filter';
import { EntityValidators } from '../../domain/service/entity-validators.service';
import { SearchDialogComponent } from '../component/search-dialog.component';
import { QueryEntityIds, ViewMoreIds, ClearSearch } from '../action/search.action';
import { AutoCompleteComponent } from '../../shared/autocomplete/autocomplete.component';
import { MDUI } from '../../domain/model/mdui';
import { PreviewEntity } from '../../domain/action/entity.action';
import { MetadataEntity } from '../../domain/domain.type';

@Component({
    selector: 'edit-filter-page',
    templateUrl: './edit-filter.component.html'
})
export class EditFilterComponent implements OnInit, OnDestroy {

    @ViewChild(AutoCompleteComponent) entityInput: AutoCompleteComponent;

    private ngUnsubscribe: Subject<void> = new Subject<void>();

    changeId = false;

    changes$: Observable<MetadataFilter>;
    changes: MetadataFilter;

    ids: string[];
    entityIds$: Observable<string[]>;
    showMore$: Observable<boolean>;
    selected$: Observable<string>;
    filter$: Observable<MetadataFilter>;
    loading$: Observable<boolean>;
    processing$: Observable<boolean>;
    preview$: Observable<MDUI>;
    isSaving$: Observable<boolean>;

    form: FormGroup = this.fb.group({
        entityId: [
            '',
            [Validators.required]
        ],
        filterName: ['', [Validators.required]],
        filterEnabled: [false]
    });

    filter: MetadataFilter;
    filterEntity: Filter;

    isValid = false;

    constructor(
        private store: Store<fromRoot.State>,
        private valueEmitter: ProviderValueEmitter,
        private fb: FormBuilder
    ) {
        this.changes$ = this.store.select(fromFilter.getFilter);
        this.changes$.subscribe(c => {
            this.changes = new Filter(c);
        });

        this.showMore$ = this.store.select(fromFilter.getViewingMore);
        this.selected$ = this.store.select(fromFilter.getSelected);
        this.filter$ = this.store.select(fromCollection.getSelectedFilter);
        this.entityIds$ = this.store.select(fromFilter.getEntityCollection);
        this.loading$ = this.store.select(fromFilter.getIsLoading);
        this.processing$ = this.loading$.withLatestFrom(this.showMore$, (l, s) => !s && l);
        this.preview$ = this.store.select(fromFilter.getPreview);
        this.isSaving$ = this.store.select(fromFilter.getSaving);

        this.entityIds$.subscribe(ids => this.ids = ids);

        this.filter$
            .withLatestFrom(this.isSaving$)
            .subscribe(([filter, saving]) => {
                let { entityId, filterName, filterEnabled } = new Filter(filter);
                this.form.reset({
                    entityId,
                    filterName,
                    filterEnabled
                });
                this.filter = filter;
                this.filterEntity = new Filter(filter);

                this.store.dispatch(new SelectId(entityId));
            });
    }

    ngOnInit(): void {
        let id = this.form.get('entityId');
        id.valueChanges
            .distinctUntilChanged()
            .subscribe(query => this.searchEntityIds(query));

        this.form
            .valueChanges
            .takeUntil(this.ngUnsubscribe)
            .startWith(this.form.value)
            .subscribe(changes => this.store.dispatch(new UpdateFilterChanges(changes)));
        this.valueEmitter
            .changeEmitted$
            .takeUntil(this.ngUnsubscribe)
            .startWith(this.form.value)
            .subscribe(changes => this.store.dispatch(new UpdateFilterChanges(changes)));

        this.form.get('entityId').disable();

        id.valueChanges
            .distinctUntilChanged()
            .subscribe(entityId => {
                if (id.valid) {
                    this.store.dispatch(new SelectId(entityId));
                }
            });

        this.selected$
            .distinctUntilChanged()
            .subscribe(entityId => {
                id.setValue(entityId);
            });
    }

    ngOnDestroy(): void {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }

    onChangeId(): void {
        const input = this.form.get('entityId');
        input.enable();
        input.setAsyncValidators(EntityValidators.existsInCollection(this.store.select(fromFilter.getEntityCollection)));
        input.reset('');
        this.entityInput.inputField.nativeElement.focus();
    }

    onCancelChangeId(): void {
        const input = this.form.get('entityId');
        input.disable();
        input.clearAsyncValidators();
        input.setValue(this.filterEntity.entityId);
    }

    searchEntityIds(term: string): void {
        if (term && term.length >= 4 && this.ids.indexOf(term) < 0) {
            this.store.dispatch(new QueryEntityIds({
                term,
                limit: 10
            }));
        }
    }

    onViewMore(query: string): void {
        this.store.dispatch(new ViewMoreIds(query));
    }

    onStatusChange(status): void {
        this.isValid = status === 'VALID';
    }

    save($event): void {
        $event.preventDefault();
        this.store.dispatch(new UpdateFilterRequest({...this.filter, ...this.changes.serialize()}));
    }

    cancel(): void {
        this.store.dispatch(new CancelCreateFilter());
    }

    preview(entity: MetadataEntity): void {
        this.store.dispatch(new PreviewEntity(new Filter(entity)));
    }
}