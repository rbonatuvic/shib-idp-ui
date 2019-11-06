import { Component, OnDestroy } from '@angular/core';
import { Observable, Subject, combineLatest } from 'rxjs';
import { withLatestFrom, map, distinctUntilChanged, skipWhile, filter } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import * as fromResolver from '../reducer';
import * as fromWizard from '../../../wizard/reducer';

import { UpdateStatus, UpdateChangesRequest } from '../action/entity.action';
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

        this.validators$ = combineLatest(
            this.definition$,
            this.store.select(fromResolver.getValidEntityIds),
            this.model$
        ).pipe(
            map(([def, ids, resolver]) => {
                return def.getValidators(
                    ids
                );
            })
        );

        this.valueChangeEmitted$.pipe(
            withLatestFrom(
                this.definition$,
                this.schema$,
                this.store.select(fromResolver.getSelectedDraft)
            ),
            filter(([ changes, definition ]) => (!!definition && !!changes)),
            map(([ changes, definition, schema, original ]) => {
                const parsed = definition.parser(changes.value, schema);
                return { ...original, ...parsed };
            })
        )
        .subscribe(changes => {
            this.store.dispatch(new UpdateChangesRequest(changes));
        });

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
    }
}

