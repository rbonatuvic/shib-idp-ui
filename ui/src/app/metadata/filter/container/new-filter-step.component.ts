import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { FormBuilder } from '@angular/forms';
import { Subject, Observable } from 'rxjs';

import { takeUntil, shareReplay, withLatestFrom, map, switchMap, filter, distinctUntilChanged } from 'rxjs/operators';


import * as fromFilter from '../reducer';
import { FormDefinition, WizardStep } from '../../../wizard/model';
import { MetadataFilter } from '../../domain/model';
import { SchemaService } from '../../../schema-form/service/schema.service';
import { UpdateFilterChanges } from '../action/filter.action';
import { ActivatedRoute } from '@angular/router';
import * as fromWizard from '../../../wizard/reducer';
import { SetIndex } from '../../../wizard/action/wizard.action';
import { UpdateStatus } from '../action/editor.action';

@Component({
    selector: 'new-filter-step-page',
    templateUrl: './new-filter-step.component.html'
})
export class NewFilterStepComponent implements OnDestroy, OnInit {

    private ngUnsubscribe: Subject<void> = new Subject<void>();

    valueChangeSubject = new Subject<Partial<any>>();
    private valueChangeEmitted$ = this.valueChangeSubject.asObservable();

    statusChangeSubject = new Subject<{ value: any[] }>();
    private statusChangeEmitted$ = this.statusChangeSubject.asObservable();

    definition$: Observable<FormDefinition<MetadataFilter>>;
    schema$: Observable<any>;

    changes$: Observable<MetadataFilter>;
    isSaving$: Observable<boolean>;
    filter: MetadataFilter;

    validators$: Observable<{ [key: string]: any }>;

    options$: Observable<FormDefinition<MetadataFilter>[]>;

    step$: Observable<WizardStep>;

    currentPage: string;

    constructor(
        private store: Store<fromFilter.State>,
        private schemaService: SchemaService,
        private fb: FormBuilder,
        private route: ActivatedRoute
    ) {
        this.isSaving$ = this.store.select(fromFilter.getCollectionSaving);
        this.changes$ = this.store.select(fromFilter.getFilter);
        this.step$ = this.store.select(fromWizard.getCurrent);
        this.definition$ = this.store.select(fromWizard.getWizardDefinition).pipe(filter(d => !!d));
        this.schema$ = this.store.select(fromWizard.getSchema);

        this.validators$ = this.definition$.pipe(
            takeUntil(this.ngUnsubscribe),
            withLatestFrom(this.store.select(fromFilter.getFilterNames)),
            map(([definition, names]) => definition.getValidators(names))
        );

        let startIndex$ = this.route.params.pipe(map(p => p.form || 'filters'));
        startIndex$.subscribe(index => this.store.dispatch(new SetIndex(index)));
    }

    ngOnInit(): void {
        this.valueChangeEmitted$
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe(changes => this.store.dispatch(new UpdateFilterChanges(changes.value)));
        this.statusChangeEmitted$
            .pipe(
                takeUntil(this.ngUnsubscribe),
                distinctUntilChanged()
            )
            .subscribe(errors => {
                this.updateStatus(errors);
            });

        this.store
            .select(fromFilter.getFilter)
            .pipe(
                takeUntil(this.ngUnsubscribe),
                withLatestFrom(this.definition$),
                map(([filter, definition]) => definition.parser(filter))
            )
            .subscribe(filter => this.filter = filter);

        this.store.select(fromWizard.getWizardIndex).subscribe(i => this.currentPage = i);
    }

    updateStatus(errors: any): void {
        const status = { [this.currentPage]: !(errors.value) ? 'VALID' : 'INVALID' };
        this.store.dispatch(new UpdateStatus(status));
    }

    ngOnDestroy(): void {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }
}
