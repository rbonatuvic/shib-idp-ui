import { BooleanRadioComponent } from './widget/boolean-radio/boolean-radio.component';
import { FieldsetComponent } from './widget/fieldset/fieldset.component';
import { CustomStringComponent } from './widget/text/string.component';

import { WidgetRegistry } from 'ngx-schema-form';

import { ArrayWidget } from 'ngx-schema-form';
import { ButtonWidget } from 'ngx-schema-form';
import { CheckboxWidget } from 'ngx-schema-form';
import { FileWidget } from 'ngx-schema-form';
import { IntegerWidget } from 'ngx-schema-form';
import { ObjectWidget } from 'ngx-schema-form';
import { RadioWidget } from 'ngx-schema-form';
import { RangeWidget } from 'ngx-schema-form';
import { TextAreaWidget } from 'ngx-schema-form';
import { CustomSelectComponent } from './widget/select/select.component';
import { DatalistComponent } from './widget/datalist/datalist.component';
import { CustomCheckboxComponent } from './widget/check/checkbox.component';


export class CustomWidgetRegistry extends WidgetRegistry {
    constructor() {
        super();

        /* Custom */
        this.register('string', CustomStringComponent);
        this.register('search', CustomStringComponent);
        this.register('tel', CustomStringComponent);
        this.register('url', CustomStringComponent);
        this.register('email', CustomStringComponent);
        this.register('password', CustomStringComponent);
        this.register('color', CustomStringComponent);
        this.register('date', CustomStringComponent);
        this.register('date-time', CustomStringComponent);
        this.register('time', CustomStringComponent);

        this.register('boolean-radio', BooleanRadioComponent);
        this.register('fieldset', FieldsetComponent);

        this.register('select', CustomSelectComponent);
        this.register('boolean', CustomCheckboxComponent);
        this.register('checkbox', CustomCheckboxComponent);

        this.register('datalist', DatalistComponent);

        /* NGX-Form */
        this.register('array', ArrayWidget);
        this.register('object', ObjectWidget);

        this.register('integer', IntegerWidget);
        this.register('number', IntegerWidget);
        this.register('range', RangeWidget);

        this.register('textarea', TextAreaWidget);

        this.register('file', FileWidget);
        this.register('radio', RadioWidget);

        this.register('button', ButtonWidget);

        this.setDefaultWidget(CustomStringComponent);
    }
}
