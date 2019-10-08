import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';

import { MetadataEntity } from '../../domain/model';

@Component({
    selector: 'resolvers-list',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './resolvers-list.component.html',
    styleUrls: []
})
export class ResolversListComponent {
    @Input() entities: MetadataEntity[];

    @Output() scroll: EventEmitter<null> = new EventEmitter();
    @Output() delete: EventEmitter<MetadataEntity> = new EventEmitter();

    @Output() toggleEnabled: EventEmitter<MetadataEntity> = new EventEmitter();
}
