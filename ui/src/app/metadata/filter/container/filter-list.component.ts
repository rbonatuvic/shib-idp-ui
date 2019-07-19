import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MetadataFilter } from '../../domain/model';

import {} from '../../filter/action/collection.action';
import { NAV_FORMATS } from '../../domain/component/editor-nav.component';

@Component({
    selector: 'filter-list',
    templateUrl: './filter-list.component.html',
    styleUrls: ['./filter-list.component.scss']
})
export class FilterListComponent {

    @Input() filters: MetadataFilter[];
    @Input() disabled: boolean;

    @Output() onUpdateOrderUp: EventEmitter<MetadataFilter> = new EventEmitter();
    @Output() onUpdateOrderDown: EventEmitter<MetadataFilter> = new EventEmitter();
    @Output() onRemove: EventEmitter<MetadataFilter> = new EventEmitter();
    @Output() onToggleEnabled: EventEmitter<MetadataFilter> = new EventEmitter();

    formats = NAV_FORMATS;

    constructor() {}
}
