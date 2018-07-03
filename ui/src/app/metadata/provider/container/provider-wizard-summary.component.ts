import { Component } from '@angular/core';
import { Store } from '@ngrx/store';

import * as fromProvider from '../reducer';

@Component({
    selector: 'provider-wizard-summary',
    templateUrl: './provider-wizard-summary.component.html',
    styleUrls: []
})

export class ProviderWizardSummaryComponent {
    constructor(
        private store: Store<fromProvider.ProviderState>
    ) {}

    save(): void {
        console.log('Save!');
    }
}

