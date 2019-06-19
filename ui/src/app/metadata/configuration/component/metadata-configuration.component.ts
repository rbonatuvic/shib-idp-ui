import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { MetadataConfiguration } from '../model/metadata-configuration';

@Component({
    selector: 'metadata-configuration',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './metadata-configuration.component.html',
    styleUrls: []
})
export class MetadataConfigurationComponent {
    @Input() configuration: MetadataConfiguration;

    constructor() { }
}
