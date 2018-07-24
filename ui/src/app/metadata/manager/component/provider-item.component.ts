import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

import { MetadataProvider } from '../../domain/model';
import { EntityItemComponent } from './entity-item.component';

@Component({
    selector: 'provider-item',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './provider-item.component.html',
    styleUrls: ['./provider-item.component.scss']
})

export class ProviderItemComponent extends EntityItemComponent {
    @Input() provider: MetadataProvider;
}
