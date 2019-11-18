import {
    Component,
} from '@angular/core';
import { IntegerWidget } from 'ngx-schema-form';
import { SchemaService } from '../../service/schema.service';
import { HARD_CODED_REQUIRED_MSG, REQUIRED_MSG_OVERRIDE } from '../../model/messages';

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

    getError(error: string): string {
        return HARD_CODED_REQUIRED_MSG.test(error) ? REQUIRED_MSG_OVERRIDE : error;
    }
}
