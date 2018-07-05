import { Component, OnDestroy } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { withLatestFrom, map } from 'rxjs/operators';
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
    changeSubject = new Subject<Partial<any>>();
    private changeEmitted$ = this.changeSubject.asObservable();

    schema$: Observable<any>;
    schema: any;
    definition$: Observable<Wizard<MetadataProvider>>;
    changes$: Observable<MetadataProvider>;
    currentPage: string;
    valid$: Observable<boolean>;
    model$: Observable<any>;

    constructor(
        private store: Store<fromProvider.ProviderState>
    ) {
        this.schema$ = this.store.select(fromProvider.getSchema);
        this.definition$ = this.store.select(fromWizard.getWizardDefinition);
        this.changes$ = this.store.select(fromProvider.getEntityChanges);

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
            map(({ model, definition }) => definition.translate ? definition.translate.formatter(model) : model)
        );

        this.changeEmitted$.pipe(
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
    }

    ngOnDestroy() {
        this.changeSubject.complete();
    }

    onStatusChange(value): void {
        const status = { [this.currentPage]: value ? 'VALID' : 'INVALID' };
        this.store.dispatch(new UpdateStatus(status));
    }
}

