import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Property } from '../../domain/model/property';
import { ConfigurationPropertyComponent } from './configuration-property.component';

@Component({
    selector: 'filter-target-property',
    templateUrl: './filter-target-property.component.html',
    styleUrls: []
})
export class FilterTargetPropertyComponent extends ConfigurationPropertyComponent {
    @Input() parent: Property;

    @Output() preview: EventEmitter<any> = new EventEmitter();

    constructor() {
        super();
    }

    onPreview(data: any) {
        this.preview.emit({
            parent: this.parent,
            data
        });
    }
}

