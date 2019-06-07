import { Component, Input } from '@angular/core';
import { Property } from '../../domain/model/property';
import { ConfigurationPropertyComponent } from './configuration-property.component';

@Component({
    selector: 'object-property',
    templateUrl: './object-property.component.html',
    styleUrls: []
})

export class ObjectPropertyComponent extends ConfigurationPropertyComponent {
    @Input() property: Property;

    constructor() {
        super();
    }
}

