import { Component, OnDestroy } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { withLatestFrom, map, distinctUntilChanged, skipWhile } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import * as fromProvider from '../reducer';
import * as fromWizard from '../../../wizard/reducer';

import { SetDefinition } from '../../../wizard/action/wizard.action';
import { UpdateStatus } from '../action/editor.action';
import { Wizard } from '../../../wizard/model';
import { MetadataProvider } from '../../domain/model';
import { MetadataProviderWizardTypes, MetadataProviderWizard } from '../model';
import { UpdateProvider } from '../action/entity.action';
import { pick } from '../../../shared/util';

@Component({
    selector: 'provider-wizard-step',
    templateUrl: './provider-wizard-step.component.html',
    styleUrls: []
})

export class ProviderWizardStepComponent implements OnDestroy {
    valueChangeSubject = new Subject<Partial<any>>();
    private valueChangeEmitted$ = this.valueChangeSubject.asObservable();

    statusChangeSubject = new Subject<Partial<any>>();
    private statusChangeEmitted$ = this.statusChangeSubject.asObservable();

    schema$: Observable<any>;
    schema: any;
    definition$: Observable<Wizard<MetadataProvider>>;
    changes$: Observable<MetadataProvider>;
    currentPage: string;
    valid$: Observable<boolean>;
    model$: Observable<any>;

    namesList: string[] = [];

    validators$: Observable<{ [key: string]: any }>;

    constructor(
        private store: Store<fromProvider.ProviderState>,
    ) {
        this.schema$ = this.store.select(fromProvider.getSchema);
        this.definition$ = this.store.select(fromWizard.getWizardDefinition);
        this.changes$ = this.store.select(fromProvider.getEntityChanges);

        this.validators$ = this.definition$.pipe(
            withLatestFrom(
                this.store.select(fromProvider.getProviderNames),
                this.store.select(fromProvider.getProviderXmlIds),
            ),
            map(([def, names, ids]) => def.getValidators(
                names,
                ids
            ))
        );

        this.model$ = this.schema$.pipe(
            withLatestFrom(
                this.store.select(fromWizard.getModel),
                this.changes$,
                this.definition$
            ),
            map(([schema, model, changes, definition]) => ({
                model: {
                    ...model,
                    ...changes
                },
                definition
            })),
            skipWhile(({ model, definition }) => !definition || !model),
            map(({ model, definition }) => definition.translate.formatter(model))
        );

        this.valueChangeEmitted$.pipe(
            withLatestFrom(this.schema$, this.definition$),
            map(([changes, schema, definition]) => this.resetSelectedType(changes, schema, definition)),
            skipWhile(({ changes, definition }) => !definition || !changes),
            map(({ changes, definition }) => definition.translate.parser(changes))
        )
        .subscribe(changes => this.store.dispatch(new UpdateProvider(changes)));

        this.statusChangeEmitted$.pipe(distinctUntilChanged()).subscribe(errors => this.updateStatus(errors));

        this.store.select(fromWizard.getWizardIndex).subscribe(i => this.currentPage = i);
    }

    resetSelectedType(changes: any, schema: any, definition: any): { changes: any, definition: any } {
        const type = changes.value['@type'];
        if (type && type !== definition.type) {
            const newDefinition = MetadataProviderWizardTypes.find(def => def.type === type);
            if (newDefinition) {
                this.store.dispatch(new SetDefinition({
                    ...MetadataProviderWizard,
                    ...newDefinition,
                    steps: [
                        ...MetadataProviderWizard.steps,
                        ...newDefinition.steps
                    ]
                }));
                changes = { value: pick(Object.keys(schema.properties))(changes.value) };
            }
        }
        return { changes: changes.value, definition };
    }

    updateStatus(errors: any): void {
        const status = { [this.currentPage]: !(errors.value) ? 'VALID' : 'INVALID' };
        this.store.dispatch(new UpdateStatus(status));
    }

    ngOnDestroy() {
        this.valueChangeSubject.complete();
    }
}

