import { Component, ChangeDetectionStrategy, Input } from '@angular/core';

import { MetadataEntity } from '../../domain/model';
import { EntityItemComponent } from './entity-item.component';

@Component({
    selector: 'resolver-item',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './resolver-item.component.html',
    styleUrls: ['./resolver-item.component.scss']
})
export class ResolverItemComponent extends EntityItemComponent {
    @Input() entity: MetadataEntity;
}
