import { Component, Input } from '@angular/core';
import { FilterConfiguration } from '../model/metadata-configuration';



@Component({
    selector: 'filter-version-list',
    templateUrl: './filter-version-list.component.html'
})
export class FilterVersionListComponent {

    @Input() filters: FilterConfiguration;
    selected: string;
    comparing: string;

    constructor() {

    }

    compare(id: string): void {
        this.comparing = id;
    }

    get width(): string {
        const columns = this.filters.dates.length;
        return `${Math.floor(100 / (columns + 1))}`;
    }
}
