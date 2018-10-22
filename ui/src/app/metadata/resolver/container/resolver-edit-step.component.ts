import { Component, OnDestroy } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Store } from '@ngrx/store';

import * as fromResolver from '../reducer';
import { UpdateStatus } from '../action/entity.action';
import { Wizard, WizardStep } from '../../../wizard/model';
import { MetadataResolver } from '../../domain/model';
import { LockEditor, UnlockEditor } from '../../../wizard/action/wizard.action';

import * as fromWizard from '../../../wizard/reducer';
import { withLatestFrom, map, distinctUntilChanged, filter } from 'rxjs/operators';
import { UpdateChanges } from '../action/entity.action';
import { FormControl } from '@angular/forms';

@Component({
    selector: 'resolver-edit-step',
    templateUrl: './resolver-edit-step.component.html',
    styleUrls: []
})
export class ResolverEditStepComponent implements OnDestroy {
    private ngUnsubscribe: Subject<void> = new Subject<void>();

    valueChangeSubject = new Subject<Partial<any>>();
    private valueChangeEmitted$ = this.valueChangeSubject.asObservable();

    statusChangeSubject = new Subject<Partial<any>>();
    private statusChangeEmitted$ = this.statusChangeSubject.asObservable();

    currentPage: string;

    namesList: string[] = [];

    schema$: Observable<any>;
    resolver$: Observable<MetadataResolver>;
    model$: Observable<any>;
    definition$: Observable<Wizard<MetadataResolver>>;
    changes$: Observable<MetadataResolver>;
    step$: Observable<WizardStep>;
    bindings$: Observable<any>;

    validators$: Observable<{ [key: string]: any }>;

    lock: FormControl = new FormControl(true);

    constructor(
        private store: Store<fromResolver.ResolverState>
    ) {
        this.definition$ = this.store.select(fromWizard.getWizardDefinition);
        this.changes$ = this.store.select(fromResolver.getEntityChanges);
        this.resolver$ = this.store.select(fromResolver.getSelectedResolver);
        this.step$ = this.store.select(fromWizard.getCurrent);
        this.schema$ = this.store.select(fromWizard.getSchema);
        this.bindings$ = this.definition$.pipe(filter(d => !!d), map(d => d.bindings));

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
                this.store.select(fromResolver.getAllEntityIds),
                this.resolver$
            ),
            filter(([def, ids, resolver]) => !!def),
            map(([def, ids, resolver]) => def.getValidators(
                ids.filter(id => id !== resolver.entityId)
            ))
        );

        this.model$ = this.schema$.pipe(
            withLatestFrom(
                this.store.select(fromResolver.getSelectedResolver),
                this.store.select(fromWizard.getModel),
                this.changes$,
                this.definition$
            ),
            map(([schema, resolver, model, changes, definition]) => ({
                model: {
                    ...model,
                    ...resolver,
                    ...changes
                },
                definition
            })),
            filter(({ model, definition }) => definition && model),
            map(({ model, definition }) => definition.formatter(model))
        );

        this.valueChangeEmitted$.pipe(
            map(changes => changes.value),
            withLatestFrom(this.definition$, this.store.select(fromResolver.getSelectedResolver)),
            filter(([changes, definition]) => definition && changes),
            map(([changes, definition, resolver]) => definition.parser({ ...resolver, ...changes }))
        )
        .subscribe(changes => this.store.dispatch(new UpdateChanges(changes)));

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

