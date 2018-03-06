import { Component, Input } from '@angular/core';

@Component({
    selector: 'i18n-text',
    templateUrl: './i18n-text.component.html'
})
export class I18nTextComponent {
    @Input() key: string;

    constructor() { }
}
