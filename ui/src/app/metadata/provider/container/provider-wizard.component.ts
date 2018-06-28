
import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, Observable } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import * as fromProvider from '../reducer';
import * as fromWizard from '../../../wizard/reducer';

import { SetIndex, SetDisabled, UpdateDefinition, WizardActionTypes, Next } from '../../../wizard/action/wizard.action';
import { LoadSchemaRequest, UpdateStatus } from '../action/editor.action';
import { startWith } from 'rxjs/operators';
import { Wizard, WizardStep } from '../../../wizard/model';
import { MetadataProvider } from '../../domain/model';
import { MetadataProviderTypes } from '../model';
import { UpdateProvider } from '../action/entity.action';

@Component({
    selector: 'provider-wizard-page',
    templateUrl: './provider-wizard.component.html',
    styleUrls: ['./provider-wizard.component.scss']
})

export class ProviderWizardComponent implements OnDestroy {
    actionsSubscription: Subscription;

    schema$: Observable<any>;
    definition$: Observable<Wizard<MetadataProvider>>;
    changes$: Observable<MetadataProvider>;
    currentPage: string;
    valid$: Observable<boolean>;

    formModel: any;

    nextStep: WizardStep;
    previousStep: WizardStep;

    constructor(
        private store: Store<fromProvider.ProviderState>,
        private route: ActivatedRoute,
        private router: Router
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
        this.store.select(fromWizard.getNext).subscribe(n => this.nextStep = n);
        this.store.select(fromWizard.getPrevious).subscribe(p => this.previousStep = p);

        this.valid$
            .pipe(startWith(false))
            .subscribe((valid) => {
                this.store.dispatch(new SetDisabled(!valid));
            });
    }

    ngOnDestroy() {
        this.actionsSubscription.unsubscribe();
    }

    next(): void {
        this.store.dispatch(new SetIndex(this.nextStep.id));
    }

    previous(): void {
        this.store.dispatch(new SetIndex(this.previousStep.id));
    }

    save(): void {
        console.log('Save!');
    }

    onValueChange(changes: any): void {
        const type = changes.value['@type'];
        if (type) {
            this.store.dispatch(new UpdateDefinition(MetadataProviderTypes.find(def => def.type === type)));
        }
        this.store.dispatch(new UpdateProvider(changes.value));
    }

    onStatusChange(value): void {
        const status = { [this.currentPage]: value ? 'VALID' : 'INVALID' };
        this.store.dispatch(new UpdateStatus(status));
    }
}

