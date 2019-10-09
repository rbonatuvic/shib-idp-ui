import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';

import { MetadataEntity } from '../app/metadata/domain/model';

@Component({
    selector: 'resolvers-list',
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `<div></div>`,
    styleUrls: []
})
export class MockResolversListComponent {
    @Input() entities: MetadataEntity[];

    @Output() scroll: EventEmitter<null> = new EventEmitter();
    @Output() delete: EventEmitter<MetadataEntity> = new EventEmitter();

    @Output() toggleEnabled: EventEmitter<MetadataEntity> = new EventEmitter();
}
