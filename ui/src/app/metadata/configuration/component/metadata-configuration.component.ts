import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { WizardStep } from '../../../wizard/model';
import Section from '../model/section';
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
