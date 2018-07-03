import { Component, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';

import * as fromProvider from '../reducer';
import * as fromWizard from '../../../wizard/reducer';

import { SetIndex, SetDisabled } from '../../../wizard/action/wizard.action';
import { LoadSchemaRequest } from '../action/editor.action';
import { startWith } from 'rxjs/operators';
import { Wizard, WizardStep } from '../../../wizard/model';
import { MetadataProvider } from '../../domain/model';

@Component({
    selector: 'provider-wizard',
    templateUrl: './provider-wizard.component.html',
    styleUrls: []
})

export class ProviderWizardComponent {
    schema$: Observable<any>;
    schema: any;
    definition$: Observable<Wizard<MetadataProvider>>;
    changes$: Observable<MetadataProvider>;
    currentPage: string;
    valid$: Observable<boolean>;

    formModel: any;

    nextStep: WizardStep;
    previousStep: WizardStep;

    constructor(
        private store: Store<fromProvider.ProviderState>
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

        this.valid$
            .pipe(startWith(false))
            .subscribe((valid) => {
                this.store.dispatch(new SetDisabled(!valid));
            });
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
        console.log('Save!');
    }
}

