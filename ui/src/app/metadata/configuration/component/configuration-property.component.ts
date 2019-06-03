import { Component, Input } from '@angular/core';
import { Property } from '../../domain/model/property';

@Component({
    selector: 'configuration-property',
    templateUrl: './configuration-property.component.html',
    styleUrls: []
})

export class ConfigurationPropertyComponent {
    @Input() property: Property;

    constructor() { }

    getItemType(items: Property): string {
        return items.widget ? items.widget.id : 'default';
    }
}

