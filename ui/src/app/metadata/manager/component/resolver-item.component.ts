import { Component, ChangeDetectionStrategy, Input, AfterContentInit, Output } from '@angular/core';

import { MetadataEntity, MetadataResolver } from '../../domain/model';
import { EntityItemComponent } from './entity-item.component';
import { EventEmitter } from 'events';

@Component({
    selector: 'resolver-item',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './resolver-item.component.html',
    styleUrls: ['./resolver-item.component.scss']
})
export class ResolverItemComponent extends EntityItemComponent {
    @Input() entity: MetadataEntity;
}
