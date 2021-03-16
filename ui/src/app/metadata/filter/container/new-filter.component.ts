import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Subject, Observable, of } from 'rxjs';

import { takeUntil, shareReplay, withLatestFrom, map, switchMap, filter, startWith, distinctUntilChanged, share } from 'rxjs/operators';


import * as fromFilter from '../reducer';
import { MetadataFilterTypes } from '../model';
import { FormDefinition } from '../../../wizard/model';
import { MetadataFilter } from '../../domain/model';
import { SchemaService } from '../../../schema-form/service/schema.service';
import { AddFilterRequest } from '../action/collection.action';
import { CancelCreateFilter, UpdateFilterChanges, SelectFilterType } from '../action/filter.action';
import { ActivatedRoute } from '@angular/router';


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

    definition$: Observable<FormDefinition<MetadataFilter>>;
    schema$: Observable<any>;

    changes$: Observable<MetadataFilter>;
    model: any;
    isSaving$: Observable<boolean>;
    filter: MetadataFilter;
    isValid: boolean;

    validators$: Observable<{ [key: string]: any }>;

    form: FormGroup = this.fb.group({
        type: ['', Validators.required]
    });

    options$: Observable<FormDefinition<MetadataFilter>[]>;

    constructor(
        private store: Store<fromFilter.State>,
        private schemaService: SchemaService,
        private fb: FormBuilder,
        private route: ActivatedRoute
    ) {
        this.isSaving$ = this.store.select(fromFilter.getCollectionSaving);

        this.changes$ = this.store.select(fromFilter.getFilter);

        this.model = {};

        this.definition$ = this.store.select(fromFilter.getFilterType).pipe(
            takeUntil(this.ngUnsubscribe),
            filter(t => !!t),
            map(t => MetadataFilterTypes[t])
        );

        this.schema$ = this.definition$.pipe(
            takeUntil(this.ngUnsubscribe),
            filter(d => !!d),
            switchMap(d => {
                return this.schemaService.get(d.schema).pipe(takeUntil(this.ngUnsubscribe));
            }),
            shareReplay()
        );

        this.validators$ = this.definition$.pipe(
            takeUntil(this.ngUnsubscribe),
            withLatestFrom(this.store.select(fromFilter.getFilterNames)),
            map(([definition, names]) => definition.getValidators(names))
        );

        this.options$ = of(Object.values(MetadataFilterTypes));

        this.form.get('type').valueChanges
            .pipe(
                takeUntil(this.ngUnsubscribe),
                distinctUntilChanged()
            )
            .subscribe(type => this.store.dispatch(new SelectFilterType(type)));
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
            .pipe(
                takeUntil(this.ngUnsubscribe),
                withLatestFrom(this.definition$),
                map(([filter, definition]) => definition.parser(filter))
            )
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
        this.store.dispatch(new CancelCreateFilter(this.route.snapshot.params.providerId));
    }
}
