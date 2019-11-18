import {
    Component, AfterViewInit, ViewChild, ElementRef,
} from '@angular/core';
import { IntegerWidget } from 'ngx-schema-form';
import { SchemaService } from '../../service/schema.service';
import { HARD_CODED_REQUIRED_MSG, REQUIRED_MSG_OVERRIDE } from '../../model/messages';

@Component({
    selector: 'float-component',
    templateUrl: `./float.component.html`
})
export class CustomFloatComponent extends IntegerWidget implements AfterViewInit {
    private _displayValue: string;
    @ViewChild('input', { static: true }) element: ElementRef;

    constructor(
        private widgetService: SchemaService
    ) {
        super();
    }

    ngAfterViewInit() {
        super.ngAfterViewInit();
        const control = this.control;
        this.formProperty.valueChanges.subscribe((newValue) => {
            if (typeof this._displayValue !== 'undefined') {
                // Ignore the model value, use the display value instead
                if (control.value !== this._displayValue) {
                    control.setValue(this._displayValue, { emitEvent: false });
                }
            } else {
                if (control.value !== newValue) {
                    control.setValue(newValue, { emitEvent: false });
                }
            }
        });
        this.formProperty.errorsChanges.subscribe((errors) => {
            control.setErrors(errors, { emitEvent: true });
            const messages = (errors || [])
                .filter(e => {
                    return e.path && e.path.slice(1) === this.formProperty.path;
                })
                .map(e => e.message);
            this.errorMessages = messages.filter((m, i) => messages.indexOf(m) === i);
        });
        control.valueChanges.subscribe((newValue) => {
            const native = (<HTMLInputElement>this.element.nativeElement);
            this._displayValue = newValue;
            this.formProperty.setValue(newValue, false);
            if (newValue === '' && native.validity.badInput) {
                this.formProperty.extendErrors([{
                    code: 'INVALID_NUMBER',
                    path: `#${this.formProperty.path}`,
                    message: 'Invalid number',
                }]);
            }
        });
    }

    get required(): boolean {
        return this.widgetService.isRequired(this.formProperty);
    }

    get minimum(): number {
        return this.required ?
            this.schema.minimum :
            this.formProperty.value === null ? null : this.schema.minimum;
    }

    getError(error: string): string {
        return HARD_CODED_REQUIRED_MSG.test(error) ? REQUIRED_MSG_OVERRIDE : error;
    }
}
