import { Component, AfterViewInit } from '@angular/core';

import { ControlWidget } from 'ngx-schema-form';
import { SchemaService } from '../../service/schema.service';
import { HARD_CODED_REQUIRED_MSG } from '../../model/messages';

@Component({
    selector: 'datalist-component',
    templateUrl: `./datalist.component.html`
})
export class DatalistComponent extends ControlWidget implements AfterViewInit {
    constructor(
        private widgetService: SchemaService
    ) {
        super();
    }

    ngAfterViewInit(): void {
        super.ngAfterViewInit();
        if (this.schema.readOnly) {
            this.control.disable();
        } else {
            this.control.enable();
        }
    }

    get required(): boolean {
        return this.widgetService.isRequired(this.formProperty);
    }

    getError(error: string): string {
        return HARD_CODED_REQUIRED_MSG.test(error) ? 'message.required' : error;
    }
}
