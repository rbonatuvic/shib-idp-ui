import { Component, OnDestroy } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { withLatestFrom, map, distinctUntilChanged, skipWhile, filter } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import * as fromResolver from '../reducer';
import * as fromWizard from '../../../wizard/reducer';

import { UpdateStatus, UpdateChanges } from '../action/entity.action';
import { Wizard } from '../../../wizard/model';
import { MetadataResolver } from '../../domain/model';

@Component({
    selector: 'resolver-wizard-step',
    templateUrl: './resolver-wizard-step.component.html',
    styleUrls: []
})

export class ResolverWizardStepComponent implements OnDestroy {
    valueChangeSubject = new Subject<Partial<any>>();
    private valueChangeEmitted$ = this.valueChangeSubject.asObservable();

    statusChangeSubject = new Subject<Partial<any>>();
    private statusChangeEmitted$ = this.statusChangeSubject.asObservable();

    schema$: Observable<any>;
    schema: any;
    definition$: Observable<Wizard<MetadataResolver>>;
    changes$: Observable<MetadataResolver>;
    currentPage: string;
    valid$: Observable<boolean>;
    model$: Observable<any>;

    namesList: string[] = [];

    validators$: Observable<{ [key: string]: any }>;

    bindings$: Observable<any>;

    constructor(
        private store: Store<fromResolver.ResolverState>,
    ) {
        this.schema$ = this.store.select(fromWizard.getSchema);
        this.definition$ = this.store.select(fromWizard.getWizardDefinition);
        this.changes$ = this.store.select(fromResolver.getEntityChanges);
        this.bindings$ = this.definition$.pipe(map(d => d.bindings));

        this.model$ = this.schema$.pipe(
            withLatestFrom(
                this.store.select(fromWizard.getModel),
                this.store.select(fromResolver.getSelectedDraft),
                this.changes$,
                this.definition$
            ),
            map(([schema, model, selected, changes, definition]) => ({
                model: {
                    ...model,
                    ...selected,
                    ...changes
                },
                definition
            })),
            filter(({ model, definition }) => (definition && model)),
            map(({ model, definition }) => definition.formatter(model))
        );

        this.validators$ = this.definition$.pipe(
            withLatestFrom(
                this.store.select(fromResolver.getAllEntityIds),
                this.model$
            ),
            map(([def, ids, resolver]) => def.getValidators(
                ids.filter(id => id !== resolver.entityId)
            ))
        );

        this.valueChangeEmitted$.pipe(
            withLatestFrom(this.definition$),
            filter(([ changes, definition ]) => (!!definition && !!changes)),
            map(([ changes, definition ]) => definition.parser(changes.value)),
            withLatestFrom(this.store.select(fromResolver.getSelectedDraft)),
            map(([changes, original]) => ({ ...original, ...changes }))
        )
        .subscribe(changes => {
            if (changes.id) {
                this.store.dispatch(new UpdateChanges(changes));
            }
        });

        this.statusChangeEmitted$.pipe(distinctUntilChanged()).subscribe(errors => this.updateStatus(errors));

        this.store.select(fromWizard.getWizardIndex).subscribe(i => this.currentPage = i);
    }

    updateStatus(errors: any): void {
        const status = { [this.currentPage]: !(errors.value) ? 'VALID' : 'INVALID' };
        this.store.dispatch(new UpdateStatus(status));
    }

    ngOnDestroy() {
        this.valueChangeSubject.complete();
    }
}

