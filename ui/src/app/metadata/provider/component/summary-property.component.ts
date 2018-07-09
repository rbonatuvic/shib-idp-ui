import { Component, Input } from '@angular/core';
import { Property } from '../model/property';

@Component({
    selector: 'summary-property',
    templateUrl: './summary-property.component.html',
    styleUrls: []
})

export class SummaryPropertyComponent {
    @Input() property: Property;
}

