import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subject, Observable, of } from 'rxjs';

import * as fromFilter from '../reducer';
import { MetadataFilterTypes, EntityAttributesFilter } from '../model';
import { FormDefinition } from '../../../wizard/model';
import { MetadataFilter, MetadataEntity } from '../../domain/model';
import { SchemaService } from '../../../schema-form/service/schema.service';
import { UpdateFilterRequest } from '../action/collection.action';
import { CancelCreateFilter, UpdateFilterChanges } from '../action/filter.action';
import { PreviewEntity } from '../../domain/action/entity.action';
import { EntityAttributesFilterEntity } from '../../domain/entity';

@Component({
    selector: 'edit-filter-page',
    templateUrl: './edit-filter.component.html'
})
export class EditFilterComponent {

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

    constructor(
        private store: Store<fromFilter.State>,
        private schemaService: SchemaService
    ) {
        this.definition = MetadataFilterTypes.EntityAttributesFilter;

        this.schema$ = this.schemaService.get(this.definition.schema);
        this.isSaving$ = this.store.select(fromFilter.getCollectionSaving);
        this.model$ = this.store.select(fromFilter.getSelectedFilter);

        this.valueChangeEmitted$.subscribe(changes => this.store.dispatch(new UpdateFilterChanges(changes.value)));
        this.statusChangeEmitted$.subscribe(valid => {
            this.isValid = valid.value ? valid.value.length === 0 : true;
        });

        this.store
            .select(fromFilter.getFilter)
            .subscribe(filter => this.filter = filter);
    }

    save(): void {
        this.store.dispatch(new UpdateFilterRequest(this.filter));
    }

    cancel(): void {
        this.store.dispatch(new CancelCreateFilter());
    }

    preview(entity: MetadataFilter): void {
        this.store.dispatch(new PreviewEntity(new EntityAttributesFilterEntity(entity)));
    }
}

