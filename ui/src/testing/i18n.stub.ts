/* istanbul ignore */

import { PipeTransform, Pipe } from '@angular/core';

import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Pipe({
    name: 'i18n',
    pure: false
})
export class MockTranslatePipe implements PipeTransform {

    constructor() {}

    transform(value: string, interpolated: { [prop: string]: string } = {}): any {
        return value;
    }
}

@Injectable()
export class MockI18nService {

    readonly path = '/messages';
    readonly base = '/api';

    constructor() { }

    get(locale: string): Observable<any> {
        return of({});
    }

    getCurrentLanguage(): string {
        return 'en';
    }

    getCurrentCountry(): string {
        return 'US';
    }

    getCurrentLocale(): string {
        return 'en-US';
    }

    interpolate(value: string, interpolated: { [prop: string]: string } = {}): string {
        return value;
    }
}
