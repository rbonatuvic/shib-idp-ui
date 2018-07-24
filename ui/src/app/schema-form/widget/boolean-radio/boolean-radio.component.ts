import { Component, AfterViewInit } from '@angular/core';
import { ControlWidget } from 'ngx-schema-form';

@Component({
    selector: 'boolean-radio',
    templateUrl: './boolean-radio.component.html',
    styleUrls: ['./boolean-radio.component.scss']
})
export class BooleanRadioComponent extends ControlWidget implements AfterViewInit {
    ngAfterViewInit(): void {
        super.ngAfterViewInit();
        if (this.schema.readOnly) {
            this.control.disable();
        } else {
            this.control.enable();
        }
    }
}
