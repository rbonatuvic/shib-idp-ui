import { Component, OnChanges } from '@angular/core';

import { ControlWidget } from 'ngx-schema-form';
import { SchemaService } from '../../service/schema.service';

@Component({
    selector: 'datalist-component',
    templateUrl: `./datalist.component.html`
})
export class DatalistComponent extends ControlWidget {
    constructor(
        private widgetService: SchemaService
    ) {
        super();
    }

    get required(): boolean {
        return this.widgetService.isRequired(this.formProperty);
    }
}
