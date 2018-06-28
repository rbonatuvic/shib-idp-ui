import { Component } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Store } from '@ngrx/store';
import { ActivatedRoute } from '@angular/router';


import { MetadataProviderTypes } from '../model';
import * as fromProvider from '../reducer';
import { SetDefinition, SetIndex } from '../../../wizard/action/wizard.action';

import { MetadataProviderWizard } from '../model';

@Component({
    selector: 'new-provider-page',
    templateUrl: './new-provider.component.html',
    styleUrls: ['./new-provider.component.scss']
})
export class NewProviderComponent {
    types = MetadataProviderTypes;

    constructor(
        private fb: FormBuilder,
        private store: Store<fromProvider.ProviderState>
    ) {
        this.store.dispatch(new SetDefinition(MetadataProviderWizard));
        this.store.dispatch(new SetIndex(MetadataProviderWizard.steps[0].id));
    }
}
