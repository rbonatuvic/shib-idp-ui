import { Store } from '@ngrx/store';
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs';

import {
    ConfigurationState,
    getConfigurationSections,
    getConfigurationModel,
    getSelectedVersion,
    getSelectedVersionNumber,
    getSelectedIsCurrent,
    getConfigurationModelEnabled
} from '../reducer';
import { MetadataConfiguration } from '../model/metadata-configuration';
import { MetadataVersion } from '../model/version';
import { map } from 'rxjs/operators';
import { Metadata } from '../../domain/domain.type';

@Component({
    selector: 'metadata-options-page',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './metadata-options.component.html',
    styleUrls: []
})
export class MetadataOptionsComponent {

    configuration$: Observable<MetadataConfiguration>;
    isEnabled$: Observable<boolean>;
    version$: Observable<MetadataVersion>;
    versionNumber$: Observable<number>;
    isCurrent$: Observable<boolean>;

    constructor(
        private store: Store<ConfigurationState>
    ) {
        this.configuration$ = this.store.select(getConfigurationSections);
        this.isEnabled$ = this.store.select(getConfigurationModelEnabled);
        this.version$ = this.store.select(getSelectedVersion);
        this.versionNumber$ = this.store.select(getSelectedVersionNumber);
        this.isCurrent$ = this.store.select(getSelectedIsCurrent);
    }
}
