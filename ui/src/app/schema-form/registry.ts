import { DefaultWidgetRegistry } from 'ngx-schema-form';
import { BooleanRadioComponent } from './widget/boolean-radio/boolean-radio.component';
import { FieldsetComponent } from './widget/fieldset/fieldset.component';
import { CustomStringComponent } from './widget/text/string.component';

export class CustomWidgetRegistry extends DefaultWidgetRegistry {
    constructor() {
        super();

        this.register('boolean-radio', BooleanRadioComponent);
        this.register('fieldset', FieldsetComponent);
        this.register('custom-string', CustomStringComponent);
    }
}
