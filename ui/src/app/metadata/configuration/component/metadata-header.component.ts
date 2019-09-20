import { Component, Input } from '@angular/core';
import { Metadata } from '../../domain/domain.type';

import { CONFIG_DATE_FORMAT } from '../configuration.values';

@Component({
    selector: 'metadata-header',
    templateUrl: './metadata-header.component.html',
    styleUrls: []
})

export class MetadataHeaderComponent {
    @Input() isEnabled: boolean;
    @Input() version: Metadata;
    @Input() isCurrent: boolean;

    DATE_FORMAT = CONFIG_DATE_FORMAT;

    constructor() {}
}

