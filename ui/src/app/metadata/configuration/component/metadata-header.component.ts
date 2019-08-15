import { Component, Input } from '@angular/core';
import { Metadata } from '../../domain/domain.type';

@Component({
    selector: 'metadata-header',
    templateUrl: './metadata-header.component.html',
    styleUrls: []
})

export class MetadataHeaderComponent {
    @Input() isEnabled: boolean;
    @Input() version: Metadata;
    @Input() isCurrent: boolean;

    constructor() {}
}

