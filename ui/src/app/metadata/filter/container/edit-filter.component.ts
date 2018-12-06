import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subject, Observable } from 'rxjs';

import * as fromFilter from '../reducer';
import { MetadataFilterTypes } from '../model';
import { FormDefinition } from '../../../wizard/model';
import { MetadataFilter } from '../../domain/model';
import { SchemaService } from '../../../schema-form/service/schema.service';
import { UpdateFilterRequest } from '../action/collection.action';
import { CancelCreateFilter, UpdateFilterChanges } from '../action/filter.action';
import { PreviewEntity } from '../../domain/action/entity.action';
import { EntityAttributesFilterEntity } from '../../domain/entity';
import { shareReplay, map, withLatestFrom, filter, switchMap } from 'rxjs/operators';

@Component({
    selector: 'edit-filter-page',
    templateUrl: './edit-filter.component.html'
})
export class EditFilterComponent {

    valueChangeSubject = new Subject<Partial<any>>();
    private valueChangeEmitted$ = this.valueChangeSubject.asObservable();

    statusChangeSubject = new Subject<{ value: any[] }>();
    private statusChangeEmitted$ = this.statusChangeSubject.asObservable();

    definition$: Observable<FormDefinition<MetadataFilter>>;
    schema$: Observable<any>;

    model$: Observable<MetadataFilter>;
    isSaving$: Observable<boolean>;
    filter: MetadataFilter;
    isValid: boolean;

    validators$: Observable<{ [key: string]: any }>;

    actions: any;

    constructor(
        private store: Store<fromFilter.State>,
        private schemaService: SchemaService
    ) {
        this.definition$ = this.store.select(fromFilter.getFilterType).pipe(
            filter(t => !!t),
            map(t => MetadataFilterTypes[t])
        );
        this.schema$ = this.definition$.pipe(
            filter(d => !!d),
            switchMap(d => {
                return this.schemaService.get(d.schema);
            }),
            shareReplay()
        );
        this.isSaving$ = this.store.select(fromFilter.getCollectionSaving);
        this.model$ = this.store.select(fromFilter.getSelectedFilter);

        this.valueChangeEmitted$.subscribe(changes => this.store.dispatch(new UpdateFilterChanges(changes.value)));
        this.statusChangeEmitted$.subscribe(valid => {
            this.isValid = valid.value ? valid.value.length === 0 : true;
        });

        this.validators$ = this.store.select(fromFilter.getFilterNames).pipe(
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
                this.preview(parameters.id);
            }
        };

        this.definition$.subscribe(d => console.log(d));
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
            entity: new EntityAttributesFilterEntity(this.filter)
        }));
    }
}

