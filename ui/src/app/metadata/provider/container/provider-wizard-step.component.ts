import { Component, OnDestroy } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { withLatestFrom } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import * as fromProvider from '../reducer';
import * as fromWizard from '../../../wizard/reducer';

import { SetDisabled, SetDefinition } from '../../../wizard/action/wizard.action';
import { LoadSchemaRequest, UpdateStatus } from '../action/editor.action';
import { startWith } from 'rxjs/operators';
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

    constructor(
        private store: Store<fromProvider.ProviderState>
    ) {
        this.store
            .select(fromWizard.getCurrentWizardSchema)
            .subscribe(s => {
                this.store.dispatch(new LoadSchemaRequest(s));
            });

        this.schema$ = this.store.select(fromProvider.getSchema);
        this.valid$ = this.store.select(fromProvider.getEditorIsValid);
        this.definition$ = this.store.select(fromWizard.getWizardDefinition);
        this.changes$ = this.store.select(fromProvider.getEntityChanges);

        this.valid$
            .pipe(startWith(false))
            .subscribe((valid) => {
                this.store.dispatch(new SetDisabled(!valid));
            });

        this.schema$.subscribe(s => this.schema = s);

        this.changeEmitted$
            .pipe(
                withLatestFrom(this.schema$, this.definition$),
            )
            .subscribe(
                ([changes, schema, definition]) => {
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
                    this.store.dispatch(new UpdateProvider(changes.value));
                }
            );
    }

    ngOnDestroy() {
        this.changeSubject.complete();
    }

    onStatusChange(value): void {
        const status = { [this.currentPage]: value ? 'VALID' : 'INVALID' };
        this.store.dispatch(new UpdateStatus(status));
    }
}

