import { Directive, Self, HostBinding, Input } from '@angular/core';
import * as constants from '../../shared/constant';

@Directive({
    selector: 'input[type="text"].form-control,textarea.form-control'
})
export class InputDefaultsDirective {
    public constructor() { }

    @Input() disableDefaults = false;

    @HostBinding('attr.maxlength')
    get maxlength() {
        return this.disableDefaults ? null : constants.DEFAULT_FIELD_MAX_LENGTH;
    }
}
