import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';

import { MetadataEntity } from '../../domain/model';
import { MetadataTypes } from '../../domain/domain.type';

@Component({
    selector: 'entity-item',
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: '',
    styleUrls: []
})
export class EntityItemComponent {
    types = MetadataTypes;
    @Input() isOpen: boolean;
    @Input() allowDelete: boolean;
    @Input() showAdminFunctions: boolean;
    @Output() toggleEnabled = new EventEmitter();
    @Output() select = new EventEmitter();
    @Output() toggle = new EventEmitter();
    @Output() preview = new EventEmitter();
    @Output() delete = new EventEmitter();
    @Output() history = new EventEmitter();
}
