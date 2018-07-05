import { Component, OnDestroy } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { withLatestFrom, map, distinctUntilChanged } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import * as fromProvider from '../reducer';
import * as fromWizard from '../../../wizard/reducer';

import { SetDefinition } from '../../../wizard/action/wizard.action';
import { UpdateStatus } from '../action/editor.action';
import { Wizard } from '../../../wizard/model';
import { MetadataProvider } from '../../domain/model';
import { MetadataProviderTypes, MetadataProviderWizard } from '../model';
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

    validators = {
        '/': (value, property, form_current) => {
            let errors;
            // iterate all customer
            Object.keys(value).forEach((key) => {
                const item = value[key];
                const validatorKey = `/${key}`;
                const validator = this.validators.hasOwnProperty(validatorKey) ? this.validators[validatorKey] : null;
                const error = validator ? validator(item, { path: `/${key}` }, form_current) : null;
                if (error) {
                    errors = errors || [];
                    errors.push(error);
                }
            });
            return errors;
        },
        '/name': (value, property, form) => {
            const err = this.namesList.indexOf(value) > -1 ? {
                code: 'INVALID_NAME',
                path: `#${property.path}`,
                message: 'Name must be unique.',
                params: [value]
            } : null;
            return err;
        }
    };

    constructor(
        private store: Store<fromProvider.ProviderState>,
    ) {
        this.schema$ = this.store.select(fromProvider.getSchema);
        this.definition$ = this.store.select(fromWizard.getWizardDefinition);
        this.changes$ = this.store.select(fromProvider.getEntityChanges);

        this.store.select(fromProvider.getProviderNames).subscribe(list => this.namesList = list);

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
            map(({ model, definition }) => definition && definition.translate ? definition.translate.formatter(model) : model)
        );

        this.valueChangeEmitted$.pipe(
            withLatestFrom(this.schema$, this.definition$),
            map(([changes, schema, definition]) => {
                const type = changes.value['@type'];
                if (type && type !== definition.type) {
                    const newDefinition = MetadataProviderTypes.find(def => def.type === type);
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
            }),
            map(({ changes, definition }) => definition.translate ? definition.translate.parser(changes) : changes)
        )
        .subscribe(changes => this.store.dispatch(new UpdateProvider(changes)));

        this.statusChangeEmitted$.pipe(
            distinctUntilChanged()
        ).subscribe(errors => {
            console.log(!(errors.value));
            const status = { [this.currentPage]: !(errors.value) ? 'VALID' : 'INVALID' };
            this.store.dispatch(new UpdateStatus(status));
        });

        this.store.select(fromWizard.getWizardIndex).subscribe(i => this.currentPage = i);
    }

    ngOnDestroy() {
        this.valueChangeSubject.complete();
    }
}

