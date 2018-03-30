import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { MetadataProvider } from '../../domain/model/metadata-provider';

@Component({
    selector: 'provider-item',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './provider-item.component.html',
    styleUrls: ['./provider-item.component.scss']
})
export class ProviderItemComponent {

    @Input() provider: MetadataProvider;
    @Input() isOpen: boolean;
    @Output() select = new EventEmitter<MetadataProvider>();
    @Output() toggle = new EventEmitter<MetadataProvider>();
    @Output() preview = new EventEmitter<MetadataProvider>();
    @Output() delete = new EventEmitter<MetadataProvider>();

} /* istanbul ignore next */
