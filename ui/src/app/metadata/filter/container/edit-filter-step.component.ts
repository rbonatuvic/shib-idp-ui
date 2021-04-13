import { ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subject, Observable, Subscription } from 'rxjs';

import * as fromFilter from '../reducer';
import { FormDefinition, WizardStep } from '../../../wizard/model';
import { MetadataFilter } from '../../domain/model';
import { SchemaService } from '../../../schema-form/service/schema.service';
import { UpdateFilterChanges } from '../action/filter.action';
import { PreviewEntity } from '../../domain/action/entity.action';
import { map, withLatestFrom, filter, takeUntil, distinctUntilChanged, skip } from 'rxjs/operators';
import * as fromWizard from '../../../wizard/reducer';
import { LockEditor, UnlockEditor } from '../../../wizard/action/wizard.action';
import { UpdateStatus } from '../action/editor.action';

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
    bindings$: Observable<any>;

    model$: Observable<MetadataFilter>;
    isSaving$: Observable<boolean>;
    filter: MetadataFilter;
    isValid: boolean;
    type$: Observable<string>;

    validators$: Observable<{ [key: string]: any }>;
    status$: Observable<any>;
    step$: Observable<WizardStep>;

    actions: any;

    defSub: Subscription;
    currentPage: string;

    constructor(
        private store: Store<fromFilter.State>,
        private ref: ChangeDetectorRef
    ) {
        this.definition$ = this.store.select(fromWizard.getWizardDefinition).pipe(filter(d => !!d));

        this.defSub = this.definition$.subscribe(d => this.definition = d);

        this.schema$ = this.store.select(fromWizard.getSchema);
        this.bindings$ = this.definition$.pipe(map(d => d.bindings));

        this.step$ = this.store.select(fromWizard.getCurrent);

        this.step$.subscribe(s => {
            if (s && s.locked) {
                this.store.dispatch(new LockEditor());
            } else {
                this.store.dispatch(new UnlockEditor());
            }
        });

        this.isSaving$ = this.store.select(fromFilter.getCollectionSaving);
        this.model$ = this.store.select(fromFilter.getSelectedFilter);
        this.type$ = this.model$.pipe(map(f => f && f.hasOwnProperty('@type') ? f['@type'] : ''));

        this.valueChangeEmitted$.pipe(takeUntil(this.ngUnsubscribe)).subscribe(changes => this.store.dispatch(new UpdateFilterChanges(changes.value)));

        this.statusChangeEmitted$
            .pipe(
                skip(1),
                takeUntil(this.ngUnsubscribe),
                withLatestFrom(this.model$),
                distinctUntilChanged()
            )
            .subscribe(([errors, model]) => {
                this.updateStatus(errors);
            });

        this.status$ = this.store.select(fromFilter.getInvalidEditorForms);

        this.status$.pipe(takeUntil(this.ngUnsubscribe)).subscribe(() => {
            this.ref.detach();
            setTimeout(() => {
                this.ref.detectChanges();
                this.ref.reattach();
            }, 250);
        })

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
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe(filter => this.filter = filter);

        this.actions = {
            preview: (property: any, parameters: any) => {
                this.preview(parameters.filterId);
            }
        };

        this.store.select(fromWizard.getWizardIndex).pipe(takeUntil(this.ngUnsubscribe)).subscribe(i => this.currentPage = i);
    }

    updateStatus(errors: any): void {
        const status = { [this.currentPage]: !(errors.value) ? 'VALID' : 'INVALID' };
        this.store.dispatch(new UpdateStatus(status));
    }

    ngOnDestroy(): void {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
        this.defSub.unsubscribe();
    }

    preview(id: string): void {
        this.store.dispatch(new PreviewEntity({
            id,
            entity: this.definition.getEntity(this.filter)
        }));
    }
}

