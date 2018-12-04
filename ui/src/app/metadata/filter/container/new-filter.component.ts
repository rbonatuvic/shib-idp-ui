import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subject, Observable, of } from 'rxjs';
import { takeUntil, shareReplay, withLatestFrom, map, filter } from 'rxjs/operators';

import * as fromFilter from '../reducer';
import { MetadataFilterTypes } from '../model';
import { FormDefinition } from '../../../wizard/model';
import { MetadataFilter } from '../../domain/model';
import { SchemaService } from '../../../schema-form/service/schema.service';
import { AddFilterRequest } from '../action/collection.action';
import { CancelCreateFilter, UpdateFilterChanges } from '../action/filter.action';

@Component({
    selector: 'new-filter-page',
    templateUrl: './new-filter.component.html'
})
export class NewFilterComponent implements OnDestroy, OnInit {

    private ngUnsubscribe: Subject<void> = new Subject<void>();

    valueChangeSubject = new Subject<Partial<any>>();
    private valueChangeEmitted$ = this.valueChangeSubject.asObservable();

    statusChangeSubject = new Subject<{ value: any[] }>();
    private statusChangeEmitted$ = this.statusChangeSubject.asObservable();

    definition: FormDefinition<MetadataFilter>;
    schema$: Observable<any>;

    model$: Observable<MetadataFilter>;
    isSaving$: Observable<boolean>;
    filter: MetadataFilter;
    isValid: boolean;

    validators$: Observable<{ [key: string]: any }>;

    constructor(
        private store: Store<fromFilter.State>,
        private schemaService: SchemaService
    ) {
        this.definition = MetadataFilterTypes.EntityAttributesFilter;

        this.schema$ = this.schemaService.get(this.definition.schema).pipe(shareReplay());
        this.isSaving$ = this.store.select(fromFilter.getCollectionSaving);
        this.model$ = of(<MetadataFilter>{});

        this.validators$ = this.store.select(fromFilter.getFilterNames).pipe(
            map((names) => this.definition.getValidators(names))
        );
    }

    ngOnInit(): void {
        this.valueChangeEmitted$
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe(changes => this.store.dispatch(new UpdateFilterChanges(changes.value)));
        this.statusChangeEmitted$
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe(valid => {
                this.isValid = valid.value ? valid.value.length === 0 : true;
            });

        this.store
            .select(fromFilter.getFilter)
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe(filter => this.filter = filter);
    }

    ngOnDestroy(): void {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }

    save(): void {
        this.store.dispatch(new AddFilterRequest(this.filter));
    }

    cancel(): void {
        this.store.dispatch(new CancelCreateFilter());
    }
}
