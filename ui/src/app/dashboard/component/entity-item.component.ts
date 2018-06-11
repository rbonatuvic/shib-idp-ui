import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';

import { MetadataEntity, DomainEntityKinds } from '../../domain/domain.type';

@Component({
    selector: 'entity-item',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './entity-item.component.html',
    styleUrls: ['./entity-item.component.scss']
})
export class EntityItemComponent {

    types = DomainEntityKinds;

    @Input() entity: MetadataEntity;
    @Input() isOpen: boolean;
    @Output() select = new EventEmitter<MetadataEntity>();
    @Output() toggle = new EventEmitter<MetadataEntity>();
    @Output() preview = new EventEmitter<MetadataEntity>();
    @Output() delete = new EventEmitter<MetadataEntity>();

} /* istanbul ignore next */
