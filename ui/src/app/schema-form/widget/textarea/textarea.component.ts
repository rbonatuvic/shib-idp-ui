import { Component } from '@angular/core';

import { TextAreaWidget } from 'ngx-schema-form';
import { SchemaService } from '../../service/schema.service';

@Component({
  selector: 'textarea-component',
  templateUrl: `./textarea.component.html`
})
export class CustomTextAreaComponent extends TextAreaWidget {
    constructor(
        private widgetService: SchemaService
    ) {
        super();
    }

    get required(): boolean {
        return this.widgetService.isRequired(this.formProperty);
    }
}
