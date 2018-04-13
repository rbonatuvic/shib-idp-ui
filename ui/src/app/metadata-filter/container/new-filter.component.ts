import { Component, OnInit, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/takeWhile';
import 'rxjs/add/observable/fromPromise';

import * as fromFilter from '../reducer';
import { ProviderStatusEmitter, ProviderValueEmitter } from '../../domain/service/provider-change-emitter.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { CancelCreateFilter, SelectId, CreateFilter, UpdateFilterChanges } from '../action/filter.action';
import { AddFilterRequest } from '../../domain/action/filter-collection.action';
import { MetadataFilter } from '../../domain/model/metadata-filter';
import { Filter } from '../../domain/entity/filter';
import { EntityValidators } from '../../domain/service/entity-validators.service';
import { SearchDialogComponent } from '../component/search-dialog.component';
import { QueryEntityIds, ViewMoreIds } from '../action/search.action';

@Component({
    selector: 'new-filter-page',
    templateUrl: './new-filter.component.html'
})
export class NewFilterComponent implements OnInit, OnChanges, OnDestroy {

    private ngUnsubscribe: Subject<void> = new Subject<void>();
    private valueEmitSubscription: Subscription;
    private statusEmitSubscription: Subscription;

    changes$: Observable<MetadataFilter>;
    changes: MetadataFilter;
    filter: MetadataFilter = new Filter({
        entityId: '',
        filterName: '',
        relyingPartyOverrides: {
            signAssertion: false,
            dontSignResponse: false,
            turnOffEncryption: false,
            useSha: false,
            ignoreAuthenticationMethod: false,
            omitNotBefore: false,
            responderId: '',
            nameIdFormats: [],
            authenticationMethods: []
        },
        attributeRelease: []
    });

    ids: string[];
    entityIds$: Observable<string[]>;
    showMore$: Observable<boolean>;
    selected$: Observable<string>;
    loading$: Observable<boolean>;
    processing$: Observable<boolean>;

    form: FormGroup = this.fb.group({
        entityId: ['', [Validators.required], [
            EntityValidators.existsInCollection(this.store.select(fromFilter.getEntityCollection))
        ]],
        filterName: ['', [Validators.required]],
        filterEnabled: [false]
    });

    isValid = false;

    constructor(
        private store: Store<fromFilter.State>,
        private valueEmitter: ProviderValueEmitter,
        private fb: FormBuilder
    ) {
        this.changes$ = this.store.select(fromFilter.getFilter);
        this.changes$.subscribe(c => this.changes = c);

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

    ngOnInit(): void {
        this.store.dispatch(new CreateFilter(this.filter));

        let id = this.form.get('entityId');
        id.valueChanges
            .distinctUntilChanged()
            .subscribe(query => this.searchEntityIds(query));

        this.valueEmitSubscription = this.form
            .valueChanges
            .takeUntil(this.ngUnsubscribe)
            .startWith(this.form.value)
            .subscribe(changes => this.store.dispatch(new UpdateFilterChanges(changes)));
        this.valueEmitter
            .changeEmitted$
            .takeUntil(this.ngUnsubscribe)
            .startWith(this.form.value)
            .subscribe(changes => this.store.dispatch(new UpdateFilterChanges(changes)));

        /*this.statusEmitSubscription = this.form
            .statusChanges
            .takeUntil(this.ngUnsubscribe)
            .startWith(this.form.status)
            .subscribe(status => this.onStatusChange.emit(status));*/
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.entity) {
            let { entityId, filterName, filterEnabled } = this.filter;
            this.form.reset({
                entityId,
                filterName,
                filterEnabled
            });
            this.form.updateValueAndValidity();
            if (changes.entity.firstChange && this.filter.entityId) {
                this.store.dispatch(new SelectId(this.filter.entityId));
                this.searchEntityIds(this.filter.entityId);
            }
        }
    }

    ngOnDestroy(): void {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }

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

    onStatusChange(status): void {
        this.isValid = status === 'VALID';
    }

    save(): void {
        this.store.dispatch(new AddFilterRequest(this.changes));
    }

    cancel(): void {
        this.store.dispatch(new CancelCreateFilter());
    }
}
