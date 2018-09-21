/* istanbul ignore */

import { PipeTransform, Pipe, NgModule, Directive, Component, Input } from '@angular/core';

import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { CommonModule } from '@angular/common';

/*tslint:disable:component-selector */

@Pipe({
    name: 'translate'
})
export class MockTranslatePipe implements PipeTransform {

    constructor() {}

    transform(value: string, interpolated: { [prop: string]: string } = {}): any {
        return value;
    }
}

@Directive({
    selector: '[translate]'
})
export class MockTranslateDirective {
    @Input() translate: any | null;
    @Input() translateParams: any | null;
}

@Component({
    selector: 'i18n-text',
    template: '<ng-content></ng-content>'
})
export class MockI18nTextComponent {
    @Input() key: any | null;
}

@Component({
    selector: 'translate-i18n',
    template: '<ng-content></ng-content>'
})
export class MockTranslateComponent {
    @Input() key: any | null;
    @Input() params: any | null;
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

    translate (value: string, interpolated: any, messages): string {
        return messages.hasOwnProperty(value) ? messages[value] : '';
    }

    interpolate(value: string, interpolated: { [prop: string]: string } = {}): string {
        return value;
    }
}


@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [
        MockTranslatePipe,
        MockTranslateDirective,
        MockTranslateComponent,
        MockI18nTextComponent
    ],
    exports: [
        MockTranslateComponent,
        MockTranslateDirective,
        MockI18nTextComponent,
        MockTranslatePipe
    ],
    providers: [
        MockI18nService
    ]
})
export class MockI18nModule {}
