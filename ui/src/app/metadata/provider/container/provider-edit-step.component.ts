import { Component, OnDestroy } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Store } from '@ngrx/store';
import { FormControl } from '@angular/forms';

import * as fromProvider from '../reducer';
import { UpdateStatus } from '../action/editor.action';
import { Wizard, WizardStep } from '../../../wizard/model';
import { MetadataProvider } from '../../domain/model';
import { LockEditor, UnlockEditor } from '../../../wizard/action/wizard.action';

import * as fromWizard from '../../../wizard/reducer';
import { withLatestFrom, map, distinctUntilChanged, filter } from 'rxjs/operators';
import { UpdateProvider } from '../action/entity.action';

@Component({
    selector: 'provider-edit-step',
    templateUrl: './provider-edit-step.component.html',
    styleUrls: []
})
export class ProviderEditStepComponent implements OnDestroy {
    private ngUnsubscribe: Subject<void> = new Subject<void>();

    valueChangeSubject = new Subject<Partial<any>>();
    private valueChangeEmitted$ = this.valueChangeSubject.asObservable();

    statusChangeSubject = new Subject<Partial<any>>();
    private statusChangeEmitted$ = this.statusChangeSubject.asObservable();

    currentPage: string;

    namesList: string[] = [];

    schema$: Observable<any>;
    provider$: Observable<MetadataProvider>;
    model$: Observable<any>;
    definition$: Observable<Wizard<MetadataProvider>>;
    changes$: Observable<MetadataProvider>;
    step$: Observable<WizardStep>;
    bindings$: Observable<any>;

    validators$: Observable<{ [key: string]: any }>;

    lock: FormControl = new FormControl(true);

    constructor(
        private store: Store<fromProvider.ProviderState>
    ) {
        this.definition$ = this.store.select(fromWizard.getWizardDefinition);
        this.changes$ = this.store.select(fromProvider.getEntityChanges);
        this.provider$ = this.store.select(fromProvider.getSelectedProvider);
        this.step$ = this.store.select(fromWizard.getCurrent);
        this.schema$ = this.store.select(fromWizard.getSchema);
        this.bindings$ = this.definition$.pipe(map(d => d.bindings));

        this.step$.subscribe(s => {
            if (s && s.locked) {
                this.store.dispatch(new LockEditor());
            } else {
                this.store.dispatch(new UnlockEditor());
            }
        });

        this.lock.valueChanges.subscribe(locked => this.store.dispatch(locked ? new LockEditor() : new UnlockEditor()));

        this.validators$ = this.definition$.pipe(
            withLatestFrom(
                this.store.select(fromProvider.getProviderNames),
                this.store.select(fromProvider.getProviderXmlIds),
                this.provider$
            ),
            filter(([def, names, ids, provider]) => !def),
            map(([def, names, ids, provider]) => def ? def.getValidators(
                names.filter(n => n !== provider.name),
                ids.filter(id => id !== provider.xmlId)
            ) : {})
        );

        this.model$ = this.schema$.pipe(
            withLatestFrom(
                this.store.select(fromProvider.getSelectedProvider),
                this.store.select(fromWizard.getModel),
                this.changes$,
                this.definition$
            ),
            map(([schema, provider, model, changes, definition]) => {
                return ({
                    model: {
                        ...model,
                        ...provider,
                        ...changes
                    },
                    definition
                });
            }),
            filter(({ model, definition }) => definition && model),
            map(({ model, definition }) => {
                return definition ? definition.formatter(model) : {};
            })
        );

        this.valueChangeEmitted$.pipe(
            map(changes => changes.value),
            withLatestFrom(this.definition$, this.store.select(fromProvider.getSelectedProvider)),
            filter(([ changes, definition, provider ]) => definition && changes && provider),
            map(([ changes, definition, provider ]) => {
                const parsed = definition.parser(changes);
                return ({
                    ...parsed,
                    metadataFilters: [
                        ...provider.metadataFilters,
                        ...(parsed.metadataFilters || [])
                    ]
                });
            })
        )
        .subscribe(changes => this.store.dispatch(new UpdateProvider(changes)));

        this.statusChangeEmitted$
            .pipe(distinctUntilChanged())
            .subscribe(errors => {
                this.updateStatus(errors);
            });

        this.store.select(fromWizard.getWizardIndex).subscribe(i => this.currentPage = i);
    }

    updateStatus(errors: any): void {
        const status = { [this.currentPage]: !(errors.value) ? 'VALID' : 'INVALID' };
        this.store.dispatch(new UpdateStatus(status));
    }

    ngOnDestroy() {
        this.valueChangeSubject.complete();
        this.statusChangeSubject.complete();
        this.ngUnsubscribe.unsubscribe();
    }
}

