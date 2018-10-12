import { Component, OnDestroy } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { withLatestFrom, map, distinctUntilChanged, skipWhile } from 'rxjs/operators';
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

    constructor(
        private store: Store<fromResolver.ResolverState>,
    ) {
        this.schema$ = this.store.select(fromWizard.getSchema);
        this.definition$ = this.store.select(fromWizard.getWizardDefinition);
        this.changes$ = this.store.select(fromResolver.getEntityChanges);

        // this.schema$.subscribe(s => console.log(s));

        this.validators$ = this.definition$.pipe(
            map((def) => def.getValidators())
        );

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
            skipWhile(({ model, definition }) => !definition || !model),
            map(({ model, definition }) => definition.formatter(model))
        );

        this.valueChangeEmitted$.pipe(
            withLatestFrom(this.definition$),
            skipWhile(([ changes, definition ]) => !definition || !changes),
            map(([ changes, definition ]) => definition.parser(changes.value)),
            withLatestFrom(this.store.select(fromResolver.getSelectedDraft)),
            map(([changes, original]) => ({ ...original, ...changes }))
        )
        .subscribe(changes => {
            if (changes.resourceId) {
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

