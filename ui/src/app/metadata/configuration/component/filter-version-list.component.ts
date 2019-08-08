import { Component } from '@angular/core';

const data = {
    dates: ['2019-08-08T08:40:32.015', '2019-08-08T08:40:19.266'],
    filters: [
        [
            {
                id: '1',
                name: 'Example Filter 1',
                type: 'EntityAttributesFilter',
                comparable: true
            },
            {
                id: '2',
                name: 'Example Filter 2',
                type: 'NameIdFilter',
                comparable: true
            }
        ],
        [
            {
                id: '2',
                name: 'Example Filter 2',
                type: 'NameIdFilter',
                comparable: true
            },
            {
                id: '1',
                name: 'Example Filter 1',
                type: 'EntityAttributesFilter',
                comparable: true
            }
        ],
        [
            {
                id: '4',
                name: 'Example Filter 4',
                type: 'EntityAttributesFilter',
                comparable: false
            },
            {
                id: '3',
                name: 'Example Filter 3',
                type: 'EntityAttributesFilter',
                comparable: false
            }
        ]
    ]
};

@Component({
    selector: 'filter-version-list',
    templateUrl: './filter-version-list.component.html'
})
export class FilterVersionListComponent {

    filters = data;
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
