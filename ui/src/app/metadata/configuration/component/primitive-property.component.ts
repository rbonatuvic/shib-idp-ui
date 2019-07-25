import { Component, Input } from '@angular/core';
import { ConfigurationPropertyComponent } from './configuration-property.component';

@Component({
    selector: 'primitive-property',
    templateUrl: './primitive-property.component.html',
    styleUrls: []
})
export class PrimitivePropertyComponent extends ConfigurationPropertyComponent {
    constructor() {
        super();
    }
}

