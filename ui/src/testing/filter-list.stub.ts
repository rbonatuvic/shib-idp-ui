import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MetadataFilter } from '../app/metadata/domain/model';
import { NAV_FORMATS } from '../app/metadata/domain/component/editor-nav.component';

/* tslint:disable */
@Component({
    selector: 'filter-list',
    template: `<div></div>`
})
export class FilterListComponentStub {
    @Input() filters: MetadataFilter[];
    @Input() disabled: boolean;

    @Output() onUpdateOrderUp: EventEmitter<MetadataFilter> = new EventEmitter();
    @Output() onUpdateOrderDown: EventEmitter<MetadataFilter> = new EventEmitter();
    @Output() onRemove: EventEmitter<string> = new EventEmitter();
    @Output() onToggleEnabled: EventEmitter<MetadataFilter> = new EventEmitter();

    formats = NAV_FORMATS;
}

/* tslint:disable */
@Component({
    selector: 'filter-configuration-list',
    template: `<div></div>`
})
export class FilterConfigurationListComponentStub extends FilterListComponentStub {}
