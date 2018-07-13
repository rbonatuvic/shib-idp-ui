import { Component } from '@angular/core';
import { StringWidget } from 'ngx-schema-form';
import { Validators } from '@angular/forms';
import { SchemaService } from '../../service/schema.service';

@Component({
    selector: 'custom-string',
    templateUrl: `./string.component.html`,
    styleUrls: ['../widget.component.scss']
})
export class CustomStringComponent extends StringWidget {

    constructor(
        private widgetService: SchemaService
    ) {
        super();
    }

    get required(): boolean {
        return this.widgetService.isRequired(this.formProperty);
    }
}
