import { Component, OnDestroy } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Store } from '@ngrx/store';

import * as fromProvider from '../reducer';
import { UpdateStatus } from '../action/editor.action';
import { Wizard } from '../../../wizard/model';
import { MetadataProvider } from '../../domain/model';

import * as fromWizard from '../../../wizard/reducer';
import { withLatestFrom, map, skipWhile, distinctUntilChanged } from 'rxjs/operators';
import { UpdateProvider } from '../action/entity.action';

@Component({
    selector: 'provider-edit-step',
    templateUrl: './provider-edit-step.component.html',
    styleUrls: []
})

export class ProviderEditStepComponent implements OnDestroy {
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

    validators$: Observable<{ [key: string]: any }>;

    constructor(
        private store: Store<fromProvider.ProviderState>
    ) {
        this.schema$ = this.store.select(fromProvider.getSchema);
        this.definition$ = this.store.select(fromWizard.getWizardDefinition);
        this.changes$ = this.store.select(fromProvider.getEntityChanges);
        this.provider$ = this.store.select(fromProvider.getSelectedProvider);

        this.validators$ = this.store.select(fromProvider.getProviderNames).pipe(
            withLatestFrom(this.definition$, this.provider$),
            map(([names, def, provider]) => def.getValidators(names.filter(n => n !== provider.name)))
        );

        this.model$ = this.schema$.pipe(
            withLatestFrom(
                this.store.select(fromProvider.getSelectedProvider),
                this.store.select(fromWizard.getModel),
                this.changes$,
                this.definition$
            ),
            map(([schema, provider, model, changes, definition]) => ({
                model: {
                    ...model,
                    ...provider,
                    ...changes
                },
                definition
            })),
            skipWhile(({ model, definition }) => !definition || !model),
            map(({ model, definition }) => definition.translate.formatter(model))
        );

        this.valueChangeEmitted$.pipe(
            map(changes => changes.value),
            withLatestFrom(this.definition$),
            skipWhile(([ changes, definition ]) => !definition || !changes),
            map(([ changes, definition ]) => definition.translate.parser(changes))
        )
        .subscribe(changes => this.store.dispatch(new UpdateProvider(changes)));

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

