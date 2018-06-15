import { Component, Input, OnChanges } from '@angular/core';
import { ChangeItem } from '../model/contention';

export enum ValueTypes {
    array = 'array',
    object = 'object',
    string = 'string',
    number = 'number',
    symbol = 'symbol',
    boolean = 'boolean',
    function = 'function',
    undefined = 'undefined'
}

@Component({
    selector: 'change-item',
    templateUrl: './change-item.component.html',
    styleUrls: ['./change-item.component.scss']
})
export class ChangeItemComponent implements OnChanges {

    @Input() item: ChangeItem;

    type: string;
    types = ValueTypes;

    display: any;

    constructor() {}

    ngOnChanges(): void {
        let value = this.item.value;
        this.type = this.getType(value);
        this.display = this.getValue(value);
    }

    getType(value: any): string {
        return Array.isArray(value) ? 'array' : typeof value;
    }

    getValue(val: any): any {
        switch (this.type) {
            case 'object': {
                return <ChangeItem[]>Object.keys(val).map(k => ({ label: k, value: val[k] }));
            }
            case 'array': {
                return this.parseArray(val);
            }
            default: {
                return val;
            }
        }
    }

    parseArray(list: any[]): { type: string, values: any[], headings?: string[] } {
        switch (this.getType(list[0])) {
            case 'string': {
                return {
                    type: 'string',
                    values: list
                };
            }
            default: {
                return {
                    type: 'object',
                    headings: list.reduce((arr, o) => {
                        return Object.keys(o).reduce((a, k) => {
                            if (a.indexOf(k) === -1) { a.push(k); }
                            return a;
                        }, arr);
                    }, []),
                    values: list
                };
            }
        }
    }
}
