import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'valid-form-icon',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './valid-form-icon.component.html'
})
export class ValidFormIconComponent {
    @Input() status: string;

    constructor() {}
}
