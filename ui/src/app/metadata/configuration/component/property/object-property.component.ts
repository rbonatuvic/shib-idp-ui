import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Property } from '../../../domain/model/property';
import { ConfigurationPropertyComponent } from './configuration-property.component';

@Component({
    selector: 'object-property',
    templateUrl: './object-property.component.html',
    styleUrls: []
})

export class ObjectPropertyComponent extends ConfigurationPropertyComponent {
    @Input() property: Property;
    @Output() preview: EventEmitter<any> = new EventEmitter();

    constructor() {
        super();
    }
}

