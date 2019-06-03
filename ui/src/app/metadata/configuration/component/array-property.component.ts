import { Component, Input } from '@angular/core';
import { Property } from '../../domain/model/property';
import { Observable, of } from 'rxjs';
import { AttributesService } from '../../domain/service/attributes.service';
import { ConfigurationPropertyComponent } from './configuration-property.component';

@Component({
    selector: 'array-property',
    templateUrl: './array-property.component.html',
    styleUrls: []
})

export class ArrayPropertyComponent extends ConfigurationPropertyComponent {
    @Input() property: Property;

    constructor(
        private attrService: AttributesService
    ) {
        super();
    }

    getKeys(schema): string[] {
        return Object.keys(schema.properties);
    }

    get attributeList$(): Observable<{ key: string, label: string }[]> {
        if (this.property.widget && this.property.widget.hasOwnProperty('data')) {
            return of(this.property.widget.data);
        }
        if (this.property.widget && this.property.widget.hasOwnProperty('dataUrl')) {
            return this.attrService.query(this.property.widget.dataUrl);
        }
        return of([]);
    }
}

