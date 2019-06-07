import { Component, Input } from '@angular/core';
import { Property } from '../../domain/model/property';

@Component({
    selector: 'configuration-property',
    template: `{{ property | json }}`,
    styleUrls: []
})

export class ConfigurationPropertyComponent {
    @Input() property: Property;

    constructor() { }

    getKeys(schema): string[] {
        return Object.keys(schema.properties);
    }

    getItemType(items: Property): string {
        return items.widget ? items.widget.id : 'default';
    }
}

