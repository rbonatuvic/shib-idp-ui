import { Component, AfterViewInit } from '@angular/core';

import { SelectWidget } from 'ngx-schema-form';
import { SchemaService } from '../../service/schema.service';

@Component({
    selector: 'select-component',
    templateUrl: `./select.component.html`
})
export class CustomSelectComponent extends SelectWidget implements AfterViewInit {
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
}
