import { Component, Input } from '@angular/core';
import { MetadataConfiguration } from '../app/metadata/configuration/model/metadata-configuration';
import { MetadataVersion } from '../app/metadata/configuration/model/version';

/* tslint:disable */
@Component({
    selector: 'metadata-configuration',
    template: ``
})
export class MetadataConfigurationComponentStub {
    @Input() configuration: MetadataConfiguration;
}

@Component({
    selector: 'metadata-header',
    template: ``
})
export class MetadataHeaderComponentStub {
    @Input() isEnabled: boolean;
    @Input() version: MetadataVersion;
    @Input() versionNumber: number;
    @Input() isCurrent: boolean;
}
