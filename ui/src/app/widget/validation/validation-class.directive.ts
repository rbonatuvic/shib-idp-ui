import { Directive, Self, HostBinding, Input } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
    selector: '[formControlName],[ngModel],[formControl]'
})
export class ValidationClassDirective {
    public constructor(
        @Self() private ngCtrl: NgControl
    ) { }

    @Input() disableValidation = false;

    @HostBinding('class.is-invalid')
    get hasErrors() {
        const ctrl = this.ngCtrl.control;
        return (ctrl.invalid && this.isTouched) && !this.disableValidation;
    }

    @HostBinding('class.is-valid')
    get hasSuccess() {
        const ctrl = this.ngCtrl.control;
        return (ctrl.valid && this.isTouched) && !this.disableValidation;
    }

    get isTouched() {
        const ctrl = this.ngCtrl.control;
        return ctrl.touched;
    }
} /* istanbul ignore next */
