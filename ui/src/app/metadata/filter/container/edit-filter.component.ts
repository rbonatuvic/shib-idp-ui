import { Component, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subject, Observable, Subscription } from 'rxjs';

import * as fromFilter from '../reducer';
import { FormDefinition } from '../../../wizard/model';
import { MetadataFilter } from '../../domain/model';
import { UpdateFilterRequest } from '../action/collection.action';
import { CancelCreateFilter } from '../action/filter.action';
import { PreviewEntity } from '../../domain/action/entity.action';
import { NAV_FORMATS } from '../../domain/component/editor-nav.component';
import { map, filter } from 'rxjs/operators';
import * as fromWizard from '../../../wizard/reducer';
import { ActivatedRoute } from '@angular/router';
import { LoadSchemaRequest, SetIndex } from '../../../wizard/action/wizard.action';

@Component({
    selector: 'edit-filter-page',
    templateUrl: './edit-filter.component.html'
})
export class EditFilterComponent implements OnDestroy {

    private ngUnsubscribe: Subject<void> = new Subject<void>();

    definition$: Observable<FormDefinition<MetadataFilter>>;
    definition: FormDefinition<MetadataFilter>;
    schema$: Observable<any>;

    model$: Observable<MetadataFilter>;
    isSaving$: Observable<boolean>;
    filter: MetadataFilter;
    isValid$: Observable<boolean>;
    isInvalid$: Observable<boolean>;
    type$: Observable<string>;

    status$: Observable<any>;

    actions: any;

    defSub: Subscription;

    formats = NAV_FORMATS;

    constructor(
        private store: Store<fromFilter.State>,
        private route: ActivatedRoute
    ) {

        this.definition$ = this.store.select(fromWizard.getWizardDefinition).pipe(filter(d => !!d))

        this.defSub = this.definition$.subscribe(d => this.definition = d);

        this.store
            .select(fromWizard.getCurrentWizardSchema)
            .pipe(filter(s => !!s))
            .subscribe(s => {
                if (s) {
                    this.store.dispatch(new LoadSchemaRequest(s));
                }
            });

        let startIndex$ = this.route.firstChild.params.pipe(map(p => p.form || 'filters'));
        startIndex$.subscribe(index => this.store.dispatch(new SetIndex(index)));
        

        this.isSaving$ = this.store.select(fromFilter.getCollectionSaving);
        this.model$ = this.store.select(fromFilter.getSelectedFilter);
        this.type$ = this.model$.pipe(map(f => f && f.hasOwnProperty('@type') ? f['@type'] : ''));

        this.status$ = this.store.select(fromFilter.getInvalidEditorForms);

        this.isValid$ = this.store.select(fromFilter.getEditorIsValid);
        this.isInvalid$ = this.isValid$.pipe(map(v => !v));

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

