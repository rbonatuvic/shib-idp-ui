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
        const control = this.control;

        if (this.formProperty.value) {
            control.setValue(this.formProperty.value, { emitEvent: false });
        }
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
            if (newValue === '' && this.required) {
                this.formProperty.setValue(native.valueAsNumber, false);
                this.formProperty.extendErrors([{
                    code: 'INVALID_NUMBER',
                    path: `#${this.formProperty.path}`,
                    message: 'Invalid number',
                }]);
            } else if (newValue === '' && !this.required) {
                this.formProperty.setValue(null, false);
            } else {
                this.formProperty.setValue(newValue, false);
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

    get showHint(): boolean {
        return (this.control.touched ? !this.showError : true) && this.schema.widget.help;
    }

    get showError(): boolean {
        return !!this.errorMessages && this.errorMessages.length > 0;
    }
}
