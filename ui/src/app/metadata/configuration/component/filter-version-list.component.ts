import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FilterConfiguration, MetadataConfiguration } from '../model/metadata-configuration';
import { CONFIG_DATE_FORMAT } from '../configuration.values';
import { Observable, Subject } from 'rxjs';
import { FilterComparison } from '../model/compare';

@Component({
    selector: 'filter-version-list',
    templateUrl: './filter-version-list.component.html'
})
export class FilterVersionListComponent {

    private selectFiltersSubject: Subject<string> = new Subject();

    @Input() filters: FilterConfiguration;
    @Output() compare: EventEmitter<FilterComparison> = new EventEmitter();

    selected: string;
    comparing: string;
    selectedFilters$: Observable<MetadataConfiguration>;

    DATE_FORMAT = CONFIG_DATE_FORMAT;

    constructor() {}

    compareSelected() {
        const reduced = this.filters.filters.reduce((acc, l) => acc.concat(l), []);
        const filtered = reduced.filter(f => f && f.resourceId === this.selected);
        const type = filtered[0]['@type'];

        this.compare.emit({
            modelId: this.selected,
            modelType: type,
            models: filtered
        });
    }

    get width(): string {
        const columns = this.filters.dates.length;
        return `${Math.floor(100 / (columns + 1))}`;
    }
}
