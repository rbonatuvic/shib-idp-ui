import { Component } from '@angular/core';

import { SelectWidget } from 'ngx-schema-form';
import { SchemaService } from '../../service/schema.service';

@Component({
    selector: 'select-component',
    templateUrl: `./select.component.html`
})
export class CustomSelectComponent extends SelectWidget {
    constructor(
        private widgetService: SchemaService
    ) {
        super();
    }

    get required(): boolean {
        return this.widgetService.isRequired(this.formProperty);
    }
}
