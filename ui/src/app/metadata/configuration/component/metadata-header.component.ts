import { Component, Input } from '@angular/core';
import { Metadata, MetadataTypes } from '../../domain/domain.type';
import { MetadataResolver } from '../../domain/model';

@Component({
    selector: 'metadata-header',
    templateUrl: './metadata-header.component.html',
    styleUrls: []
})

export class MetadataHeaderComponent {
    @Input() metadata: Metadata;
    constructor() {}

    get isEnabled(): boolean {
        return this.metadata ? ('serviceEnabled' in this.metadata) ? this.metadata.serviceEnabled : this.metadata.enabled : false;
    }
}

