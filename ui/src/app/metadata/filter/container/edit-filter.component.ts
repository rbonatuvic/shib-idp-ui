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
import { NAV_FORMATS } from '../../domain/component/editor-nav.component';
import { shareReplay, map, withLatestFrom, filter, switchMap, takeUntil } from 'rxjs/operators';
import * as fromWizard from '../../../wizard/reducer';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'edit-filter-page',
    templateUrl: './edit-filter.component.html'
})
export class EditFilterComponent implements OnDestroy {

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

    status$: Observable<any>;

    validators$: Observable<{ [key: string]: any }>;

    actions: any;

    defSub: Subscription;

    formats = NAV_FORMATS;

    constructor(
        private store: Store<fromFilter.State>,
        private schemaService: SchemaService,
        private route: ActivatedRoute
    ) {

        this.definition$ = this.store.select(fromWizard.getWizardDefinition).pipe(filter(d => !!d))

        this.defSub = this.definition$.subscribe(d => this.definition = d);

        this.schema$ = this.definition$.pipe(
            takeUntil(this.ngUnsubscribe),
            filter(d => !!d),
            switchMap(d => this.schemaService.get(d.schema).pipe(takeUntil(this.ngUnsubscribe))),
            shareReplay()
        );

        this.isSaving$ = this.store.select(fromFilter.getCollectionSaving);
        this.model$ = this.store.select(fromFilter.getSelectedFilter);
        this.type$ = this.model$.pipe(map(f => f && f.hasOwnProperty('@type') ? f['@type'] : ''));

        this.valueChangeEmitted$.subscribe(changes => this.store.dispatch(new UpdateFilterChanges(changes.value)));
        this.statusChangeEmitted$.subscribe(valid => {
            this.isValid = valid.value ? valid.value.length === 0 : true;
        });

        this.status$ = this.store.select(fromFilter.getInvalidEditorForms);

        this.validators$ = this.store.select(fromFilter.getFilterNames).pipe(
            takeUntil(this.ngUnsubscribe),
            withLatestFrom(
                this.store.select(fromFilter.getSelectedFilter),
                this.definition$
            ),
            map(([names, provider, definition]) => definition.getValidators(
                names.filter(n => n !== provider.name)
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
        this.store.dispatch(new UpdateFilterRequest({
            filter: this.filter,
            providerId: this.route.snapshot.params.providerId
        }));
    }

    cancel(): void {
        this.store.dispatch(new CancelCreateFilter(this.route.snapshot.params.providerId));
    }

    preview(id: string): void {
        this.store.dispatch(new PreviewEntity({
            id,
            entity: this.definition.getEntity(this.filter)
        }));
    }
}

