import { Component, Input } from '@angular/core';
import { Metadata, MetadataTypes } from '../../domain/domain.type';
import { MetadataVersion } from '../model/version';

import { CONFIG_DATE_FORMAT } from '../configuration.values';

@Component({
    selector: 'metadata-header',
    templateUrl: './metadata-header.component.html',
    styleUrls: []
})

export class MetadataHeaderComponent {
    @Input() isEnabled: boolean;
    @Input() version: MetadataVersion;
    @Input() versionNumber: number;
    @Input() isCurrent: boolean;

    DATE_FORMAT = CONFIG_DATE_FORMAT;

    constructor() {}
}

