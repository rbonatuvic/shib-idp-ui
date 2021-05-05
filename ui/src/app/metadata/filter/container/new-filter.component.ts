import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Subject, Observable, of, combineLatest } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { takeUntil, withLatestFrom, map, filter, distinctUntilChanged, skip } from 'rxjs/operators';

import * as fromFilter from '../reducer';
import { MetadataFilterEditorTypes, MetadataFilterTypes } from '../model';
import { FormDefinition } from '../../../wizard/model';
import { MetadataFilter } from '../../domain/model';
import { AddFilterRequest } from '../action/collection.action';
import { CancelCreateFilter, SelectFilterType } from '../action/filter.action';
import * as fromWizard from '../../../wizard/reducer';
import { LoadSchemaRequest, SetDefinition, SetIndex } from '../../../wizard/action/wizard.action';
import { NAV_FORMATS } from '../../domain/component/editor-nav.component';

@Component({
    selector: 'new-filter-page',
    templateUrl: './new-filter.component.html'
})
export class NewFilterComponent implements OnDestroy, OnInit {

    private ngUnsubscribe: Subject<void> = new Subject<void>();

    definition$: Observable<FormDefinition<MetadataFilter>>;
    schema$: Observable<any>;

    isSaving$: Observable<boolean>;
    filter: MetadataFilter;
    isValid$: Observable<boolean>;
    isInvalid$: Observable<boolean>;
    cantSave$: Observable<boolean>;

    validators$: Observable<{ [key: string]: any }>;

    form: FormGroup = this.fb.group({
        type: ['', Validators.required]
    });

    options$: Observable<FormDefinition<MetadataFilter>[]>;

    formats = NAV_FORMATS;

    status$: Observable<any>;

    type$: Observable<string> = this.store.select(fromFilter.getFilterType);

    constructor(
        private store: Store<fromFilter.State>,
        private fb: FormBuilder,
        private route: ActivatedRoute
    ) {
        this.isSaving$ = this.store.select(fromFilter.getCollectionSaving);
        this.isValid$ = this.store.select(fromFilter.getFilterIsValid);
        this.isInvalid$ = this.isValid$.pipe(map(v => !v));

        this.cantSave$ = this.store.select(fromFilter.cantSaveFilter).pipe(skip(1));

        this.definition$ = this.store.select(fromFilter.getFilterType).pipe(
            takeUntil(this.ngUnsubscribe),
            filter(t => !!t),
            map(t => MetadataFilterTypes[t])
        );

        this.store
            .select(fromWizard.getCurrentWizardSchema)
            .pipe(filter(s => !!s), takeUntil(this.ngUnsubscribe))
            .subscribe(s => {
                if (s) {
                    this.store.dispatch(new LoadSchemaRequest(s));
                }
            });

        let startIndex$ = this.route.params.pipe(map(p => p.form || 'filters'), takeUntil(this.ngUnsubscribe));
        startIndex$.subscribe(index => this.store.dispatch(new SetIndex(index)));

        this.status$ = this.store.select(fromFilter.getInvalidEditorForms);
        this.options$ = of(Object.values(MetadataFilterTypes));

        this.form.get('type').valueChanges
            .pipe(
                takeUntil(this.ngUnsubscribe),
                distinctUntilChanged()
            )
            .subscribe(type => {
                this.store.dispatch(new SelectFilterType(type));
            });

        this.type$.pipe(
            takeUntil(this.ngUnsubscribe)
        ).subscribe((t: string) => {
            if (t) {
                this.store.dispatch(new SetDefinition({
                    ...MetadataFilterEditorTypes.find(def => def.type === t)
                }));
            }
        });
    }

    ngOnInit(): void {
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
        this.store.dispatch(new AddFilterRequest({
            filter: this.filter,
            providerId: this.route.snapshot.params.providerId
        }));
    }

    cancel(): void {
        this.store.dispatch(new CancelCreateFilter(this.route.snapshot.params.providerId));
    }
}
