import { Component, Input } from '@angular/core';
import { Property } from '../model/property';
import { Observable, of } from 'rxjs';
import { AttributesService } from '../service/attributes.service';

@Component({
    selector: 'summary-property',
    templateUrl: './summary-property.component.html',
    styleUrls: []
})

export class SummaryPropertyComponent {
    @Input() property: Property;

    constructor(
        private attrService: AttributesService
    ) {}

    getKeys(schema): string[] {
        return Object.keys(schema.properties);
    }

    getItemType(items: Property): string {
        return items.widget ? items.widget.id : 'default';
    }

    get attributeList$(): Observable<{key: string, label: string}[]> {
        if (this.property.widget && this.property.widget.hasOwnProperty('data')) {
            return of(this.property.widget.data);
        }
        if (this.property.widget && this.property.widget.hasOwnProperty('dataUrl')) {
            return this.attrService.query(this.property.widget.dataUrl);
        }
        return of([]);
    }
}

