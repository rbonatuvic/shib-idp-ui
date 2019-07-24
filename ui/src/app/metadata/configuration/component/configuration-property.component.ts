import { Component, Input } from '@angular/core';
import { Property } from '../../domain/model/property';

@Component({
    selector: 'configuration-property',
    template: `{{ property | json }}`
})

export class ConfigurationPropertyComponent {
    @Input() property: Property;
    @Input() columns = 1;

    constructor() { }

    getKeys(schema): string[] {
        return Object.keys(schema.properties);
    }

    getItemType(property: Property): string {
        const items = property.items;
        return items.widget ? items.widget.id : 'default';
    }

    get width(): string {
        return `${ Math.floor(100 / (this.columns + 1)) }%`;
    }
}

