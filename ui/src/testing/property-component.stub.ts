import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Property } from '../app/metadata/domain/model/property';
import { Observable, of } from 'rxjs';

@Component({
    selector: 'configuration-property',
    template: ``
})
export class ConfigurationPropertyComponentStub {

    @Input() property: Property;
    @Input() columns = 1;

    constructor() { }

    getKeys(schema): string[] {
        return Object.keys(schema.properties);
    }

    getItemType(property: Property): string {
        return 'default';
    }

    get width(): string {
        return `100%`;
    }
}

@Component({
    selector: 'array-property',
    template: ''
})
export class ArrayPropertyComponentStub extends ConfigurationPropertyComponentStub {

    @Output() preview: EventEmitter<any> = new EventEmitter();

    range = [];

    constructor() {
        super();
    }

    isUrl(str: string): boolean {
        return true;
    }

    get attributeList$(): Observable<{ key: string, label: string }[]> {
        return of([]);
    }
}

@Component({
    selector: 'primitive-property',
    template: '',
    styleUrls: []
})
export class PrimitivePropertyComponentStub extends ConfigurationPropertyComponentStub {}
