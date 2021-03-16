import { Component, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subject, Observable, Subscription } from 'rxjs';

import * as fromFilter from '../reducer';
import { MetadataFilterTypes } from '../model';
import { FormDefinition } from '../../../wizard/model';
import { MetadataFilter } from '../../domain/model';
import { SchemaService } from '../../../schema-form/service/schema.service';
import { UpdateFilterRequest } from '../action/collection.action';
import { CancelCreateFilter, UpdateFilterChanges } from '../action/filter.action';
import { PreviewEntity } from '../../domain/action/entity.action';
import { shareReplay, map, withLatestFrom, filter, switchMap, startWith, defaultIfEmpty, takeUntil } from 'rxjs/operators';

@Component({
    selector: 'edit-filter-step-page',
    templateUrl: './edit-filter-step.component.html'
})
export class EditFilterStepComponent implements OnDestroy {

    private ngUnsubscribe: Subject<void> = new Subject<void>();

    valueChangeSubject = new Subject<Partial<any>>();
    private valueChangeEmitted$ = this.valueChangeSubject.asObservable();

    statusChangeSubject = new Subject<{ value: any[] }>();
    private statusChangeEmitted$ = this.statusChangeSubject.asObservable();

    definition$: Observable<FormDefinition<MetadataFilter>>;
    definition: FormDefinition<MetadataFilter>;
    schema$: Observable<any>;

    model$: Observable<MetadataFilter>;
    isSaving$: Observable<boolean>;
    filter: MetadataFilter;
    isValid: boolean;
    type$: Observable<string>;

    validators$: Observable<{ [key: string]: any }>;

    actions: any;

    defSub: Subscription;

    constructor(
        private store: Store<fromFilter.State>,
        private schemaService: SchemaService
    ) {
        this.definition$ = this.store.select(fromFilter.getFilterType).pipe(
            takeUntil(this.ngUnsubscribe),
            filter(t => !!t),
            map(t => MetadataFilterTypes[t])
        );

        this.defSub = this.definition$.subscribe(d => this.definition = d);

        this.definition$.subscribe(console.log);

        this.schema$ = this.definition$.pipe(
            takeUntil(this.ngUnsubscribe),
            filter(d => !!d),
            switchMap(d => {
                return this.schemaService.get(d.schema).pipe(takeUntil(this.ngUnsubscribe));
            }),
            shareReplay()
        );
        this.isSaving$ = this.store.select(fromFilter.getCollectionSaving);
        this.model$ = this.store.select(fromFilter.getSelectedFilter);
        this.type$ = this.model$.pipe(map(f => f && f.hasOwnProperty('@type') ? f['@type'] : ''));

        this.valueChangeEmitted$.subscribe(changes => this.store.dispatch(new UpdateFilterChanges(changes.value)));
        this.statusChangeEmitted$.subscribe(valid => {
            this.isValid = valid.value ? valid.value.length === 0 : true;
        });

        this.validators$ = this.store.select(fromFilter.getFilterNames).pipe(
            takeUntil(this.ngUnsubscribe),
            withLatestFrom(
                this.store.select(fromFilter.getSelectedFilter),
                this.definition$
            ),
            map(([names, filter, definition]) => definition.getValidators(
                names.filter(n => n !== filter.name)
            ))
        );

        this.store
            .select(fromFilter.getFilter)
            .subscribe(filter => this.filter = filter);

        this.actions = {
            preview: (property: any, parameters: any) => {
                this.preview(parameters.filterId);
            }
        };
    }

    ngOnDestroy(): void {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
        this.defSub.unsubscribe();
    }

    save(): void {
        this.store.dispatch(new UpdateFilterRequest(this.filter));
    }

    cancel(): void {
        this.store.dispatch(new CancelCreateFilter());
    }

    preview(id: string): void {
        this.store.dispatch(new PreviewEntity({
            id,
            entity: this.definition.getEntity(this.filter)
        }));
    }
}

