import { Component, OnDestroy } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Store } from '@ngrx/store';

import * as fromProvider from '../reducer';
import * as fromWizard from '../../../wizard/reducer';
import { SetIndex, SetDisabled, ClearWizard, SetDefinition } from '../../../wizard/action/wizard.action';
import { ClearEditor } from '../action/editor.action';
import { LoadSchemaRequest } from '../../../wizard/action/wizard.action';
import { startWith, takeUntil } from 'rxjs/operators';
import { Wizard, WizardStep } from '../../../wizard/model';
import { MetadataProvider } from '../../domain/model';
import { ClearProvider } from '../action/entity.action';
import { AddProviderRequest } from '../action/collection.action';
import { MetadataProviderWizard } from '../model';
import { MetadataConfiguration } from '../../configuration/model/metadata-configuration';

@Component({
    selector: 'provider-wizard',
    templateUrl: './provider-wizard.component.html',
    styleUrls: []
})

export class ProviderWizardComponent implements OnDestroy {
    private ngUnsubscribe: Subject<void> = new Subject<void>();

    definition$: Observable<Wizard<MetadataProvider>>;
    changes$: Observable<MetadataProvider>;
    model$: Observable<any>;
    currentPage: string;
    valid$: Observable<boolean>;

    nextStep: WizardStep;
    previousStep: WizardStep;

    summary$: Observable<MetadataConfiguration> = this.store.select(fromProvider.getProviderConfiguration);

    provider: MetadataProvider;

    constructor(
        private store: Store<fromProvider.ProviderState>
    ) {
        this.store
            .select(fromWizard.getCurrentWizardSchema)
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe(s => {
                if (s) {
                    this.store.dispatch(new LoadSchemaRequest(s));
                }
            });
        this.valid$ = this.store.select(fromProvider.getEditorIsValid);
        this.changes$ = this.store.select(fromProvider.getEntityChanges);

        this.store.select(fromWizard.getNext).subscribe(n => this.nextStep = n);
        this.store.select(fromWizard.getPrevious).subscribe(p => this.previousStep = p);
        this.store.select(fromWizard.getWizardIndex).subscribe(i => this.currentPage = i);

        this.valid$
            .pipe(startWith(false), takeUntil(this.ngUnsubscribe))
            .subscribe((valid) => {
                this.store.dispatch(new SetDisabled(!valid));
            });

        this.changes$.pipe(takeUntil(this.ngUnsubscribe)).subscribe(c => this.provider = c);

        this.store.dispatch(new SetDefinition(MetadataProviderWizard));
        this.store.dispatch(new SetIndex(MetadataProviderWizard.steps[0].id));
    }

    ngOnDestroy() {
        this.store.dispatch(new ClearProvider());
        this.store.dispatch(new ClearWizard());
        this.store.dispatch(new ClearEditor());

        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }

    next(): void {
        this.store.dispatch(new SetIndex(this.nextStep.id));
    }

    previous(): void {
        this.store.dispatch(new SetIndex(this.previousStep.id));
    }

    save(): void {
        this.store.dispatch(new SetDisabled(true));
        this.store.dispatch(new AddProviderRequest(this.provider));
    }

    gotoPage(page: string): void {
        this.store.dispatch(new SetIndex(page));
    }
}

