import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { MetadataConfiguration } from '../model/metadata-configuration';
import { Property } from '../../domain/model/property';
import Section from '../model/section';

@Component({
    selector: 'metadata-configuration',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './metadata-configuration.component.html',
    styleUrls: []
})
export class MetadataConfigurationComponent {
    @Input() configuration: MetadataConfiguration;

    constructor() { }

    edit(section: Section): void {
        console.log(section);
    }
}
