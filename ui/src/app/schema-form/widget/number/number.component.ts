import {
    Component,
} from '@angular/core';
import { IntegerWidget } from 'ngx-schema-form';
import { SchemaService } from '../../service/schema.service';

@Component({
    selector: 'integer-component',
    templateUrl: `./number.component.html`
})
export class CustomIntegerComponent extends IntegerWidget {
    constructor(
        private widgetService: SchemaService
    ) {
        super();
    }

    get required(): boolean {
        return this.widgetService.isRequired(this.formProperty);
    }
}
