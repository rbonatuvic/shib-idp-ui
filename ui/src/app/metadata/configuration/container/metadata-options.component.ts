import { Store } from '@ngrx/store';
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs';

import * as fromConfiguration from '../reducer';
import { MetadataConfiguration } from '../model/metadata-configuration';

@Component({
    selector: 'metadata-options-page',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './metadata-options.component.html',
    styleUrls: []
})
export class MetadataOptionsComponent {

    configuration$: Observable<MetadataConfiguration>;

    constructor(
        private store: Store<fromConfiguration.ConfigurationState>
    ) {
        this.configuration$ = this.store.select(fromConfiguration.getConfigurationSections);
    }
}
