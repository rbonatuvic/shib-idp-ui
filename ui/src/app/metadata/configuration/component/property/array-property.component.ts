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

    get dataList(): { key: string, label: string }[] {
        return this.property.widget.data;
    }
}

