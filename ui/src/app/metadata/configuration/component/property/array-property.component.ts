import { Component, Input, OnChanges, Output, EventEmitter } from '@angular/core';
import { Property } from '../../../domain/model/property';
import { Observable, of } from 'rxjs';
import { AttributesService } from '../../../domain/service/attributes.service';
import { ConfigurationPropertyComponent } from './configuration-property.component';
import UriValidator from '../../../../shared/validation/uri.validator';

@Component({
    selector: 'array-property',
    templateUrl: './array-property.component.html',
    styleUrls: ['./array-property.component.scss']
})

export class ArrayPropertyComponent extends ConfigurationPropertyComponent implements OnChanges {
    @Input() property: Property;

    @Output() preview: EventEmitter<any> = new EventEmitter();

    range = [];

    constructor(
        private attrService: AttributesService
    ) {
        super();
    }

    ngOnChanges(): void {
        const keys = this.property.value.reduce((val, version) => version ? version.length > val ? version.length : val : val, 0);
        this.range = [...Array(keys).keys()];
    }

    isUrl(str: string): boolean {
        return UriValidator.isUri(str);
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

