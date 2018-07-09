import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromProvider from '../reducer';
import { SetDefinition, SetIndex } from '../../../wizard/action/wizard.action';

import { MetadataProviderWizard } from '../model';

@Component({
    selector: 'provider-page',
    templateUrl: './provider.component.html',
    styleUrls: []
})
export class ProviderComponent {
    constructor(
        private store: Store<fromProvider.ProviderState>
    ) {
        this.store.dispatch(new SetDefinition(MetadataProviderWizard));
        this.store.dispatch(new SetIndex(MetadataProviderWizard.steps[0].id));
    }
}
