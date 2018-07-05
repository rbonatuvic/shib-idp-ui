import { Component, OnDestroy } from '@angular/core';
import { Observable, combineLatest } from 'rxjs';
import { Store } from '@ngrx/store';

import * as fromProvider from '../reducer';
import * as fromWizard from '../../../wizard/reducer';
import { SetIndex, SetDisabled, ClearWizard } from '../../../wizard/action/wizard.action';
import { LoadSchemaRequest, ClearEditor } from '../action/editor.action';
import { startWith } from 'rxjs/operators';
import { Wizard, WizardStep } from '../../../wizard/model';
import { MetadataProvider } from '../../domain/model';
import { ClearProvider } from '../action/entity.action';
import { Router, ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';
import { AddProviderRequest } from '../action/collection.action';


@Component({
    selector: 'provider-wizard',
    templateUrl: './provider-wizard.component.html',
    styleUrls: []
})

export class ProviderWizardComponent implements OnDestroy {
    definition$: Observable<Wizard<MetadataProvider>>;
    changes$: Observable<MetadataProvider>;
    model$: Observable<any>;
    currentPage: string;
    valid$: Observable<boolean>;

    nextStep: WizardStep;
    previousStep: WizardStep;

    summary$: Observable<{ definition: Wizard<MetadataProvider>, schema: { [id: string]: any }, model: any }>;

    provider: MetadataProvider;

    namesList: string[] = [];

    validators = {
        '/name': (value, property, form) => {
            return this.namesList.indexOf(value) > -1 ? { 'name': { 'expectedValue': 'unique' } } : null;
        }
    };

    constructor(
        private store: Store<fromProvider.ProviderState>,
        private router: Router,
        private route: ActivatedRoute
    ) {
        this.store
            .select(fromWizard.getCurrentWizardSchema)
            .subscribe(s => {
                this.store.dispatch(new LoadSchemaRequest(s));
            });
        this.valid$ = this.store.select(fromProvider.getEditorIsValid);
        this.changes$ = this.store.select(fromProvider.getEntityChanges);

        this.store.select(fromWizard.getNext).subscribe(n => this.nextStep = n);
        this.store.select(fromWizard.getPrevious).subscribe(p => this.previousStep = p);
        this.store.select(fromWizard.getWizardIndex).subscribe(i => this.currentPage = i);

        this.valid$
            .pipe(startWith(false))
            .subscribe((valid) => {
                this.store.dispatch(new SetDisabled(!valid));
            });

        this.summary$ = combineLatest(
            this.store.select(fromWizard.getWizardDefinition),
            this.store.select(fromWizard.getSchemaCollection),
            this.store.select(fromProvider.getEntityChanges)
        ).pipe(
            map(([ definition, schema, model ]) => ({ definition, schema, model }))
        );

        this.changes$.subscribe(c => this.provider = c);

        this.store.select(fromProvider.getProviderNames).subscribe(list => this.namesList = list);
    }

    ngOnDestroy() {
        this.store.dispatch(new ClearProvider());
        this.store.dispatch(new ClearWizard());
        this.store.dispatch(new ClearEditor());
    }

    next(): void {
        if (this.nextStep) {
            this.store.dispatch(new SetIndex(this.nextStep.id));
        }
    }

    previous(): void {
        this.store.dispatch(new SetIndex(this.previousStep.id));
    }

    save(): void {
        this.store.dispatch(new AddProviderRequest(this.provider));
    }

    gotoPage(page: string): void {
        this.store.dispatch(new SetIndex(page));
    }
}

